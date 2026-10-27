// Modified by Quat Capital, 2026-10-27: complete runtime multichain localization. GPL-3.0.
import { Box, createListCollection } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { ChainMetricsSorting, ChainMetricsSortingField, ChainMetricsSortingValue } from 'types/client/multichainAggregator';

import multichainConfig from 'configs/multichain';
import useApiQuery from 'lib/api/useApiQuery';
import { CHAIN_METRICS } from 'stubs/multichain';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import getSortParamsFromValue from 'ui/shared/sort/getSortParamsFromValue';
import getSortValueFromQuery from 'ui/shared/sort/getSortValueFromQuery';
import Sort from 'ui/shared/sort/Sort';

import MultichainEcosystemsListItem from './MultichainEcosystemsListItem';
import MultichainEcosystemsTable from './MultichainEcosystemsTable';
import { SORT_OPTIONS, getEcosystemSortOptions } from './utils';

const MultichainEcosystems = () => {
  const { t: tQuat } = useTranslation();
  const sortCollection = React.useMemo(() => createListCollection({ items: getEcosystemSortOptions(tQuat) }), [ tQuat ]);

  const router = useRouter();

  const [ sort, setSort ] =
  React.useState<ChainMetricsSortingValue>(getSortValueFromQuery<ChainMetricsSortingValue>(router.query, SORT_OPTIONS) ?? 'default');

  const { data, isError, isPlaceholderData } = useApiQuery('multichainAggregator:chain_metrics', {
    queryParams: getSortParamsFromValue<ChainMetricsSortingValue, ChainMetricsSortingField, ChainMetricsSorting['order']>(sort),
    queryOptions: {
      placeholderData: { items: Array(10).fill(CHAIN_METRICS) },
    },
  });

  const chains = multichainConfig()?.chains;

  const handleSortChange = React.useCallback(({ value }: { value: Array<string> }) => {
    setSort(value[0] as ChainMetricsSortingValue);
  }, [ setSort ]);

  const content = data?.items ? (
    <>
      <Box hideBelow="lg">
        <MultichainEcosystemsTable
          data={ data.items }
          sort={ sort }
          setSorting={ handleSortChange }
          isLoading={ isPlaceholderData }
        />
      </Box>
      <Box hideFrom="lg">
        <ActionBar>
          <Sort
            name="chain_metrics_sorting"
            defaultValue={ [ sort ] }
            collection={ sortCollection }
            onValueChange={ handleSortChange }
            isLoading={ isPlaceholderData }
          />
        </ActionBar>
        { data.items.map((item, index) => (
          <MultichainEcosystemsListItem
            key={ item.chain_id + (isPlaceholderData ? String(index) : '') }
            data={ item }
            chainInfo={ chains?.find((chain) => chain.id === item.chain_id) }
            isLoading={ isPlaceholderData }
          />
        )) }
      </Box>
    </>
  ) : null;

  return (
    <>
      <PageTitle
        title={ tQuat('navigation.ecosystems') }
        withTextAd
      />
      <DataListDisplay
        isError={ isError }
        itemsNum={ data?.items.length }
        emptyText={ tQuat('multiUi.no_cluster_chains') }
      >
        { content }
      </DataListDisplay>
    </>
  );
};

export default React.memo(MultichainEcosystems);
