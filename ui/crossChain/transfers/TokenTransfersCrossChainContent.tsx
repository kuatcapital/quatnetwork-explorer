// Modified by Quat Capital, 2026-10-26: T18 reviewed literal localization. GPL-3.0.
import { Box } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { InterchainTransfer } from '@blockscout/interchain-indexer-types';
import type { PaginationParams } from 'ui/shared/pagination/types';

import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay, { type Props as DataListDisplayProps } from 'ui/shared/DataListDisplay';

import TokenTransfersCrossChainListItem from './TokenTransfersCrossChainListItem';
import TokenTransfersCrossChainTable from './TokenTransfersCrossChainTable';
import { getItemKey } from './utils';

interface Props extends Omit<DataListDisplayProps, 'children'> {
  items?: Array<InterchainTransfer>;
  isLoading?: boolean;
  pagination?: PaginationParams;
  currentAddress?: string;
  tableTop?: number;
}

const TokenTransfersCrossChainContent = ({ items, isLoading, pagination, currentAddress, tableTop, ...rest }: Props) => {
  const { t: tQuat } = useTranslation();

  const content = items ? (
    <>
      <Box hideFrom="lg">
        { items.map((item, index) => (
          <TokenTransfersCrossChainListItem
            key={ getItemKey(item, isLoading ? index : undefined) }
            data={ item }
            isLoading={ isLoading }
            currentAddress={ currentAddress }
            py={ 4 }
            textStyle="sm"
            rowGap="14px"
          />
        )) }
      </Box>
      <Box hideBelow="lg">
        <TokenTransfersCrossChainTable
          data={ items }
          isLoading={ isLoading }
          top={ tableTop ?? (pagination?.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0) }
          currentAddress={ currentAddress }
        />
      </Box>
    </>
  ) : null;

  return (
    <DataListDisplay
      itemsNum={ items?.length }
      emptyText={ tQuat('transactions.no_cross_chain_transfers') }
      emptyStateProps={{
        term: 'token transfer',
      }}
      { ...rest }
    >
      { content }
    </DataListDisplay>
  );
};

export default React.memo(TokenTransfersCrossChainContent);
