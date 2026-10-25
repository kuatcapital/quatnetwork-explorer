// Modified by Quat Capital, 2026-10-25: render-local translated sort labels. GPL-3.0.
import type { UseQueryResult } from '@tanstack/react-query';
import type { TFunction } from 'i18next';
import React from 'react';

import type { TransactionsSortingValue, TxsResponse } from 'types/api/transaction';

import type { ResourceError } from 'lib/api/resources';
import * as cookies from 'lib/cookies';
import type { SelectOption } from 'toolkit/chakra/select';

import sortTxs from './sortTxs';

export const SORT_OPTIONS: Array<SelectOption<TransactionsSortingValue>> = [
  { label: 'Default', value: 'default' },
  { label: 'Value ascending', value: 'value-asc' },
  { label: 'Value descending', value: 'value-desc' },
  { label: 'Fee ascending', value: 'fee-asc' },
  { label: 'Fee descending', value: 'fee-desc' },
  { label: 'Block number ascending', value: 'block_number-asc' },
];

const SORT_LABEL_KEYS: Record<TransactionsSortingValue, string> = {
  'default': 'transactions.sort_default',
  'value-asc': 'transactions.sort_value_asc',
  'value-desc': 'transactions.sort_value_desc',
  'fee-asc': 'transactions.sort_fee_asc',
  'fee-desc': 'transactions.sort_fee_desc',
  'block_number-asc': 'transactions.sort_block_asc',
  'block_number-desc': 'transactions.sort_block_desc',
};

export function getSortOptions(t: TFunction): Array<SelectOption<TransactionsSortingValue>> {
  return SORT_OPTIONS.map(option => ({ ...option, label: t(SORT_LABEL_KEYS[option.value]) }));
}

type SortingValue = TransactionsSortingValue;

type HookResult = UseQueryResult<TxsResponse, ResourceError<unknown>> & {
  sorting: SortingValue;
  setSortByValue: (value: SortingValue) => void;
};

export default function useTxsSort(
  queryResult: UseQueryResult<TxsResponse, ResourceError<unknown>>,
): HookResult {

  const [ sorting, setSorting ] = React.useState<SortingValue>((cookies.get(cookies.NAMES.TXS_SORT) as SortingValue | undefined) ?? 'default');

  const setSortByValue = React.useCallback((value: SortingValue) => {
    setSorting((prevVal: SortingValue) => {
      let newVal: SortingValue = 'default';
      if (value !== prevVal) {
        newVal = value as SortingValue;
      }
      cookies.set(cookies.NAMES.TXS_SORT, newVal ? newVal : '');
      return newVal;
    });
  }, []);

  return React.useMemo(() => {
    if (queryResult.isError || queryResult.isPending) {
      return { ...queryResult, setSortByValue, sorting };
    }

    return {
      ...queryResult,
      data: { ...queryResult.data, items: queryResult.data.items.slice().sort(sortTxs(sorting)) },
      setSortByValue,
      sorting,
    };
  }, [ queryResult, setSortByValue, sorting ]);

}
