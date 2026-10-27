// Modified by Quat Capital, 2026-10-27: complete runtime multichain localization. GPL-3.0.
import type { Locale } from 'configs/app/i18n';
import { formatNumber } from 'lib/format/localeNumbers';
import { hairsp } from 'toolkit/utils/htmlEntities';

export function formatPercentage(percentage: number, locale: Locale = 'en') {
  const value = Math.round(percentage * 100);
  if (value === 0 && percentage > 0) {
    return `<${ hairsp }1%`;
  }
  if (value === 100 && percentage < 1) {
    return `>${ hairsp }99%`;
  }
  return `${ formatNumber(value, locale) }%`;
}
