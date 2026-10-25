// Modified by Quat Capital on 2026-10-25: T18 source inventory helpers.
// Licensed under GNU GPL v3.0; see LICENSE.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import ts from 'typescript';

export const PROJECT_ROOT = fileURLToPath(new URL('../../', import.meta.url));
export const SOURCE_ROOTS = [ 'ui', 'lib', 'toolkit', 'pages', 'nextjs', 'configs' ];

const EXCLUDED_DIRECTORIES = new Set([
  'node_modules', '.git', '__tests__', '__mocks__', '__fixtures__', '__screenshots__',
  'tests', 'test', 'mocks', 'fixtures', 'generated', '__generated__',
]);
const SOURCE_EXTENSION = /\.[cm]?[jt]sx?$/u;
const TEST_SOURCE = /\.(?:pw|test|spec|stories)\.[cm]?[jt]sx?$/u;
const GENERATED_SOURCE = /\.d\.ts$|(?:^|[./-])generated(?:[./-]|$)/u;

export function portablePath(value) {
  return value.split(path.sep).join('/');
}

export async function collectSources(root = PROJECT_ROOT, roots = SOURCE_ROOTS) {
  const files = [];
  const skipped = { tests: 0, declarationsOrGenerated: 0, excludedDirectories: 0, symbolicLinks: 0 };

  async function visit(directory) {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    entries.sort((left, right) => left.name.localeCompare(right.name, 'en'));

    for (const entry of entries) {
      const absolute = path.join(directory, entry.name);

      if (entry.isSymbolicLink()) {
        skipped.symbolicLinks += 1;
      } else if (entry.isDirectory()) {
        if (EXCLUDED_DIRECTORIES.has(entry.name)) {
          skipped.excludedDirectories += 1;
        } else {
          await visit(absolute);
        }
      } else if (entry.isFile() && SOURCE_EXTENSION.test(entry.name)) {
        const relative = portablePath(path.relative(root, absolute));

        if (TEST_SOURCE.test(entry.name)) {
          skipped.tests += 1;
        } else if (GENERATED_SOURCE.test(relative)) {
          skipped.declarationsOrGenerated += 1;
        } else {
          files.push(relative);
        }
      }
    }
  }

  for (const directory of roots) {
    try {
      await visit(path.join(root, directory));
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  return { files: files.sort(), skipped };
}

export async function parseSource(root, file) {
  const source = await fs.readFile(path.join(root, file), 'utf8');
  return ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
}

export function propertyName(node) {
  if (ts.isIdentifier(node) || ts.isStringLiteralLike(node) || ts.isJsxNamespacedName(node)) {
    return ts.isJsxNamespacedName(node) ? `${ node.namespace.text }:${ node.name.text }` : node.text;
  }

  return undefined;
}

export function literalText(node) {
  if (ts.isStringLiteralLike(node)) {
    return node.text;
  }

  return undefined;
}

export function nodeLocation(sourceFile, node) {
  const location = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
  return { line: location.line + 1, column: location.character + 1 };
}
