// Modified by Quat Capital, 2026-10-27: runtime multichain localization. GPL-3.0.
import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { useTranslation } from 'react-i18next';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { INTERCHAIN_MESSAGE, INTERCHAIN_STATS_COMMON } from 'stubs/interchainIndexer';
import { generateListStub } from 'stubs/utils';
import { Skeleton } from 'toolkit/chakra/skeleton';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import StickyPaginationWithText from 'ui/shared/StickyPaginationWithText';

import TransactionsCrossChainContent from './TransactionsCrossChainContent';
import TransactionsCrossChainStats from './TransactionsCrossChainStats';

const TransactionsCrossChain = () => {
  const { t: tQuat } = useTranslation();
  const { locale } = useLocale();
  const { data, isPlaceholderData, isError, pagination } = useQueryWithPages({
    resourceName: 'interchainIndexer:messages',
    options: {
      placeholderData: generateListStub<'interchainIndexer:messages'>(INTERCHAIN_MESSAGE, 50, { next_page_params: { page_token: 'token' } }),
    },
  });
  const statsQuery = useApiQuery('interchainIndexer:stats_common', {
    queryOptions: {
      placeholderData: INTERCHAIN_STATS_COMMON,
    },
  });

  const actionBarText = (
    <Skeleton loading={ statsQuery.isPlaceholderData || isPlaceholderData }>
      { tQuat('multiUi.cross_transactions_found', { count: Number(statsQuery.data?.total_messages), value: formatNumber(Number(statsQuery.data?.total_messages), locale) }) }
    </Skeleton>
  );

  const actionBar = <StickyPaginationWithText text={ actionBarText } pagination={ pagination }/>;

  return (
    <>
      <TransactionsCrossChainStats/>
      <TransactionsCrossChainContent
        items={ data?.items }
        isLoading={ isPlaceholderData }
        pagination={ pagination }
        isError={ isError }
        actionBar={ actionBar }
      />
    </>
  );
};

export default React.memo(TransactionsCrossChain);
