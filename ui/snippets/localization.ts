// Modified by Quat Capital, 2026-10-27: runtime shell labels and exact locale formatting. GPL-3.0.
import BigNumber from 'bignumber.js';
import type { TFunction } from 'i18next';

import type { ColorThemeId } from 'types/settings';

import type { Locale } from 'configs/app/i18n';
import { formatBigNumber, getNumberSeparators } from 'lib/format/localeNumbers';

export function localizeThemeLabel(id: ColorThemeId, fallback: string, t: TFunction): string {
  switch (id) {
    case 'light': return t('shellUi.theme_light');
    case 'dim': return t('shellUi.theme_dim');
    case 'midnight': return t('shellUi.theme_midnight');
    case 'dark': return t('shellUi.theme_dark');
    default: return fallback;
  }
}

export function localizeNetworkGroup(group: string, t: TFunction): string {
  switch (group) {
    case 'Mainnets': return t('shellUi.mainnets');
    case 'Testnets': return t('shellUi.testnets');
    case 'Other': return t('shellUi.other_networks');
    default: return group;
  }
}

export function getIndexingBlocksText(ratio: string | undefined, locale: Locale, t: TFunction): string {
  if (ratio === undefined || ratio === '') return t('shellUi.indexing_blocks');
  const value = BigNumber(ratio);
  if (!value.isFinite()) return t('shellUi.indexing_blocks');
  const percent = value.multipliedBy(100).integerValue(BigNumber.ROUND_FLOOR);
  return t('shellUi.indexing_blocks_progress', { value: formatBigNumber(percent, locale) });
}

export function formatHeaderPrice(value: string, locale: Locale): string {
  const amount = BigNumber(value).decimalPlaces(6);
  const places = Math.max(2, amount.decimalPlaces() ?? 0);
  const separators = getNumberSeparators(locale);
  return amount.toFormat(places, { groupSize: 3, groupSeparator: separators.group, decimalSeparator: separators.decimal });
}

export function formatHeaderPercentage(value: BigNumber.Value, locale: Locale): string {
  const separators = getNumberSeparators(locale);
  return BigNumber(value).toFormat(2, { groupSize: 3, groupSeparator: separators.group, decimalSeparator: separators.decimal });
}
