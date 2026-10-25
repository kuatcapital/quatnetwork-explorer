// Modified by Quat Capital, 2026-10-25: separate CSS percentages from localized display values. GPL-3.0.
import { clamp } from 'es-toolkit';

import type { Locale } from 'configs/app/i18n';
import { formatNumber } from 'lib/format/localeNumbers';

export function formatUtilization(value: number, locale: Locale): { width: string; label: string } {
  const percentage = clamp(value * 100 || 0, 0, 100);
  return {
    // CSS always requires an ASCII decimal point, even when the displayed label uses a comma.
    width: `${ percentage }%`,
    label: `${ formatNumber(percentage, locale, { maximumFractionDigits: 2 }) }%`,
  };
}
