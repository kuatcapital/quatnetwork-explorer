// Modified by Quat Capital, 2026-10-27: complete runtime multichain localization. GPL-3.0.
import { BigNumber } from 'bignumber.js';
import React from 'react';
import { useTranslation } from 'react-i18next';

import useApiQuery from 'lib/api/useApiQuery';
import { formatBigNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { INTERCHAIN_STATS_COMMON, INTERCHAIN_TRANSFER } from 'stubs/interchainIndexer';
import { generateListStub } from 'stubs/utils';
import { Skeleton } from 'toolkit/chakra/skeleton';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import StickyPaginationWithText from 'ui/shared/StickyPaginationWithText';

import TokenTransfersCrossChainContent from './TokenTransfersCrossChainContent';

const TokenTransfersCrossChain = () => {
  const { t: tQuat } = useTranslation();
  const { locale } = useLocale();
  const { data, isPlaceholderData, isError, pagination } = useQueryWithPages({
    resourceName: 'interchainIndexer:transfers',
    options: {
      placeholderData: generateListStub<'interchainIndexer:transfers'>(INTERCHAIN_TRANSFER, 50, { next_page_params: { page_token: 'token' } }),
    },
  });
  const statsQuery = useApiQuery('interchainIndexer:stats_common', {
    queryOptions: {
      placeholderData: INTERCHAIN_STATS_COMMON,
    },
  });

  const totalTransfers = statsQuery.data?.total_transfers;
  const actionBarText = (
    <Skeleton loading={ statsQuery.isPlaceholderData || isPlaceholderData }>
      { totalTransfers !== undefined && tQuat(
        'multiUi.cross_transfers_found',
        { count: totalTransfers, value: formatBigNumber(BigNumber(totalTransfers), locale) },
      ) }
    </Skeleton>
  );

  const actionBar = <StickyPaginationWithText text={ actionBarText } pagination={ pagination }/>;

  return (
    <TokenTransfersCrossChainContent
      items={ data?.items }
      isLoading={ isPlaceholderData }
      pagination={ pagination }
      isError={ isError }
      itemsNum={ data?.items.length }
      actionBar={ actionBar }
    />
  );
};

export default React.memo(TokenTransfersCrossChain);
