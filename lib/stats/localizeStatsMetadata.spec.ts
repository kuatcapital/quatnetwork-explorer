// Modified by Quat Capital, 2026-10-26: protect stats ids/data and locale-specific metadata. GPL-3.0.
import { createInstance } from 'i18next';
import { readFileSync } from 'node:fs';
import path from 'node:path';

import { parseDictionary, validateDictionary } from 'lib/i18n/config';
import { describe, expect, it } from 'vitest';

import { localizeStatsMetadata, localizeStatsSection, localizeStatsUnits } from './localizeStatsMetadata';

const fragment = parseDictionary(readFileSync(path.join(process.cwd(), 'tools/i18n/stats-metadata-translations.json'), 'utf8'));
const dictionaries = {
  en: validateDictionary(fragment.en), ru: validateDictionary(fragment.ru), kk: validateDictionary(fragment.kk),
};

async function translator(locale: string) {
  const instance = createInstance();
  await instance.init({
    lng: locale,
    fallbackLng: 'en',
    resources: {
      en: { translation: dictionaries.en }, ru: { translation: dictionaries.ru }, kk: { translation: dictionaries.kk },
    },
    interpolation: { escapeValue: false },
  });
  return instance.t.bind(instance);
}

describe('known stats metadata', () => {
  it('uses stable ids across languages while preserving numeric payloads and source objects', async() => {
    const source = Object.freeze({ id: 'totalBlocks', title: 'A renamed backend title', description: 'Custom description', value: '9007199254740993123' });
    const expected = { en: 'Total blocks', ru: 'Всего блоков', kk: 'Барлық блоктар' };
    for (const [ locale, title ] of Object.entries(expected)) {
      const translated = localizeStatsMetadata(source, await translator(locale));
      expect(translated.title).toBe(title);
      expect(translated.id).toBe(source.id);
      expect(translated.value).toBe(source.value);
    }
    expect(source.title).toBe('A renamed backend title');
  });

  it('preserves unknown/custom metric and section metadata, including reserved object names', async() => {
    const t = await translator('ru');
    for (const id of [ 'customMetric', 'constructor', '__proto__' ]) {
      const source = { id, title: 'Custom title', description: 'Custom description', units: 'KZTT' };
      expect(localizeStatsMetadata(source, t)).toBe(source);
      expect(localizeStatsSection(source, t)).toBe(source);
    }
  });

  it('preserves ticker units and uses the active chain native symbol for native transfers', async() => {
    const t = await translator('kk');
    const nativeTransfers = { id: 'newNativeCoinTransfers', title: '', description: '' };
    const transactionFee = { id: 'averageTxnFee', title: '', description: '', units: 'KZTT' };
    expect(localizeStatsMetadata(nativeTransfers, t, 'eAltyn').title).toBe('Жаңа eAltyn аударымдары');
    expect(localizeStatsMetadata(transactionFee, t).description).toContain('KZTT');
    expect(localizeStatsUnits('KZTT', t)).toBe('KZTT');
    expect(localizeStatsUnits('Bytes', t)).toBe('Байт');
    expect(localizeStatsUnits('s', t)).toBe('с');
  });

  it('translates section labels without changing section or chart ids', async() => {
    const source = { id: 'gas', title: 'Gas', charts: [ { id: 'averageGasPrice' } ] };
    const translated = localizeStatsSection(source, await translator('ru'));
    expect(translated.title).toBe('Газ');
    expect(translated.id).toBe('gas');
    expect(translated.charts).toBe(source.charts);
  });
});
