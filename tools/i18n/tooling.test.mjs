// Modified by Quat Capital on 2026-10-26: T18 tooling and plural-suffix regression fixtures.
// Licensed under GNU GPL v3.0; see LICENSE.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { planReviewedLocalization } from './localize-reviewed.mjs';

const TOOLS_DIRECTORY = fileURLToPath(new URL('./', import.meta.url));

async function removeFixture(directory, temporaryRoot) {
  const resolved = path.resolve(directory);

  if (path.dirname(resolved) !== temporaryRoot || !path.basename(resolved).startsWith('quat-i18n-')) {
    throw new Error('Refusing to remove a directory outside the temporary fixture root');
  }

  await fs.rm(directory, { recursive: true, force: true });
}

async function withFixture(callback) {
  const temporaryRoot = path.resolve(os.tmpdir());
  const directory = await fs.mkdtemp(path.join(temporaryRoot, 'quat-i18n-'));

  try {
    await callback(directory);
  } finally {
    await removeFixture(directory, temporaryRoot);
  }
}

async function writeFixture(directory, file, content) {
  const target = path.join(directory, file);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, content, 'utf8');
}

function runTool(tool, directory, ...args) {
  return spawnSync(process.execPath, [ path.join(TOOLS_DIRECTORY, tool), '--root', directory, ...args ], {
    encoding: 'utf8',
  });
}

async function writeDictionaries(directory, dictionaries) {
  for (const [ locale, dictionary ] of Object.entries(dictionaries)) {
    await writeFixture(directory, `locales/${ locale }.json`, JSON.stringify(dictionary));
  }
}

test('inventory finds JSX, labels and templates while excluding code, tests and .env files', async() => {
  await withFixture(async(directory) => {
    await writeFixture(directory, 'ui/Card.tsx', [
      'const options = [{ label: \'All blocks\', value: \'all_blocks\' }];',
      'const route = \'https://example.invalid/technical-code\';',
      'const Card = () => <section title="A block title" className="technical classes">',
      '  Hello world',
      '  <input placeholder={\'Search transactions\'}/>',
      '  <Tooltip content="Execution completed"/><Row hint="Total transaction fee"/>',
      '  <span title={`Block ${blockNumber} details`}>{ready ? \'Ready\' : \'Loading\'}</span>',
      '  <code>{\'const variable = true\'}</code>',
      '</section>;',
    ].join('\n'));
    await writeFixture(directory, 'ui/Card.pw.tsx', 'const test = <span>Excluded test</span>;');
    await writeFixture(directory, 'ui/mocks/example.tsx', 'const mock = <span>Excluded mock</span>;');
    await writeFixture(directory, 'ui/.env', 'PRIVATE=Should never be read');
    await writeFixture(directory, 'ui/types.d.ts', 'type Label = \'Excluded declaration\';');

    const result = runTool('inventory.mjs', directory, '--output', 'inventory.json');
    assert.equal(result.status, 0, result.stderr);
    const inventory = JSON.parse(await fs.readFile(path.join(directory, 'inventory.json'), 'utf8'));
    const sources = inventory.candidates.map((candidate) => candidate.source);
    assert.equal(inventory.stats.filesScanned, 1);
    assert.ok(sources.includes('Hello world'));
    assert.ok(sources.includes('All blocks'));
    assert.ok(sources.includes('A block title'));
    assert.ok(sources.includes('Search transactions'));
    assert.ok(sources.includes('Execution completed'));
    assert.ok(sources.includes('Total transaction fee'));
    assert.ok(sources.includes('Ready'));
    const template = inventory.candidates.find((candidate) => candidate.kind === 'template-expression');
    assert.equal(template.source, 'Block {{expression0}} details');
    assert.deepEqual(template.expressions, [ 'blockNumber' ]);
    assert.equal(template.reviewRequired, true);
    assert.ok(!sources.some((source) => /technical|Excluded|const variable|never be read/u.test(source)));
  });
});

test('checker accepts locale-specific plural categories and literal t/Trans aliases', async() => {
  await withFixture(async(directory) => {
    await writeDictionaries(directory, {
      en: { _meta: { license: 'GPL-3.0' }, common: { save: 'Save {{value}}' }, count_one: '{{count}} block', count_other: '{{count}} blocks' },
      ru: {
        common: { save: 'Сохранить {{value}}' },
        count_one: '{{count}} блок', count_few: '{{count}} блока', count_many: '{{count}} блоков', count_other: '{{count}} блока',
      },
      kk: { common: { save: '{{value}} сақтау' }, count_one: '{{count}} блок', count_other: '{{count}} блок' },
    });
    await writeFixture(directory, 'ui/Sample.tsx', [
      'import { Trans as Localized, useTranslation as useLabels } from \'react-i18next\';',
      'const Sample = () => {',
      '  const { t: text } = useLabels();',
      '  text(\'count\', { count: 2 });',
      '  i18n.t(\'common.save\', { value: \'x\' });',
      '  return <Localized i18nKey={\'common.save\'}/>;',
      '};',
    ].join('\n'));

    const result = runTool('check-locales.mjs', directory, '--json');
    assert.equal(result.status, 0, result.stderr || result.stdout);
    const report = JSON.parse(result.stdout);
    assert.equal(report.ok, true);
    assert.equal(report.literalReferences, 3);
    assert.equal(report.normalizedKeyCounts.ru, 2);
    assert.equal(report.leafCounts.ru, 5);
  });
});

