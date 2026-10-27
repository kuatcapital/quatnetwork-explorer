// Modified by Quat Capital, 2026-10-27: CSV date errors follow locale changes. GPL-3.0.
// Modified by Quat Capital, 2026-10-26: validation messages follow language changes without resubmission. GPL-3.0.
import { createI18n } from 'lib/i18n/config';
import { describe, expect, it } from 'vitest';

import { getFormFieldErrorText } from './getFormFieldErrorText';

describe('client validation messages', () => {
  const instance = createI18n({
    locale: 'ru',
    error: false,
    resources: {
      ru: { toolkit: { invalid_address: 'Неверный адрес', invalid_format: 'Неверный формат' }, csvExportUi: { invalid_date: 'Неверная дата' } },
      kk: { toolkit: { invalid_address: 'Мекенжай қате', invalid_format: 'Пішімі қате' }, csvExportUi: { invalid_date: 'Күн қате' } },
    },
  });

  it('translates an existing error using the current render language', () => {
    const error = { type: 'address', message: 'Incorrect address format' };
    expect(getFormFieldErrorText(error, instance.getFixedT('ru'))).toBe('Неверный адрес');
    expect(getFormFieldErrorText(error, instance.getFixedT('kk'))).toBe('Мекенжай қате');
  });

  it('translates a pattern fallback and keeps missing errors empty', () => {
    expect(getFormFieldErrorText({ type: 'pattern' }, instance.getFixedT('kk'))).toBe('Пішімі қате');
    expect(getFormFieldErrorText(undefined, instance.getFixedT('ru'))).toBeUndefined();
  });

  it('translates an existing CSV date validation error without resubmission', () => {
    const error = { type: 'validate', message: 'Incorrect date' };
    expect(getFormFieldErrorText(error, instance.getFixedT('ru'))).toBe('Неверная дата');
    expect(getFormFieldErrorText(error, instance.getFixedT('kk'))).toBe('Күн қате');
  });

  it('preserves backend, manually assigned and unknown messages', () => {
    for (const type of [ 'server', 'manual' ]) {
      expect(getFormFieldErrorText({ type, message: 'Incorrect address format' }, instance.getFixedT('ru'))).toBe('Incorrect address format');
    }
    expect(getFormFieldErrorText({ type: 'validate', message: 'custom payload' }, instance.getFixedT('ru'))).toBe('custom payload');
  });
});
