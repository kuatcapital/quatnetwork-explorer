// Modified by Quat Capital, 2026-10-27: T18 supplemental interface localization. GPL-3.0.
import { Box } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { TokenType } from 'types/api/token';

import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PopoverFilter from 'ui/shared/filters/PopoverFilter';
import TokenTypeFilter from 'ui/shared/filters/TokenTypeFilter';
import Pagination from 'ui/shared/pagination/Pagination';

import TokenTransfersListItem from './TokenTransfersListItem';
import TokenTransfersTable from './TokenTransfersTable';
import useTokenTransfersQuery from './useTokenTransfersQuery';

const TokenTransfersLocal = () => {
  const { t: tQuat } = useTranslation();

  const { query, typeFilter, onTokenTypesChange } = useTokenTransfersQuery({ enabled: true });

  const content = (
    <>
      <Box hideFrom="lg">
        { query.data?.items.map((item, index) => (
          <TokenTransfersListItem
            key={ item.transaction_hash + item.log_index + (query.isPlaceholderData ? index : '') }
            isLoading={ query.isPlaceholderData }
            item={ item }
          />
        )) }
      </Box>
      <Box hideBelow="lg">
        <TokenTransfersTable
          items={ query.data?.items }
          top={ query.pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
          isLoading={ query.isPlaceholderData }
        />
      </Box>
    </>
  );

  const filter = (
    <PopoverFilter contentProps={{ w: '200px' }} appliedFiltersNum={ typeFilter.length }>
      <TokenTypeFilter<TokenType> onChange={ onTokenTypesChange } defaultValue={ typeFilter } nftOnly={ false }/>
    </PopoverFilter>
  );

  const actionBar = (
    <ActionBar mt={ -6 }>
      { filter }
      <Pagination { ...query.pagination }/>
    </ActionBar>
  );

  return (
    <DataListDisplay
      isError={ query.isError }
      itemsNum={ query.data?.items.length }
      emptyText={ tQuat('suppUi.no_token_transfers') }
      actionBar={ actionBar }
      hasActiveFilters={ Boolean(typeFilter.length) }
      emptyStateProps={{
        term: tQuat('suppUi.token_transfer_term'),
      }}
    >
      { content }
    </DataListDisplay>
  );
};

export default TokenTransfersLocal;
