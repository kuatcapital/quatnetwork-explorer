// Modified by Quat Capital, 2026-10-27: localized L2 and interop interface. GPL-3.0.
// Modified by Quat Capital, 2026-10-26: T18 reviewed literal localization. GPL-3.0.
import { Box, Text } from '@chakra-ui/react';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import useApiQuery from 'lib/api/useApiQuery';
import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { generateListStub } from 'stubs/utils';
import { ZKEVM_L2_TXN_BATCHES_ITEM } from 'stubs/zkEvmL2';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import StickyPaginationWithText from 'ui/shared/StickyPaginationWithText';
import ZkEvmTxnBatchesListItem from 'ui/txnBatches/zkEvmL2/ZkEvmTxnBatchesListItem';
import ZkEvmTxnBatchesTable from 'ui/txnBatches/zkEvmL2/ZkEvmTxnBatchesTable';

const ZkEvmL2TxnBatches = () => {
  const { locale } = useLocale();
  const { t: tQuat } = useTranslation();

  const { data, isError, isPlaceholderData, pagination } = useQueryWithPages({
    resourceName: 'general:zkevm_l2_txn_batches',
    options: {
      placeholderData: generateListStub<'general:zkevm_l2_txn_batches'>(
        ZKEVM_L2_TXN_BATCHES_ITEM,
        50,
        {
          next_page_params: {
            items_count: 50,
            number: 9045200,
          },
        },
      ),
    },
  });

  const countersQuery = useApiQuery('general:zkevm_l2_txn_batches_count', {
    queryOptions: {
      placeholderData: 5231746,
    },
  });

  const content = data?.items ? (
    <>
      <Box hideFrom="lg">
        { data.items.map(((item, index) => (
          <ZkEvmTxnBatchesListItem
            key={ item.number + (isPlaceholderData ? String(index) : '') }
            item={ item }
            isLoading={ isPlaceholderData }
          />
        ))) }
      </Box>
      <Box hideBelow="lg">
        <ZkEvmTxnBatchesTable items={ data.items } top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 } isLoading={ isPlaceholderData }/>
      </Box>
    </>
  ) : null;

  const text = (() => {
    if (countersQuery.isError || isError || !data?.items.length) {
      return null;
    }

    return (
      <Skeleton loading={ countersQuery.isPlaceholderData || isPlaceholderData } display="flex" flexWrap="wrap">
        <Trans t={ tQuat } i18nKey="l2Ui.batches_range" count={ countersQuery.data ?? 0 }
          values={{
            from: formatNumber(data.items[0].number, locale),
            to: formatNumber(data.items[data.items.length - 1].number, locale),
            total: formatNumber(countersQuery.data ?? 0, locale),
          }}
          components={{ from: <Text fontWeight={ 600 } whiteSpace="pre"/>, to: <Text fontWeight={ 600 } whiteSpace="pre"/> }}
        />
      </Skeleton>
    );
  })();

  const actionBar = <StickyPaginationWithText text={ text } pagination={ pagination }/>;

  return (
    <>
      <PageTitle title={ tQuat('l2Ui.batches') } withTextAd/>
      <DataListDisplay
        isError={ isError }
        itemsNum={ data?.items.length }
        emptyText={ tQuat('l2Ui.no_batches') }
        actionBar={ actionBar }
      >
        { content }
      </DataListDisplay>
    </>
  );
};

export default ZkEvmL2TxnBatches;
