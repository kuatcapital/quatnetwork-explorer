// Quat Capital, 2026-10-25: validated runtime HTTP translation loading and safe reloads.
import type { i18n as I18nInstance } from 'i18next';
import HttpBackend from 'i18next-http-backend';

import type { Locale } from 'configs/app/i18n';
import { i18n as configuration, isLocale } from 'configs/app/i18n';

import type { Dictionary, I18nSnapshot } from './config';
import { assertCompatibleDictionary, createI18n, MAX_DICTIONARY_BYTES, NAMESPACE, parseDictionary, validateDictionary } from './config';

const REQUEST_TIMEOUT_MS = 5000;

async function fetchDictionary(url: string): Promise<Dictionary> {
  const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS), redirect: 'error' });
  if (!response.ok) throw new Error('Translation dictionary request failed');
  const length = Number(response.headers.get('content-length'));
  if (length > MAX_DICTIONARY_BYTES) throw new Error('Translation dictionary is too large');
  return parseDictionary(await response.text());
}

function attachHttpBackend(instance: I18nInstance): void {
  const backend = new HttpBackend(undefined, {
    loadPath: `${ configuration.basePath }/{{lng}}.json`,
    // Validate before invoking i18next's success callback. Invalid updates cannot overwrite a good resource bundle.
    request: async(_options, url, _payload, callback) => {
      const locale = /\/(ru|kk|en)\.json$/.exec(url)?.[1];
      if (!isLocale(locale)) {
        callback(new Error('Unsupported translation locale'), { status: 400, data: '' });
        return;
      }
      try {
        let dictionary: Dictionary;
        try {
          dictionary = await fetchDictionary(url);
        } catch (error) {
          // The API route supports standalone Next.js deployments without the external assets container.
          dictionary = await fetchDictionary(`/api/i18n/${ locale }`);
        }
        const previous: unknown = instance.getResourceBundle(locale, NAMESPACE);
        assertCompatibleDictionary(dictionary, previous ? validateDictionary(previous) : undefined);
        callback(null, { status: 200, data: JSON.stringify(dictionary) });
      } catch (error) {
        callback(new Error('Translation dictionary unavailable'), { status: 503, data: '' });
      }
    },
    reloadInterval: false,
  });
  instance.use(backend);
}

export function createClientI18n(snapshot: I18nSnapshot): I18nInstance {
  // Register the backend before init, but resources prevent asynchronous requests during SSR/hydration.
  return createI18n(snapshot, {}, attachHttpBackend);
}

interface LocaleRefreshResult {
  readonly locale: Locale;
  readonly error: boolean;
}

export async function refreshLocale(instance: I18nInstance, requested: Locale): Promise<LocaleRefreshResult> {
  const locales: Array<Locale> = Array.from(new Set<Locale>([ requested, 'ru', 'en' ]));
  // i18next's reloadResources Promise resolves even on backend failure; the callback carries the actual error.
  const results = await Promise.all(locales.map((locale) => new Promise<boolean>((resolve) => {
    void instance.reloadResources([ locale ], [ NAMESPACE ], (error?: unknown) => resolve(!error));
  })));
  const error = !results[0];
  const locale = locales.find((candidate) => instance.hasResourceBundle(candidate, NAMESPACE));
  if (!locale) throw new Error('No translation dictionary is available');
  return { locale, error };
}
