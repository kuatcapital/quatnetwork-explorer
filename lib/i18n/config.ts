// Quat Capital, 2026-10-25: shared locale and runtime dictionary contracts.
import type { InitOptions, i18n as I18nInstance } from 'i18next';
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import type { Locale } from 'configs/app/i18n';
import { i18n as configuration, isLocale, SUPPORTED_LOCALES } from 'configs/app/i18n';

export interface Dictionary {
  readonly [key: string]: string | Dictionary;
}

export interface I18nSnapshot {
  readonly locale: Locale;
  readonly resources: Partial<Record<Locale, Dictionary>>;
  readonly error: boolean;
}

export const LOCALE_COOKIE = 'quat_locale';
export const NAMESPACE = 'translation';
export const MAX_DICTIONARY_BYTES = 4 * 1024 * 1024;
const MAX_DICTIONARY_DEPTH = 20;
const UNSAFE_KEYS = new Set([ '__proto__', 'constructor', 'prototype' ]);

export function localeFromCookie(cookie: string | undefined, defaultLocale: Locale = configuration.defaultLocale): Locale {
  const value = cookie?.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${ LOCALE_COOKIE }=`))?.slice(LOCALE_COOKIE.length + 1);
  return isLocale(value) ? value : defaultLocale;
}

export function emptySnapshot(locale: Locale = configuration.defaultLocale): I18nSnapshot {
  return { locale, resources: {}, error: false };
}

function interpolationSignature(value: string): string {
  const parameters = new Set<string>();
  const remaining = value.replace(/\{\{([^{}]*)\}\}/gu, (_match: string, expression: string) => {
    const body = expression.trim();
    const unescaped = body.startsWith('-');
    const name = (unescaped ? body.slice(1) : body).split(',')[0].trim();
    if (!name) throw new Error('Translation message has an empty interpolation parameter');
    parameters.add(`${ unescaped ? '-' : '' }${ name }`);
    return '';
  });
  if (remaining.includes('{{') || remaining.includes('}}')) throw new Error('Translation message has malformed interpolation braces');
  return [ ...parameters ].sort().join('|');
}

export function validateDictionary(value: unknown): Dictionary {
  let strings = 0;

  function visit(node: unknown, depth: number): Dictionary {
    if (depth > MAX_DICTIONARY_DEPTH || typeof node !== 'object' || node === null || Array.isArray(node)) {
      throw new Error('Invalid translation dictionary shape');
    }

    const result: Record<string, string | Dictionary> = {};
    for (const [ key, item ] of Object.entries(node)) {
      if (depth === 0 && key === '_meta') continue;
      if (!key || UNSAFE_KEYS.has(key)) throw new Error('Invalid translation dictionary key');
      if (typeof item === 'string' && item.trim()) {
        interpolationSignature(item);
        result[key] = item;
        strings++;
      } else {
        result[key] = visit(item, depth + 1);
      }
    }
    return result;
  }

  const dictionary = visit(value, 0);
  if (!strings) throw new Error('Translation dictionary has no messages');
  return dictionary;
}

export function parseDictionary(source: string): Dictionary {
  if (new TextEncoder().encode(source).length > MAX_DICTIONARY_BYTES) throw new Error('Translation dictionary is too large');
  return validateDictionary(JSON.parse(source));
}

export function assertCompatibleDictionary(next: Dictionary, previous?: Dictionary): void {
  if (!previous) return;
  for (const [ key, oldValue ] of Object.entries(previous)) {
    const newValue = next[key];
    if (typeof oldValue === 'string') {
      if (typeof newValue !== 'string') throw new Error('Translation update removes an existing message');
      if (interpolationSignature(newValue) !== interpolationSignature(oldValue)) {
        throw new Error('Translation update changes interpolation parameters');
      }
    } else {
      if (!newValue || typeof newValue === 'string') throw new Error('Translation update changes an existing section');
      assertCompatibleDictionary(newValue, oldValue);
    }
  }
}

export function createI18n(snapshot: I18nSnapshot, options: InitOptions = {}, configure?: (instance: I18nInstance) => void): I18nInstance {
  const resources = Object.fromEntries(Object.entries(snapshot.resources).map(([ locale, dictionary ]) => (
    [ locale, { [NAMESPACE]: structuredClone(dictionary) } ]
  )));
  const instance = createInstance();
  const missingKeys = new Set<string>();
  instance.use(initReactI18next);
  configure?.(instance);
  // Resources are already available; synchronous initialization preserves the SSR snapshot on hydration.
  void instance.init({
    supportedLngs: [ ...SUPPORTED_LOCALES ],
    lng: snapshot.locale,
    fallbackLng: [ 'ru', 'en' ],
    defaultNS: NAMESPACE,
    ns: [ NAMESPACE ],
    resources,
    initAsync: false,
    load: 'languageOnly',
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    returnNull: false,
    maxRetries: 0,
    parseMissingKeyHandler: (key) => {
      // Semantic keys only; arbitrary text or values passed by a caller must never be written to logs.
      if (/^[a-z][\w.:-]{0,150}$/i.test(key) && !missingKeys.has(key)) {
        missingKeys.add(key);
        // eslint-disable-next-line no-console
        console.warn(`[Quat i18n] Missing message: ${ instance.resolvedLanguage || instance.language }:${ key }`);
      }
      return key;
    },
    ...options,
  });
  return instance;
}
