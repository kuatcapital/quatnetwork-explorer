// Modified by Quat Capital, 2026-10-25: localize address UI. GPL-3.0.
import { createListCollection } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { AddressFromToFilter } from 'types/api/address';

import useIsInitialLoading from 'lib/hooks/useIsInitialLoading';
import PopoverFilterRadio from 'ui/shared/filters/PopoverFilterRadio';

interface Props {
  hasActiveFilter: boolean;
  initialValue: AddressFromToFilter;
  onFilterChange: (nextValue: string | Array<string>) => void;
  isLoading?: boolean;
}

const AddressTxsFilter = ({ onFilterChange, initialValue, hasActiveFilter, isLoading }: Props) => {
  const { t: tQuat } = useTranslation();

  const isInitialLoading = useIsInitialLoading(isLoading);
  const collection = React.useMemo(() => createListCollection({ items: [
    { value: 'all', label: tQuat('common.all') },
    { value: 'from', label: tQuat('addresses.outgoing_transactions') },
    { value: 'to', label: tQuat('addresses.incoming_transactions') },
  ] }), [ tQuat ]);

  return (
    <PopoverFilterRadio
      name="txs_filter"
      collection={ collection }
      onChange={ onFilterChange }
      hasActiveFilter={ hasActiveFilter }
      isLoading={ isInitialLoading }
      initialValue={ initialValue }
    />
  );
};

export default React.memo(AddressTxsFilter);
