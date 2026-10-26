// Modified by Quat Capital, 2026-10-26: T18 reviewed literal localization. GPL-3.0.
import { Box } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { InterchainTransfer } from '@blockscout/interchain-indexer-types';

import DataListDisplay from 'ui/shared/DataListDisplay';

import TokenTransfersCrossChainListItem from '../transfers/TokenTransfersCrossChainListItem';
import TokenTransfersCrossChainTable from '../transfers/TokenTransfersCrossChainTable';
import { getItemKey } from '../transfers/utils';

interface Props {
  data: Array<InterchainTransfer> | undefined;
  isLoading?: boolean;
  isError: boolean;
}

const TxCrossChainTransfers = ({ data, isLoading, isError }: Props) => {
  const { t: tQuat } = useTranslation();

  const content = data ? (
    <>
      <Box hideFrom="lg">
        { data.map((item, index) => (
          <TokenTransfersCrossChainListItem
            key={ getItemKey(item, isLoading ? index : undefined) }
            data={ item }
            isLoading={ isLoading }
            py={ 4 }
            textStyle="sm"
            rowGap="14px"
            _first={{
              borderTopWidth: '0',
              paddingTop: '0',
            }}
          />
        )) }
      </Box>
      <Box hideBelow="lg">
        <TokenTransfersCrossChainTable data={ data } isLoading={ isLoading }/>
      </Box>
    </>
  ) : null;

  return (
    <DataListDisplay
      isError={ isError }
      itemsNum={ data?.length }
      emptyText={ tQuat('transactions.no_cross_chain_transfers') }
      emptyStateProps={{
        term: 'token transfer',
      }}
    >
      { content }
    </DataListDisplay>
  );
};

export default React.memo(TxCrossChainTransfers);
