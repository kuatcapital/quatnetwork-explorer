// Quat Capital, 2026-10-25: runtime locale configuration for the Quat explorer.
import { getEnvValue } from './utils';

export const SUPPORTED_LOCALES = [ 'ru', 'kk', 'en' ] as const;
export type Locale = typeof SUPPORTED_LOCALES[number];
export const I18N_BASE_PATH_PATTERN = /^\/(?!\/)[\w/~.-]*$/;

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && SUPPORTED_LOCALES.some((locale) => locale === value);
}

const configuredDefault = getEnvValue('NEXT_PUBLIC_DEFAULT_LOCALE');
const configuredPath = getEnvValue('NEXT_PUBLIC_I18N_BASE_PATH');

export const i18n = Object.freeze({
  defaultLocale: isLocale(configuredDefault) ? configuredDefault : 'ru',
  // Only same-origin absolute paths are accepted. Translation requests never use an arbitrary URL.
  basePath: configuredPath && I18N_BASE_PATH_PATTERN.test(configuredPath) ?
    configuredPath.replace(/\/$/, '') : '/assets/i18n',
});
