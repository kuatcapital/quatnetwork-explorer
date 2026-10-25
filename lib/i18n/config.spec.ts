// Quat Capital, 2026-10-25: locale selection, dictionary trust boundaries and SSR instance isolation.
import { describe, expect, it } from 'vitest';

import { assertCompatibleDictionary, createI18n, localeFromCookie, parseDictionary, validateDictionary } from './config';

describe('localeFromCookie', () => {
  it('uses Russian on the first visit and ignores unsupported or lookalike cookies', () => {
    expect(localeFromCookie(undefined, 'ru')).toBe('ru');
    expect(localeFromCookie('my_quat_locale=en; quat_locale=de', 'ru')).toBe('ru');
    expect(localeFromCookie('quat_locale=kk; other=en', 'ru')).toBe('kk');
    expect(localeFromCookie('a=b; quat_locale=en', 'ru')).toBe('en');
  });
});

describe('runtime dictionary validation', () => {
  it('omits metadata and preserves nested messages', () => {
    expect(validateDictionary({ _meta: { date: 2026 }, common: { retry: 'Повторить' } })).toEqual({ common: { retry: 'Повторить' } });
  });

  it('rejects malformed, empty and unsafe updates', () => {
    expect(() => parseDictionary('{broken')).toThrow();
    expect(() => validateDictionary({})).toThrow();
    expect(() => validateDictionary({ common: { retry: '' } })).toThrow();
    expect(() => validateDictionary({ common: [ 'Retry' ] })).toThrow();
    expect(() => validateDictionary({ common: { retry: '{{ }}' } })).toThrow();
    expect(() => validateDictionary({ common: { retry: '{{count}' } })).toThrow();
    expect(() => parseDictionary('{"common":{"retry":"Retry"},"__proto__":{"polluted":"yes"}}')).toThrow();
  });

  it('rejects removal/type changes of known messages while allowing additions', () => {
    const previous = { common: { retry: 'Retry', language: 'Language' } };
    expect(() => assertCompatibleDictionary({ common: { retry: 'Повторить' } }, previous)).toThrow();
    expect(() => assertCompatibleDictionary({ common: 'Раздел' }, previous)).toThrow();
    expect(() => assertCompatibleDictionary({ common: { retry: 'Повторить', language: 'Язык', loading: 'Загрузка' } }, previous)).not.toThrow();
  });

  it('allows parameter reordering, formatting and repeated use without renaming parameters', () => {
    const previous = { common: { label: '{{count}} items for {{name}}' } };
    const next = { common: { label: '{{ name }}: {{ count, number }} шт. ({{count}})' } };
    expect(() => assertCompatibleDictionary(next, previous)).not.toThrow();
  });

  it('rejects renamed, removed, added or newly unescaped interpolation parameters', () => {
    const previous = { common: { label: '{{count}} items for {{name}}' } };
    for (const label of [ '{{n}} для {{name}}', '{{name}}', '{{count}} {{name}} {{extra}}', '{{- count}} {{name}}' ]) {
      expect(() => assertCompatibleDictionary({ common: { label } }, previous)).toThrow('interpolation parameters');
    }
  });
});

describe('SSR translation isolation', () => {
  it('keeps simultaneous language instances and their resource stores independent', async() => {
    const resources = { ru: { common: { retry: 'Повторить' } }, en: { common: { retry: 'Retry' } } };
    const [ russian, english ] = await Promise.all([
      Promise.resolve(createI18n({ locale: 'ru', resources, error: false })),
      Promise.resolve(createI18n({ locale: 'en', resources, error: false })),
    ]);
    expect(russian.t('common.retry')).toBe('Повторить');
    expect(english.t('common.retry')).toBe('Retry');
    await english.changeLanguage('ru');
    expect(russian.language).toBe('ru');
    russian.addResourceBundle('ru', 'translation', { common: { retry: 'Другой' } }, true, true);
    expect(english.t('common.retry')).toBe('Повторить');
  });
});
