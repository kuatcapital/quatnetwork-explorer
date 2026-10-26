// Modified by Quat Capital, 2026-10-26: localize validators, epochs and transfers. GPL-3.0.
import { Box } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import useApiQuery from 'lib/api/useApiQuery';
import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { layerLabels } from 'lib/rollups/utils';
import { generateListStub } from 'stubs/utils';
import { ZKEVM_DEPOSITS_ITEM } from 'stubs/zkEvmL2';
import { Skeleton } from 'toolkit/chakra/skeleton';
import ZkEvmL2DepositsListItem from 'ui/deposits/zkEvmL2/ZkEvmL2DepositsListItem';
import ZkEvmL2DepositsTable from 'ui/deposits/zkEvmL2/ZkEvmL2DepositsTable';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import StickyPaginationWithText from 'ui/shared/StickyPaginationWithText';

const ZkEvmL2Deposits = () => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const { data, isError, isPlaceholderData, pagination } = useQueryWithPages({
    resourceName: 'general:zkevm_l2_deposits',
    options: {
      placeholderData: generateListStub<'general:zkevm_l2_deposits'>(
        ZKEVM_DEPOSITS_ITEM,
        50,
        { next_page_params: { items_count: 50, index: 1 } },
      ),
    },
  });

  const countersQuery = useApiQuery('general:zkevm_l2_deposits_count', {
    queryOptions: {
      placeholderData: 1927029,
    },
  });

  const content = data?.items ? (
    <>
      <Box hideFrom="lg">
        { data.items.map(((item, index) => (
          <ZkEvmL2DepositsListItem
            key={ String(item.index) + (isPlaceholderData ? index : '') }
            isLoading={ isPlaceholderData }
            item={ item }
          />
        ))) }
      </Box>
      <Box hideBelow="lg">
        <ZkEvmL2DepositsTable items={ data.items } top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 } isLoading={ isPlaceholderData }/>
      </Box>
    </>
  ) : null;

  const text = (() => {
    if (countersQuery.isError) {
      return null;
    }

    return (
      <Skeleton
        loading={ countersQuery.isPlaceholderData }
        display="inline-block"
      >
        { t('networkTransfers.deposits_found', { value: countersQuery.data === undefined ? '' : formatNumber(countersQuery.data, locale) }) }
      </Skeleton>
    );
  })();

  const actionBar = <StickyPaginationWithText text={ text } pagination={ pagination }/>;

  return (
    <>
      <PageTitle title={ t('networkTransfers.deposits_route', { from: layerLabels.parent, to: layerLabels.current }) } withTextAd/>
      <DataListDisplay
        isError={ isError }
        itemsNum={ data?.items.length }
        emptyText={ t('networkTransfers.no_deposits') }
        actionBar={ actionBar }
      >
        { content }
      </DataListDisplay>
    </>
  );
};

export default ZkEvmL2Deposits;
