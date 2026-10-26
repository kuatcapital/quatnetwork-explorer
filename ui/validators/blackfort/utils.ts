// Modified by Quat Capital, 2026-10-26: reactive sorting labels; query values remain stable. GPL-3.0.
import type { TFunction } from 'i18next';

import type {
  ValidatorsBlackfortSortingValue,
  ValidatorsBlackfortSortingField,
} from 'types/api/validators';

import type { SelectOption } from 'toolkit/chakra/select';

export function getBlackfortSortOptions(t: TFunction): Array<SelectOption<ValidatorsBlackfortSortingValue>> {
  return [
    { label: t('networkTransfers.sort_default'), value: 'default' },
    { label: t('networkTransfers.sort_address_desc'), value: 'address_hash-desc' },
    { label: t('networkTransfers.sort_address_asc'), value: 'address_hash-asc' },
  ];
}

export const VALIDATORS_BLACKFORT_SORT_SEQUENCE: Record<ValidatorsBlackfortSortingField, Array<ValidatorsBlackfortSortingValue>> = {
  address_hash: [ 'address_hash-desc', 'address_hash-asc', 'default' ],
};
