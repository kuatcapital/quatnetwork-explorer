// Modified by Quat Capital, 2026-11-01: pinned SDK patch, refusal and state-based visibility regressions. GPL-3.0.
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';

import ts from 'typescript';

import { patchDynamic } from './patch-dynamic.mjs';

const PACKAGE = 'node_modules/@dynamic-labs/sdk-react-core';
const RELATIVE_VIEW = 'src/lib/views/EmbeddedReveal/EmbeddedRevealView/EmbeddedRevealView.';
const BEFORE = 'isVisible: !title.includes(\'Agree\')';
const AFTER = 'isVisible: Boolean(hasInjectedCredential || isPromptForExport)';
const originals = Object.fromEntries([ 'js', 'cjs' ].map(extension => {
  const installed = readFileSync(path.join(PACKAGE, RELATIVE_VIEW + extension), 'utf8').replace(/\r\n/g, '\n');
  return [ extension, installed.replace(/^\/\/ Modified by Quat Capital[^\n]+\n/, '').replace(AFTER, BEFORE) ];
}));

function fixture(run) {
  const root = mkdtempSync(path.join(tmpdir(), 'quat-dynamic-test-'));
  const packageRoot = path.join(root, PACKAGE);
  mkdirSync(path.dirname(path.join(packageRoot, RELATIVE_VIEW)), { recursive: true });
  writeFileSync(path.join(packageRoot, 'package.json'), JSON.stringify({ version: '4.74.1' }));
  for (const [ extension, source ] of Object.entries(originals)) writeFileSync(path.join(packageRoot, RELATIVE_VIEW + extension), source);
  try {
    run(root, packageRoot);
  } finally {
    // Only the fresh test-owned temporary directory is removed.
    assert.ok(path.resolve(root).startsWith(path.resolve(tmpdir()) + path.sep));
    assert.ok(path.basename(root).startsWith('quat-dynamic-test-'));
    rmSync(root, { recursive: true, force: true });
  }
}

test('Dynamic patch applies to both shipped module formats and is idempotent', () => {
  fixture((root, packageRoot) => {
    assert.equal(patchDynamic(root), 2);
    assert.equal(patchDynamic(root), 0);
    for (const extension of [ 'js', 'cjs' ]) {
      const source = readFileSync(path.join(packageRoot, RELATIVE_VIEW + extension), 'utf8');
      assert.ok(!source.includes(BEFORE));
      assert.ok(source.includes(AFTER));
    }
  });
});

test('Dynamic patch rejects a changed package version', () => {
  fixture((root, packageRoot) => {
    writeFileSync(path.join(packageRoot, 'package.json'), JSON.stringify({ version: 'different' }));
    assert.throws(() => patchDynamic(root), /Review the Dynamic export guard/);
    assert.equal(readFileSync(path.join(packageRoot, RELATIVE_VIEW + 'js'), 'utf8'), originals.js);
  });
});

test('Dynamic patch rejects unknown source before modifying either module', () => {
  fixture((root, packageRoot) => {
    writeFileSync(path.join(packageRoot, RELATIVE_VIEW + 'cjs'), originals.cjs + '\n// Changed upstream\n');
    assert.throws(() => patchDynamic(root), /Unexpected Dynamic source/);
    assert.equal(readFileSync(path.join(packageRoot, RELATIVE_VIEW + 'js'), 'utf8'), originals.js);
  });
});

test('actual installed export visibility depends on UI state under RU/KK, not translated title', () => {
  for (const extension of [ 'js', 'cjs' ]) {
    const source = readFileSync(path.join(PACKAGE, RELATIVE_VIEW + extension), 'utf8');
    const ast = ts.createSourceFile('view.js', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
    const guards = [];
    function visit(node) {
      if (ts.isPropertyAssignment(node) && node.name.getText(ast) === 'isVisible') guards.push(node.initializer.getText(ast));
      ts.forEachChild(node, visit);
    }
    visit(ast);
    assert.equal(guards.length, 1);
    for (const title of [ 'Примите условия', 'Шарттарды қабылдаңыз', 'Собственный текст' ]) {
      for (const [ hasInjectedCredential, isPromptForExport, expected ] of [
        [ false, false, false ], [ false, true, true ], [ { credential: 'test-only' }, false, true ], [ true, true, true ],
      ]) {
        assert.equal(runInNewContext(guards[0], { title, hasInjectedCredential, isPromptForExport }), expected);
      }
    }
  }
});
