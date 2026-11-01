// Modified by Quat Capital, 2026-11-01: language-independent Dynamic export visibility guard. GPL-3.0.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const EXPECTED_VERSION = '4.74.1';
const BEFORE = 'isVisible: !title.includes(\'Agree\')';
const AFTER = 'isVisible: Boolean(hasInjectedCredential || isPromptForExport)';
const NOTICE = '// Modified by Quat Capital, 2026-11-01: export visibility follows state, not translated title. GPL-3.0.\n';
const HASHES = {
  js: 'ad32734c6e8bc7e2ed80da8f6ed00743b31600ccac95c2887d99cee5a359babe',
  cjs: 'a51fa9858fa841550540b560fc3ad1d61687b96df802fad8769d35165a18264f',
};
const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

export function patchDynamic(root = PROJECT_ROOT) {
  const packageRoot = path.join(root, 'node_modules/@dynamic-labs/sdk-react-core');
  const manifest = JSON.parse(readFileSync(path.join(packageRoot, 'package.json'), 'utf8'));
  assert.equal(manifest.version, EXPECTED_VERSION, 'Review the Dynamic export guard before changing SDK version');
  const pending = [];
  for (const [ extension, hash ] of Object.entries(HASHES)) {
    const file = path.join(packageRoot, 'src/lib/views/EmbeddedReveal/EmbeddedRevealView', 'EmbeddedRevealView.' + extension);
    const source = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
    const patched = source.startsWith(NOTICE);
    const original = patched ? source.slice(NOTICE.length).replace(AFTER, BEFORE) : source;
    assert.equal(createHash('sha256').update(original).digest('hex'), hash, 'Unexpected Dynamic source: ' + extension);
    assert.equal(original.split(BEFORE).length, 2, 'Expected exactly one export visibility guard');
    if (patched) assert.equal(source.split(AFTER).length, 2);
    else pending.push([ file, NOTICE + source.replace(BEFORE, AFTER) ]);
  }
  // Validate both module variants before writing either.
  for (const [ file, content ] of pending) writeFileSync(file, content);
  return pending.length;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  patchDynamic();
}