test('checker rejects missing/empty values, mismatched interpolation and missing literal keys', async() => {
  await withFixture(async(directory) => {
    await writeDictionaries(directory, {
      en: { save: 'Save {{value}}', missingInRu: 'Other text', empty: 'A value' },
      ru: { save: 'Сохранить {{wrong}}', empty: '' },
      kk: { save: '{{value}} сақтау', missingInRu: 'Басқа мәтін', empty: 'Мән' },
    });
    await writeFixture(directory, 'ui/Sample.tsx', 'const value = t(\'absent\'); const dynamic = t(key);');
    const result = runTool('check-locales.mjs', directory, '--json');
    assert.equal(result.status, 1);
    const report = JSON.parse(result.stdout);
    assert.ok(report.errors.some((error) => error.includes('empty translation')));
    assert.ok(report.errors.some((error) => error.includes('missingInRu')));
    assert.ok(report.errors.some((error) => error.includes('interpolation variables differ')));
    assert.equal(report.errors.filter((error) => error.includes('misses literal key "absent"')).length, 3);
    assert.equal(report.dynamicReferences.length, 1);
  });
});

test('checker rejects incomplete Russian plural families and duplicate JSON properties', async() => {
  await withFixture(async(directory) => {
    await writeDictionaries(directory, {
      en: { count_one: '{{count}} block', count_other: '{{count}} blocks' },
      ru: { count_one: '{{count}} блок', count_other: '{{count}} блока' },
      kk: { count_one: '{{count}} блок', count_other: '{{count}} блок' },
    });
    await writeFixture(directory, 'locales/kk.json', '{"count_one":"{{count}} блок","count_other":"{{count}} блок","count_other":"duplicate"}');
    const result = runTool('check-locales.mjs', directory, '--skip-source', '--json');
    assert.equal(result.status, 1);
    const report = JSON.parse(result.stdout);
    assert.ok(report.errors.some((error) => error.includes('missing cardinal plural form "few"')));
    assert.ok(report.errors.some((error) => error.includes('missing cardinal plural form "many"')));
    assert.ok(report.errors.some((error) => error.includes('duplicate JSON property')));
  });
});

test('reviewed codemod localizes only exact JSX values and preserves visible inline whitespace', () => {
  const source = [
    'import React from \'react\';',
    'const Sample = () => {',
    '  return <span title="Save"> Save <b>Cancel</b> </span>;',
    '};',
  ].join('\n');
  const result = planReviewedLocalization(source, 'ui/Sample.tsx', { common: { save: 'Save', cancel: 'Cancel' } });
  assert.equal(result.changed, true);
  assert.equal(result.changes.length, 3);
  assert.equal(result.addedHooks, 1);
  assert.match(result.text, /import \{ useTranslation \} from 'react-i18next'/u);
  assert.match(result.text, /const \{ t: tQuat \} = useTranslation\(\)/u);
  assert.ok(result.text.includes('{ \' \' }{ tQuat(\'common.save\') }{ \' \' }<b>'));
  assert.ok(result.text.includes('title={ tQuat(\'common.save\') }'));
  assert.ok(result.text.startsWith('// Modified by Quat Capital, 2026-10-26'));
  assert.ok(source.includes(' Save '));
});

test('reviewed codemod reuses hook imports and adds memo dependencies without injecting callback hooks', () => {
  const source = [
    'import React from \'react\';',
    'import { useTranslation as useLabels } from \'react-i18next\';',
    'const Sample = () => {',
    '  const item = React.useMemo(() => <span>Save</span>, []);',
    '  const render = React.useCallback(() => <span title="Save"/>, [id]);',
    '  return <>{item}{render()}</>;',
    '};',
  ].join('\n');
  const result = planReviewedLocalization(source, 'ui/Sample.tsx', { common: { save: 'Save' } });
  assert.equal(result.changed, true);
  assert.equal(result.addedHooks, 1);
  assert.equal(result.memoDependencyArrays, 2);
  assert.equal(result.text.match(/const \{ t: tQuat \} = useLabels\(\)/gu)?.length, 1);
  assert.ok(result.text.includes('[ tQuat ]'));
  assert.ok(result.text.includes('[id, tQuat]'));
  assert.ok(!result.text.includes('import { useTranslation } from \'react-i18next\''));
});

