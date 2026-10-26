// Modified by Quat Capital, 2026-10-26: reactive sorting labels; query values remain stable. GPL-3.0.
import type { TFunction } from 'i18next';

import type {
  ValidatorsStabilitySortingValue,
  ValidatorsStabilitySortingField,
} from 'types/api/validators';

import type { SelectOption } from 'toolkit/chakra/select';

export function getStabilitySortOptions(t: TFunction): Array<SelectOption<ValidatorsStabilitySortingValue>> {
  return [
    { label: t('networkTransfers.sort_default'), value: 'default' },
    { label: t('networkTransfers.sort_status_desc'), value: 'state-desc' },
    { label: t('networkTransfers.sort_status_asc'), value: 'state-asc' },
    { label: t('networkTransfers.sort_blocks_desc'), value: 'blocks_validated-desc' },
    { label: t('networkTransfers.sort_blocks_asc'), value: 'blocks_validated-asc' },
  ];
}

export const VALIDATORS_STABILITY_SORT_SEQUENCE: Record<ValidatorsStabilitySortingField, Array<ValidatorsStabilitySortingValue>> = {
  state: [ 'state-desc', 'state-asc', 'default' ],
  blocks_validated: [ 'blocks_validated-desc', 'blocks_validated-asc', 'default' ],
};
