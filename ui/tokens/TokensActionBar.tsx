// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import { createListCollection, HStack } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { TokensSortingValue } from 'types/api/tokens';
import type { PaginationParams } from 'ui/shared/pagination/types';

import { FilterInput } from 'toolkit/components/filters/FilterInput';
import ActionBar from 'ui/shared/ActionBar';
import Pagination from 'ui/shared/pagination/Pagination';
import Sort from 'ui/shared/sort/Sort';
import { getLocalizedSortOptions } from 'ui/tokens/utils';

interface Props {
  pagination: PaginationParams;
  searchTerm: string | undefined;
  onSearchChange: (value: string) => void;
  sort: TokensSortingValue;
  onSortChange: (value: TokensSortingValue) => void;
  filter: React.ReactNode;
  inTabsSlot?: boolean;
}

const TokensActionBar = ({
  sort,
  onSortChange,
  searchTerm,
  onSearchChange,
  pagination,
  filter,
  inTabsSlot,
}: Props) => {
  const { t: tQuat } = useTranslation();
  const sortCollection = React.useMemo(() => createListCollection({ items: getLocalizedSortOptions(tQuat) }), [ tQuat ]);

  const handleSortChange = React.useCallback(({ value }: { value: Array<string> }) => {
    onSortChange(value[0] as TokensSortingValue);
  }, [ onSortChange ]);

  const searchInput = (
    <FilterInput
      w={{ base: '100%', lg: '360px' }}
      size="sm"
      onChange={ onSearchChange }
      placeholder={ tQuat('tokenUi.search_placeholder') }
      initialValue={ searchTerm }
    />
  );

  return (
    <>
      <HStack gap={ 3 } mb={ 6 } display={{ base: 'flex', lg: 'none' }}>
        { filter }
        <Sort
          name="tokens_sorting"
          value={ [ sort ] }
          collection={ sortCollection }
          onValueChange={ handleSortChange }
        />
        { searchInput }
      </HStack>
      <ActionBar
        mt={ inTabsSlot ? 0 : -6 }
        py={{ lg: inTabsSlot ? 0 : undefined }}
        justifyContent={ inTabsSlot ? 'space-between' : undefined }
        display={{ base: pagination.isVisible ? 'flex' : 'none', lg: 'flex' }}
      >
        <HStack gap={ 3 } display={{ base: 'none', lg: 'flex' }}>
          { filter }
          { searchInput }
        </HStack>
        <Pagination { ...pagination } ml={ inTabsSlot ? 8 : 'auto' }/>
      </ActionBar>
    </>
  );
};

export default React.memo(TokensActionBar);
