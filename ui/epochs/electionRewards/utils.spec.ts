// Modified by Quat Capital, 2026-10-26: reward grammar and protocol-value regressions. GPL-3.0.
import { readFileSync } from 'node:fs';

import { createI18n, validateDictionary } from 'lib/i18n/config';
import { describe, expect, it } from 'vitest';

import { formatRewardType, getRewardNumText } from './utils';

const source: unknown = JSON.parse(readFileSync('tools/i18n/network-transfers-translations.json', 'utf8'));
const fragment = validateDictionary(source);
const instance = createI18n({
  locale: 'ru', error: false,
  resources: {
    en: validateDictionary(fragment.en), ru: validateDictionary(fragment.ru), kk: validateDictionary(fragment.kk),
  },
});

describe('election reward presentation', () => {
  it('uses complete Russian count forms, including 21 and zero', () => {
    const t = instance.getFixedT('ru');
    expect(getRewardNumText('validator', 0, t, 'ru')).toBe('0 валидаторов');
    expect(getRewardNumText('validator', 1, t, 'ru')).toBe('1 валидатор');
    expect(getRewardNumText('validator', 2, t, 'ru')).toBe('2 валидатора');
    expect(getRewardNumText('validator', 5, t, 'ru')).toBe('5 валидаторов');
    expect(getRewardNumText('validator', 21, t, 'ru')).toBe('21 валидатор');
    expect(getRewardNumText('voter', 2, t, 'ru')).toBe('2 голосующих адреса');
  });

  it('changes language without changing the API reward type', () => {
    expect(getRewardNumText('delegated_payment', 2, instance.getFixedT('en'), 'en')).toBe('2 payments');
    expect(getRewardNumText('delegated_payment', 2, instance.getFixedT('kk'), 'kk')).toBe('2 төлем');
    expect(formatRewardType('delegated_payment')).toBe('delegated-payment');
    expect(formatRewardType('group')).toBe('group');
  });
});
