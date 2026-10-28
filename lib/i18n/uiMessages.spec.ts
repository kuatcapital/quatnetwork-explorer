// Modified by Quat Capital, 2026-10-29: own/SDK error boundaries and locale regressions. GPL-3.0.
import { readFileSync } from 'node:fs';
import path from 'node:path';

import type { Locale } from 'configs/app/i18n';
import { describe, expect, it } from 'vitest';

import type { Dictionary } from './config';
import { createI18n, parseDictionary } from './config';
import { getUiErrorMessage, OwnUiMessageError } from './uiMessages';

const resources: Partial<Record<Locale, Dictionary>> = {};
for (const locale of [ 'en', 'ru', 'kk' ] as const) {
  resources[locale] = parseDictionary(readFileSync(path.join(process.cwd(), 'locales', `${ locale }.json`), 'utf8'));
}

describe('own interface error messages', () => {
  const instance = createI18n({ locale: 'ru', resources, error: false });

  it('translates tagged failures using the requested locale without changing the original error', () => {
    const error = Object.freeze(new OwnUiMessageError('contracts.unexpected_error', 'Something went wrong'));
    expect(getUiErrorMessage(error, instance.getFixedT('ru'))).toBe('Произошла ошибка');
    expect(getUiErrorMessage(error, instance.getFixedT('kk'))).not.toBe(error.message);
    expect(error.message).toBe('Something went wrong');
  });

  it('preserves SDK/API messages even if they match the text of our own failure', () => {
    const error = Object.freeze(new Error('Something went wrong'));
    for (const locale of [ 'ru', 'kk' ]) {
      const t = instance.getFixedT(locale);
      expect(getUiErrorMessage(error, t)).toBe(error.message);
      expect(getUiErrorMessage({ code: 4001, message: 'User rejected the request.' }, t)).toBe('User rejected the request.');
    }
  });

  it('uses localized short/retry fallbacks for missing messages', () => {
    for (const locale of [ 'ru', 'kk' ]) {
      const t = instance.getFixedT(locale);
      for (const error of [ undefined, null, new Error(''), { message: 123 } ]) {
        expect(getUiErrorMessage(error, t)).toBe(t('contracts.unexpected_error'));
        expect(getUiErrorMessage(error, t, 'contracts.try_later')).toBe(t('contracts.try_later'));
      }
    }
  });
});
