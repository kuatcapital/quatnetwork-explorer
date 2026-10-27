// Modified by Quat Capital, 2026-10-27: runtime multichain localization. GPL-3.0.
import type { TFunction } from 'i18next';
import type { EnsLookupSorting } from 'types/api/ens';

import type { SelectOption } from 'toolkit/chakra/select';
import getNextSortValueShared from 'ui/shared/sort/getNextSortValue';

export type SortField = EnsLookupSorting['sort'];
export type Sort = `${ EnsLookupSorting['sort'] }-${ EnsLookupSorting['order'] }` | 'default';

export const SORT_OPTIONS: Array<SelectOption<Sort>> = [
  { label: 'Default', value: 'default' },
  { label: 'Registered on descending', value: 'registration_date-DESC' },
  { label: 'Registered on ascending', value: 'registration_date-ASC' },
];

const SORT_SEQUENCE: Record<SortField, Array<Sort>> = {
  registration_date: [ 'registration_date-DESC', 'registration_date-ASC', 'default' ],
};

export const getNextSortValue = (getNextSortValueShared<SortField, Sort>).bind(undefined, SORT_SEQUENCE);

export function getNameDomainsSortOptions(t: TFunction): Array<SelectOption<Sort>> {
  const labels: Record<Sort, string> = {
    'default': t('multiUi.default_sort'),
    'registration_date-DESC': t('multiUi.registered_desc'),
    'registration_date-ASC': t('multiUi.registered_asc'),
  };
  return SORT_OPTIONS.map(option => ({ ...option, label: labels[option.value] }));
}
