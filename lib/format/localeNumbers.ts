// Modified by Quat Capital, 2026-10-25: explicit locale formatting without global mutations. GPL-3.0.
import type BigNumber from 'bignumber.js';

import type { Locale } from 'configs/app/i18n';

export const NUMBER_LOCALES: Record<Locale, string> = {
  ru: 'ru-RU',
  kk: 'kk-KZ',
  en: 'en-US',
};

export function getNumberSeparators(locale: Locale): { group: string; decimal: string } {
  const parts = new Intl.NumberFormat(NUMBER_LOCALES[locale]).formatToParts(12345.6);
  return {
    group: parts.find(part => part.type === 'group')?.value ?? ',',
    decimal: parts.find(part => part.type === 'decimal')?.value ?? '.',
  };
}

export function formatNumber(value: number | bigint, locale: Locale, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(NUMBER_LOCALES[locale], options).format(value);
}

export function formatBigNumber(value: BigNumber, locale: Locale, decimalPlaces?: number): string {
  const separators = getNumberSeparators(locale);
  const rounded = decimalPlaces === undefined ? value : value.decimalPlaces(decimalPlaces);
  return rounded.toFormat({
    groupSize: 3,
    groupSeparator: separators.group,
    decimalSeparator: separators.decimal,
  });
}
