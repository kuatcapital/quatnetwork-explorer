// Modified by Quat Capital, 2026-10-25: display confirmation duration in the active locale. GPL-3.0.
import type { TFunction } from 'i18next';

import type { Locale } from 'configs/app/i18n';
import { formatNumber } from 'lib/format/localeNumbers';

export function getLocalizedConfirmationDuration(durations: Array<number>, t: TFunction, locale: Locale): string {
  if (!durations.length) return '';
  const [ lower, upper ] = durations.map(time => time / 1000);
  if (!upper) return t('transactions.confirmed_within', { seconds: formatNumber(lower, locale) });
  if (lower === 0) return t('transactions.confirmed_upper', { seconds: formatNumber(upper, locale) });
  return t('transactions.confirmed_range', { lower: formatNumber(lower, locale), upper: formatNumber(upper, locale) });
}
