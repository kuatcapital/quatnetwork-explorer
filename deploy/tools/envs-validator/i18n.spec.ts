// Quat Capital, 2026-10-25: localization ENV validation without loading or modifying .env presets.
import { describe, expect, it } from 'vitest';

import { i18nSchema } from './schemas/i18n';

describe('shared localization settings schema', () => {
  it('allows optional defaults and all three supported locales', async() => {
    await expect(i18nSchema.validateAt('NEXT_PUBLIC_DEFAULT_LOCALE', {})).resolves.toBeUndefined();
    for (const locale of [ 'ru', 'kk', 'en' ]) {
      await expect(i18nSchema.validateAt('NEXT_PUBLIC_DEFAULT_LOCALE', { NEXT_PUBLIC_DEFAULT_LOCALE: locale })).resolves.toBe(locale);
    }
    await expect(i18nSchema.validateAt('NEXT_PUBLIC_DEFAULT_LOCALE', { NEXT_PUBLIC_DEFAULT_LOCALE: 'de' })).rejects.toThrow();
  });

  it('accepts a same-origin path and rejects URLs or browser-normalized external paths', async() => {
    await expect(i18nSchema.validateAt('NEXT_PUBLIC_I18N_BASE_PATH', { NEXT_PUBLIC_I18N_BASE_PATH: '/assets/i18n' })).resolves.toBe('/assets/i18n');
    for (const path of [ 'https://other.example/i18n', '//other.example/i18n', '/\n/other.example/i18n', '/assets?x=y', '/\\other' ]) {
      await expect(i18nSchema.validateAt('NEXT_PUBLIC_I18N_BASE_PATH', { NEXT_PUBLIC_I18N_BASE_PATH: path })).rejects.toThrow();
    }
  });
});
