// Modified by Quat Capital, 2026-10-29: runtime accessibility defaults for installed Ark/Zag components. GPL-3.0.
import type { TFunction } from 'i18next';

import type { Locale } from 'configs/app/i18n';
import { formatNumber } from 'lib/format/localeNumbers';

interface ProgressValueDetails {
  value: number | null;
  percent: number;
  formatter?: Intl.NumberFormat;
}

export function getPinInputTranslations(t: TFunction, locale: Locale, count: number) {
  return {
    inputLabel: (index: number, length: number) => t('arkUi.input_label', {
      position: formatNumber(index + 1, locale), total: formatNumber(length || count, locale),
    }),
  };
}

export function getRatingTranslations(t: TFunction, locale: Locale) {
  return {
    ratingValueText: (index: number) => t('arkUi.rating_stars', { count: index, value: formatNumber(index, locale) }),
  };
}

export function getProgressTranslations(t: TFunction) {
  return {
    value: ({ value, percent, formatter }: ProgressValueDetails) => {
      if (value === null) return t('developerUi.loading');
      if (!formatter) return value.toString();
      const numericValue = formatter.resolvedOptions().style === 'percent' ? percent / 100 : value;
      return formatter.format(numericValue);
    },
  };
}

type ToastPlacement = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end';
const PLACEMENT_KEYS = {
  top: 'arkUi.placement_top', 'top-start': 'arkUi.placement_top_start', 'top-end': 'arkUi.placement_top_end',
  bottom: 'arkUi.placement_bottom', 'bottom-start': 'arkUi.placement_bottom_start', 'bottom-end': 'arkUi.placement_bottom_end',
} as const;

export function getToastRegionLabel(t: TFunction, placement: ToastPlacement, hotkey: Array<string>): string {
  // Preserve the configured shortcut and placement; only their accessible display text changes.
  const hotkeyLabel = hotkey.join('+').replace(/Key/g, '').replace(/Digit/g, '');
  return t('arkUi.notifications_region', { replace: { placement: t(PLACEMENT_KEYS[placement]), hotkey: hotkeyLabel } });
}