test('reviewed codemod skips ambiguous values, context-dependent terms, entities and Trans/code contexts', () => {
  const source = [
    'import { Trans as Localized } from \'react-i18next\';',
    'const Sample = () => {',
    '  return <><span>Blocks</span><span>Value</span><span>From</span><span>To</span>',
    '    <code>Save</code><pre>Save</pre><Localized>Save</Localized><span>Save &amp; continue</span></>;',
    '};',
  ].join('\n');
  const dictionary = { common: { blocks: 'Blocks', value: 'Value', from: 'From', to: 'To', save: 'Save', continued: 'Save & continue' },
    navigation: { blocks: 'Blocks' } };
  const result = planReviewedLocalization(source, 'ui/Sample.tsx', dictionary);
  assert.equal(result.changed, false);
  assert.equal(result.text, source);
  assert.ok(result.skip.some((item) => item.reason === 'ambiguous-dictionary-value'));
  assert.equal(result.skip.filter((item) => item.reason === 'context-sensitive-English-value').length, 3);
  assert.equal(result.skip.filter((item) => item.reason === 'Trans-or-code-context').length, 3);
});

test('reviewed codemod skips implicit components, class methods, templates and unsafe scopes/memos', () => {
  const source = [
    'const Implicit = () => <span>Save</span>;',
    'class Example { render() { return <span>Save</span>; } }',
    'const Conflict = () => { const tQuat = other; return <span>Save</span>; };',
    'const Memo = () => { return React.useMemo(() => <span>Save</span>, dependencies); };',
    'const Template = () => { return <span title={`Save ${value}`}/>; };',
  ].join('\n');
  const result = planReviewedLocalization(source, 'ui/Sample.tsx', { common: { save: 'Save' } });
  assert.equal(result.changed, false);
  assert.ok(result.skip.some((item) => item.reason === 'no-block-body-component-or-hook'));
  assert.ok(result.skip.some((item) => item.reason === 'tQuat-scope-conflict'));
  assert.ok(result.skip.some((item) => item.reason === 'memo-without-literal-dependency-array'));
});

test('reviewed codemod leaves English noun/suffix combinations for a complete plural message', () => {
  const source = [
    'const Sample = () => {',
    '  return <><span>{count} Domain{count > 1 ? "s" : ""}</span>',
    '    <span>{count} transaction{count === 1 ? "" : "s"}</span><span>Address{count > 1 ? "es" : ""}</span></>;',
    '};',
  ].join('\n');
  const result = planReviewedLocalization(source, 'ui/Sample.tsx', {
    terms: { domain: 'Domain', transaction: 'transaction', address: 'Address' },
  });
  assert.equal(result.changed, false);
  assert.equal(result.text, source);
  assert.equal(result.skip.filter((item) => item.reason === 'English-plural-suffix').length, 3);
});

test('reviewed codemod reuses an existing tQuat hook and is idempotent', () => {
  const source = [
    'import { useTranslation } from \'react-i18next\';',
    'const Sample = () => {',
    '  const { t: tQuat } = useTranslation();',
    '  return <span>Save</span>;',
    '};',
  ].join('\n');
  const dictionary = { common: { save: 'Save' } };
  const result = planReviewedLocalization(source, 'ui/Sample.tsx', dictionary);
  assert.equal(result.changed, true);
  assert.equal(result.addedHooks, 0);
  assert.equal(result.text.match(/const \{ t: tQuat \} = useTranslation\(\)/gu)?.length, 1);
  const second = planReviewedLocalization(result.text, 'ui/Sample.tsx', dictionary);
  assert.equal(second.changed, false);
  assert.equal(second.text, result.text);
});

test('reviewed codemod handles aliased React memos and skips shadowed hooks/effect callbacks', () => {
  const source = [
    'import { useMemo as memoize, useEffect as effect } from \'react\';',
    'import { useTranslation as useLabels } from \'react-i18next\';',
    'const Sample = () => {',
    '  const item = memoize(() => <span>Save</span>, []);',
    '  effect(() => { setItem(<span>Save</span>); }, []);',
    '  return item;',
    '};',
    'const Shadow = (useLabels) => { return <span>Save</span>; };',
  ].join('\n');
  const result = planReviewedLocalization(source, 'ui/Sample.tsx', { common: { save: 'Save' } });
  assert.equal(result.changed, true);
  assert.equal(result.changes.length, 1);
  assert.equal(result.memoDependencyArrays, 1);
  assert.ok(result.skip.some((item) => item.reason === 'tQuat-scope-conflict'));
  assert.ok(result.skip.some((item) => item.reason === 'memo-without-literal-dependency-array'));
});
