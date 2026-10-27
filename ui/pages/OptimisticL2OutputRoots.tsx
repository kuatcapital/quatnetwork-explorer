// Modified by Quat Capital, 2026-10-27: localized L2 and interop interface. GPL-3.0.
// Modified by Quat Capital, 2026-10-26: T18 reviewed literal localization. GPL-3.0.
import { Box, Text } from '@chakra-ui/react';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import useApiQuery from 'lib/api/useApiQuery';
import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { layerLabels } from 'lib/rollups/utils';
import { L2_OUTPUT_ROOTS_ITEM } from 'stubs/L2';
import { generateListStub } from 'stubs/utils';
import { Skeleton } from 'toolkit/chakra/skeleton';
import OptimisticL2OutputRootsListItem from 'ui/outputRoots/optimisticL2/OptimisticL2OutputRootsListItem';
import OptimisticL2OutputRootsTable from 'ui/outputRoots/optimisticL2/OptimisticL2OutputRootsTable';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import StickyPaginationWithText from 'ui/shared/StickyPaginationWithText';

const OptimisticL2OutputRoots = () => {
  const { locale } = useLocale();
  const { t: tQuat } = useTranslation();

  const { data, isError, isPlaceholderData, pagination } = useQueryWithPages({
    resourceName: 'general:optimistic_l2_output_roots',
    options: {
      placeholderData: generateListStub<'general:optimistic_l2_output_roots'>(
        L2_OUTPUT_ROOTS_ITEM,
        50,
        {
          next_page_params: {
            items_count: 50,
            index: 9045200,
          },
        },
      ),
    },
  });

  const countersQuery = useApiQuery('general:optimistic_l2_output_roots_count', {
    queryOptions: {
      placeholderData: 50617,
    },
  });

  const content = data?.items ? (
    <>
      <Box hideFrom="lg">
        { data.items.map(((item, index) => (
          <OptimisticL2OutputRootsListItem
            key={ item.l2_output_index + (isPlaceholderData ? String(index) : '') }
            item={ item }
            isLoading={ isPlaceholderData }
          />
        ))) }
      </Box>
      <Box hideBelow="lg">
        <OptimisticL2OutputRootsTable items={ data.items } top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 } isLoading={ isPlaceholderData }/>
      </Box>
    </>
  ) : null;

  const text = (() => {
    if (countersQuery.isError || isError || !data?.items.length) {
      return null;
    }

    return (
      <Skeleton loading={ countersQuery.isPlaceholderData || isPlaceholderData } display="flex" flexWrap="wrap">
        <Trans
          t={ tQuat }
          i18nKey="l2Ui.output_range"
          count={ countersQuery.data ?? 0 }
          values={{
            layer: layerLabels.current,
            from: formatNumber(data.items[0].l2_output_index, locale),
            to: formatNumber(data.items[data.items.length - 1].l2_output_index, locale),
            total: countersQuery.data === undefined ? '' : formatNumber(countersQuery.data, locale),
          }}
          components={{ from: <Text as="span" fontWeight={ 600 }/>, to: <Text as="span" fontWeight={ 600 }/> }}
        />
      </Skeleton>
    );
  })();

  const actionBar = <StickyPaginationWithText text={ text } pagination={ pagination }/>;

  return (
    <>
      <PageTitle title={ tQuat('l2Ui.output_roots') } withTextAd/>
      <DataListDisplay
        isError={ isError }
        itemsNum={ data?.items.length }
        emptyText={ tQuat('l2Ui.no_output_roots') }
        actionBar={ actionBar }
      >
        { content }
      </DataListDisplay>
    </>
  );
};

export default OptimisticL2OutputRoots;
