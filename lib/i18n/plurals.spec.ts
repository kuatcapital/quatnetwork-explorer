// Modified by Quat Capital, 2026-10-25: test real runtime dictionary plural forms. GPL-3.0.
import { readFileSync } from 'node:fs';
import path from 'node:path';

import type { Locale } from 'configs/app/i18n';
import { describe, expect, it } from 'vitest';

import type { Dictionary } from './config';
import { createI18n, parseDictionary } from './config';

const resources: Partial<Record<Locale, Dictionary>> = {};
for (const locale of [ 'en', 'ru', 'kk' ] as const) {
  resources[locale] = parseDictionary(readFileSync(path.join(process.cwd(), 'locales', `${ locale }.json`), 'utf8'));
}

describe('transaction confirmation counts', () => {
  it('uses correct Russian forms for 1, 2, 5 and 21 confirmations', () => {
    const instance = createI18n({ locale: 'ru', resources, error: false });
    const expected = [ '1 подтверждение блока', '2 подтверждения блока', '5 подтверждений блока', '21 подтверждение блока' ];
    [ 1, 2, 5, 21 ].forEach((count, index) => {
      expect(instance.t('transactions.block_confirmation_count', { count, value: String(count) })).toBe(expected[index]);
    });
  });

  it('uses English singular/plural and keeps Kazakh count phrases complete', () => {
    const english = createI18n({ locale: 'en', resources, error: false });
    const kazakh = createI18n({ locale: 'kk', resources, error: false });
    expect(english.t('transactions.block_confirmation_count', { count: 1, value: '1' })).toBe('1 block confirmation');
    expect(english.t('transactions.block_confirmation_count', { count: 2, value: '2' })).toBe('2 block confirmations');
    expect(kazakh.t('transactions.block_confirmation_count', { count: 1, value: '1' })).toBe('1 блок растауы');
    expect(kazakh.t('transactions.block_confirmation_count', { count: 5, value: '5' })).toBe('5 блок растауы');
  });
});
