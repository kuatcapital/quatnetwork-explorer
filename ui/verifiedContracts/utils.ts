// Modified by Quat Capital, 2026-10-25: resolve sorting labels for the active locale. GPL-3.0.
import type { TFunction } from 'i18next';

import type { VerifiedContractsSortingValue, VerifiedContractsSortingField } from 'types/api/verifiedContracts';

import type { SelectOption } from 'toolkit/chakra/select';

export const SORT_OPTIONS: Array<SelectOption<VerifiedContractsSortingValue>> = [
  { label: 'Default', value: 'default' },
  { label: 'Balance descending', value: 'balance-desc' },
  { label: 'Balance ascending', value: 'balance-asc' },
  { label: 'Txs count descending', value: 'transactions_count-desc' },
  { label: 'Txs count ascending', value: 'transactions_count-asc' },
];

export function getVerifiedContractsSortOptions(t: TFunction): Array<SelectOption<VerifiedContractsSortingValue>> {
  const labels: Record<VerifiedContractsSortingValue, string> = {
    'default': t('verification.sort_default'),
    'balance-desc': t('verification.sort_balance_desc'),
    'balance-asc': t('verification.sort_balance_asc'),
    'transactions_count-desc': t('verification.sort_tx_desc'),
    'transactions_count-asc': t('verification.sort_tx_asc'),
  };
  return SORT_OPTIONS.map(option => ({ ...option, label: labels[option.value] }));
}

export const SORT_SEQUENCE: Record<VerifiedContractsSortingField, Array<VerifiedContractsSortingValue>> = {
  balance: [ 'balance-desc', 'balance-asc', 'default' ],
  transactions_count: [ 'transactions_count-desc', 'transactions_count-asc', 'default' ],
};
