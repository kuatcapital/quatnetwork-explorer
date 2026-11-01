// Modified by Quat Capital, 2026-11-01: bridge validated runtime dictionaries into Dynamic's public i18next instance. GPL-3.0.
import { Locale as DynamicLocale, translation as dynamicDefaults } from '@dynamic-labs/locale';
import type { i18n as I18nInstance } from 'i18next';

import { isLocale } from 'configs/app/i18n';

import { assertCompatibleDictionary, NAMESPACE, validateDictionary } from './config';

const expectedDictionary = validateDictionary(dynamicDefaults);

export function synchronizeDynamicLocale(source: I18nInstance): boolean {
  const locale = source.resolvedLanguage || source.language;
  if (!isLocale(locale)) return false;
  try {
    const candidate: unknown = source.getResource(locale, NAMESPACE, 'dynamicUi');
    const dictionary = validateDictionary(candidate);
    // Reject incomplete or incompatible external JSON before touching the working SDK resources.
    assertCompatibleDictionary(dictionary, expectedDictionary);
    const sdk = DynamicLocale.getInstance();
    sdk.addResourceBundle(locale, NAMESPACE, dictionary, true, true);
    // The bundle is already present: no network requests or wallet reinitialization.
    void sdk.changeLanguage(locale);
    return true;
  } catch (error) {
    return false;
  }
}

export function connectDynamicLocale(source: I18nInstance): () => void {
  const sync = () => {
    synchronizeDynamicLocale(source);
  };
  source.on('languageChanged', sync);
  sync();
  return () => {
    source.off('languageChanged', sync);
  };
}
