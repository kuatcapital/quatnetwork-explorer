// Modified by Quat Capital, 2026-10-27: runtime multichain localization. GPL-3.0.
import type { TFunction } from 'i18next';
import type { ChainMetricsSortingField, ChainMetricsSortingValue } from 'types/client/multichainAggregator';

import type { SelectOption } from 'toolkit/chakra/select';

export const SORT_OPTIONS: Array<SelectOption<ChainMetricsSortingValue>> = [
  { label: 'Default', value: 'default' },
  { label: 'Active accounts descending', value: 'active_accounts-desc' },
  { label: 'Active accounts ascending', value: 'active_accounts-asc' },
  { label: 'Daily txs descending', value: 'daily_transactions-desc' },
  { label: 'Daily txs ascending', value: 'daily_transactions-asc' },
  { label: 'New addresses descending', value: 'new_addresses-desc' },
  { label: 'New addresses ascending', value: 'new_addresses-asc' },
  { label: 'TPS descending', value: 'tps-desc' },
  { label: 'TPS ascending', value: 'tps-asc' },
];

export const SORT_SEQUENCE: Record<ChainMetricsSortingField, Array<ChainMetricsSortingValue>> = {
  active_accounts: [ 'active_accounts-desc', 'active_accounts-asc', 'default' ],
  daily_transactions: [ 'daily_transactions-desc', 'daily_transactions-asc', 'default' ],
  new_addresses: [ 'new_addresses-desc', 'new_addresses-asc', 'default' ],
  tps: [ 'tps-desc', 'tps-asc', 'default' ],
};

export function getEcosystemSortOptions(t: TFunction): Array<SelectOption<ChainMetricsSortingValue>> {
  const labels: Record<ChainMetricsSortingValue, string> = {
    'default': t('multiUi.default_sort'),
    'active_accounts-desc': t('multiUi.active_desc'),
    'active_accounts-asc': t('multiUi.active_asc'),
    'daily_transactions-desc': t('multiUi.daily_desc'),
    'daily_transactions-asc': t('multiUi.daily_asc'),
    'new_addresses-desc': t('multiUi.new_desc'),
    'new_addresses-asc': t('multiUi.new_asc'),
    'tps-desc': t('multiUi.tps_desc'),
    'tps-asc': t('multiUi.tps_asc'),
  };
  return SORT_OPTIONS.map(option => ({ ...option, label: labels[option.value] }));
}
