// Modified by Quat Capital, 2026-10-27: complete runtime multichain localization. GPL-3.0.
import { Box } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { TokenType } from 'types/api/token';

import { useMultichainContext } from 'lib/contexts/multichain';
import useIsMobile from 'lib/hooks/useIsMobile';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PopoverFilter from 'ui/shared/filters/PopoverFilter';
import TokenTypeFilter from 'ui/shared/filters/TokenTypeFilter';
import Pagination from 'ui/shared/pagination/Pagination';
import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';
import TokenTransfersListItem from 'ui/tokenTransfers/TokenTransfersListItem';
import TokenTransfersTable from 'ui/tokenTransfers/TokenTransfersTable';

const ACTION_BAR_HEIGHT = 24 * 2 + 40;

interface Props {
  query: QueryWithPagesResult<'general:token_transfers_all'>;
  typeFilter: Array<TokenType>;
  onTokenTypesChange: (value: Array<TokenType>) => void;
}

const MultichainTokenTransfersLocal = ({ query, typeFilter, onTokenTypesChange }: Props) => {
  const { t: tQuat } = useTranslation();

  const isMobile = useIsMobile();
  const multichainContext = useMultichainContext();
  const chainData = multichainContext?.chain;

  const actionBar = isMobile && (
    <ActionBar mt={ -6 }>
      <PopoverFilter contentProps={{ w: '200px' }} appliedFiltersNum={ typeFilter.length }>
        <TokenTypeFilter<TokenType>
          onChange={ onTokenTypesChange }
          defaultValue={ typeFilter }
          nftOnly={ false }
          chainConfig={ chainData?.app_config }
        />
      </PopoverFilter>
      <Pagination { ...query.pagination }/>
    </ActionBar>
  );

  return (
    <DataListDisplay
      isError={ query.isError }
      itemsNum={ query.data?.items.length }
      emptyText={ tQuat('multiUi.no_transfers') }
      actionBar={ actionBar }
    >
      <Box hideFrom="lg">
        { query.data?.items.map((item, index) => (
          <TokenTransfersListItem
            key={ item.transaction_hash + item.log_index + (query.isPlaceholderData ? index : '') + (chainData ? chainData.id : '') }
            isLoading={ query.isPlaceholderData }
            item={ item }
            chainData={ chainData }
          />
        )) }
      </Box>
      <Box hideBelow="lg">
        <TokenTransfersTable
          items={ query.data?.items }
          top={ query.pagination.isVisible ? ACTION_BAR_HEIGHT : 0 }
          isLoading={ query.isPlaceholderData }
          chainData={ chainData }
        />
      </Box>
    </DataListDisplay>
  );
};

export default React.memo(MultichainTokenTransfersLocal);
