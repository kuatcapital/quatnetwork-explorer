// Modified by Quat Capital, 2026-10-27: localized L2 and interop interface. GPL-3.0.
import { Box } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import useApiQuery from 'lib/api/useApiQuery';
import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { layerLabels } from 'lib/rollups/utils';
import { ARBITRUM_MESSAGES_ITEM } from 'stubs/arbitrumL2';
import { generateListStub } from 'stubs/utils';
import { Skeleton } from 'toolkit/chakra/skeleton';
import ArbitrumL2MessagesListItem from 'ui/messages/ArbitrumL2MessagesListItem';
import ArbitrumL2MessagesTable from 'ui/messages/ArbitrumL2MessagesTable';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import StickyPaginationWithText from 'ui/shared/StickyPaginationWithText';

export type MessagesDirection = 'from-rollup' | 'to-rollup';

type Props = {
  direction: MessagesDirection;
};

const ArbitrumL2Messages = ({ direction }: Props) => {
  const { locale } = useLocale();
  const { t: tQuat } = useTranslation();
  const type = direction === 'from-rollup' ? 'withdrawals' : 'deposits';
  const { data, isError, isPlaceholderData, pagination } = useQueryWithPages({
    resourceName: 'general:arbitrum_l2_messages',
    pathParams: { direction },
    options: {
      placeholderData: generateListStub<'general:arbitrum_l2_messages'>(
        ARBITRUM_MESSAGES_ITEM,
        50,
        { next_page_params: { items_count: 50, direction: 'to-rollup', id: 123456 } },
      ),
    },
  });

  const countersQuery = useApiQuery('general:arbitrum_l2_messages_count', {
    pathParams: { direction },
    queryOptions: {
      placeholderData: 1927029,
    },
  });

  const content = data?.items ? (
    <>
      <Box hideFrom="lg">
        { data.items.map(((item, index) => (
          <ArbitrumL2MessagesListItem
            key={ String(item.id) + (isPlaceholderData ? index : '') }
            isLoading={ isPlaceholderData }
            item={ item }
            direction={ direction }
          />
        ))) }
      </Box>
      <Box hideBelow="lg">
        <ArbitrumL2MessagesTable
          items={ data.items }
          direction={ direction }
          top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
          isLoading={ isPlaceholderData }
        />
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
        { type === 'withdrawals' ?
          tQuat('l2Ui.withdrawals_found', { count: countersQuery.data ?? 0, value: formatNumber(countersQuery.data ?? 0, locale) }) :
          tQuat('l2Ui.deposits_found', { count: countersQuery.data ?? 0, value: formatNumber(countersQuery.data ?? 0, locale) }) }
      </Skeleton>
    );
  })();

  const actionBar = <StickyPaginationWithText text={ text } pagination={ pagination }/>;

  return (
    <>
      <PageTitle
        title={ direction === 'from-rollup' ?
          tQuat('l2Ui.withdrawals_route', { from: layerLabels.current, to: layerLabels.parent }) :
          tQuat('l2Ui.deposits_route', { from: layerLabels.parent, to: layerLabels.current }) }
        withTextAd
      />
      <DataListDisplay
        isError={ isError }
        itemsNum={ data?.items.length }
        emptyText={ type === 'withdrawals' ? tQuat('l2Ui.no_withdrawals') : tQuat('l2Ui.no_deposits') }
        actionBar={ actionBar }
      >
        { content }
      </DataListDisplay>
    </>
  );
};

export default ArbitrumL2Messages;
