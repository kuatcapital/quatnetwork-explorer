// Modified by Quat Capital, 2026-10-27: exact locale-aware address counts and plural selection. GPL-3.0.
import BigNumber from 'bignumber.js';

import type { Locale } from 'configs/app/i18n';
import { formatBigNumber, getNumberSeparators } from 'lib/format/localeNumbers';

export function getAddressCountOptions(value: string | number, locale: Locale) {
  const number = BigNumber(value);
  // RU uses the final two digits; EN/KK distinguish exactly one from larger counts.
  // A bounded representative preserves these rules without rounding large API integers.
  const pluralCount = number.gt(100) ? number.modulo(100).plus(100).toNumber() : number.toNumber();

  return { count: pluralCount, value: formatBigNumber(number, locale) };
}

export function formatAddressUsd(value: BigNumber, locale: Locale) {
  const { group, decimal } = getNumberSeparators(locale);
  return value.toFormat(2, { groupSize: 3, groupSeparator: group, decimalSeparator: decimal });
}

export function formatAddressWidgetValue(value: unknown, locale: Locale): string | undefined {
  if (typeof value !== 'number' && typeof value !== 'string') {
    return undefined;
  }

  const number = BigNumber(value);
  if (number.isNaN()) {
    return String(value);
  }

  return number.eq(-1) ? '0' : formatBigNumber(number, locale);
}
