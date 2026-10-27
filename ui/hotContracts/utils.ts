// Modified by Quat Capital, 2026-10-27: reactive labels preserve sorting and interval API values. GPL-3.0.
import type { TFunction } from 'i18next';

import type { HotContractsSortingValue, HotContractsSortingField, HotContractsInterval } from 'types/api/contracts';

import getQueryParamString from 'lib/router/getQueryParamString';
import type { SelectOption } from 'toolkit/chakra/select';

export const SORT_OPTIONS: Array<SelectOption<HotContractsSortingValue>> = [
  { label: 'Default', value: 'default' },
  { label: 'Txs count descending', value: 'transactions_count-desc' },
  { label: 'Txs count ascending', value: 'transactions_count-asc' },
  { label: 'Gas used descending', value: 'total_gas_used-desc' },
  { label: 'Gas used ascending', value: 'total_gas_used-asc' },
];

export const SORT_SEQUENCE: Record<HotContractsSortingField, Array<HotContractsSortingValue>> = {
  transactions_count: [ 'transactions_count-desc', 'transactions_count-asc', 'default' ],
  total_gas_used: [ 'total_gas_used-desc', 'total_gas_used-asc', 'default' ],
};

export const INTERVAL_ITEMS: Array<{ id: HotContractsInterval; labelShort: string; labelFull: string }> = [
  { id: '5m', labelShort: '5m', labelFull: '5 minutes' },
  { id: '1h', labelShort: '1h', labelFull: '1 hour' },
  { id: '3h', labelShort: '3h', labelFull: '3 hours' },
  { id: '1d', labelShort: '1D', labelFull: '1 day' },
  { id: '7d', labelShort: '1W', labelFull: '1 week' },
  { id: '30d', labelShort: '1M', labelFull: '1 month' },
];

export function getSortOptions(t: TFunction): Array<SelectOption<HotContractsSortingValue>> {
  const labels: Record<HotContractsSortingValue, string> = {
    'default': t('suppUi.default_sort'),
    'transactions_count-desc': t('suppUi.txs_desc'),
    'transactions_count-asc': t('suppUi.txs_asc'),
    'total_gas_used-desc': t('suppUi.gas_desc'),
    'total_gas_used-asc': t('suppUi.gas_asc'),
  };
  return SORT_OPTIONS.map((option) => ({ ...option, label: labels[option.value] }));
}

export function getIntervalItems(t: TFunction): typeof INTERVAL_ITEMS {
  const keys: Record<HotContractsInterval, [string, string]> = {
    '5m': [ 'suppUi.interval_5m_short', 'suppUi.interval_5m' ],
    '1h': [ 'suppUi.interval_1h_short', 'suppUi.interval_1h' ],
    '3h': [ 'suppUi.interval_3h_short', 'suppUi.interval_3h' ],
    '1d': [ 'suppUi.interval_1d_short', 'suppUi.interval_1d' ],
    '7d': [ 'suppUi.interval_7d_short', 'suppUi.interval_7d' ],
    '30d': [ 'suppUi.interval_30d_short', 'suppUi.interval_30d' ],
  };
  return INTERVAL_ITEMS.map((item) => ({ ...item, labelShort: t(keys[item.id][0]), labelFull: t(keys[item.id][1]) }));
}

export const getIntervalValueFromQuery = (query: string | Array<string> | undefined): HotContractsInterval => {
  const queryString = getQueryParamString(query);
  if (queryString) {
    const interval = INTERVAL_ITEMS.find(item => item.id === queryString);
    if (interval) {
      return interval.id;
    }
  }

  return '1d';
};
