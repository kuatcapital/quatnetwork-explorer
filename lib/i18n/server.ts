// Quat Capital, 2026-10-25: server-only runtime dictionaries; never bundled as JSON imports.
import { readFile } from 'node:fs/promises';
import path from 'node:path';

import type { Locale } from 'configs/app/i18n';
import { isLocale } from 'configs/app/i18n';
import { getEnvValue } from 'configs/app/utils';

import type { Dictionary, I18nSnapshot } from './config';
import { assertCompatibleDictionary, localeFromCookie, MAX_DICTIONARY_BYTES, parseDictionary } from './config';

const REQUEST_TIMEOUT_MS = 2500;
const lastGood = new Map<Locale, Dictionary>();
const warned = new Set<Locale>();

export async function readRuntimeDictionary(locale: Locale): Promise<Dictionary> {
  if (!isLocale(locale)) throw new Error('Unsupported translation locale');
  const serverBaseUrl = getEnvValue('QUAT_I18N_SERVER_BASE_URL');
  let source: string;

  if (serverBaseUrl) {
    const url = new URL(`${ serverBaseUrl.replace(/\/$/, '') }/${ locale }.json`);
    if (![ 'http:', 'https:' ].includes(url.protocol)) throw new Error('Invalid translation server protocol');
    const response = await fetch(url, {
      cache: 'no-store',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      redirect: 'error',
    });
    if (!response.ok) throw new Error('Translation dictionary request failed');
    const length = Number(response.headers.get('content-length'));
    if (length > MAX_DICTIONARY_BYTES) throw new Error('Translation dictionary is too large');
    source = await response.text();
  } else {
    const directory = getEnvValue('QUAT_I18N_DIRECTORY') || path.join(process.cwd(), 'locales');
    source = await readFile(path.join(directory, `${ locale }.json`), 'utf8');
  }

  const dictionary = parseDictionary(source);
  assertCompatibleDictionary(dictionary, lastGood.get(locale));
  lastGood.set(locale, dictionary);
  warned.delete(locale);
  return dictionary;
}

export async function loadServerSnapshot(cookie?: string): Promise<I18nSnapshot> {
  const requestedLocale = localeFromCookie(cookie);
  const resources: Partial<Record<Locale, Dictionary>> = {};
  let requestedFailed = false;

  const locales = Array.from(new Set<Locale>([ requestedLocale, 'ru', 'en' ]));
  await Promise.all(locales.map(async(locale) => {
    try {
      resources[locale] = await readRuntimeDictionary(locale);
    } catch (error) {
      resources[locale] = lastGood.get(locale);
      if (!resources[locale]) delete resources[locale];
      if (locale === requestedLocale) requestedFailed = true;
      if (!warned.has(locale)) {
        // Only the locale is logged: remote URLs, request cookies and dictionary contents are excluded.
        // eslint-disable-next-line no-console
        console.warn(`[Quat i18n] Cannot refresh ${ locale } dictionary; retaining the last valid snapshot if available.`);
        warned.add(locale);
      }
    }
  }));

  const candidates: Array<Locale> = [ requestedLocale, 'ru', 'en' ];
  const locale = candidates.find((candidate) => resources[candidate]);
  return { locale: locale || requestedLocale, resources, error: requestedFailed };
}
