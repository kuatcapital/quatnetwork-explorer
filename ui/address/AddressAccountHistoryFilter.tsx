// Modified by Quat Capital, 2026-10-25: localize address UI. GPL-3.0.
import { createListCollection } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { NovesHistoryFilterValue } from 'types/api/noves';

import useIsInitialLoading from 'lib/hooks/useIsInitialLoading';
import PopoverFilterRadio from 'ui/shared/filters/PopoverFilterRadio';

interface Props {
  hasActiveFilter: boolean;
  defaultFilter: NovesHistoryFilterValue;
  onFilterChange: (nextValue: string | Array<string>) => void;
  isLoading?: boolean;
}

const AccountHistoryFilter = ({ onFilterChange, defaultFilter, hasActiveFilter, isLoading }: Props) => {
  const { t: tQuat } = useTranslation();

  const isInitialLoading = useIsInitialLoading(isLoading);
  const collection = React.useMemo(() => createListCollection({ items: [
    { value: 'all', label: tQuat('common.all') },
    { value: 'received', label: tQuat('addresses.received_from') },
    { value: 'sent', label: tQuat('addresses.sent_to') },
  ] }), [ tQuat ]);

  return (
    <PopoverFilterRadio
      name="account_history_filter"
      collection={ collection }
      onChange={ onFilterChange }
      hasActiveFilter={ hasActiveFilter }
      isLoading={ isInitialLoading }
      initialValue={ defaultFilter || 'all' }
    />
  );
};

export default React.memo(AccountHistoryFilter);
