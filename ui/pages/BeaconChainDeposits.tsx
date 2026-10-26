// Modified by Quat Capital, 2026-10-26: localize validators, epochs and transfers. GPL-3.0.
import { Box, Text } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';
import { useTranslation } from 'react-i18next';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { formatBigNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { DEPOSIT } from 'stubs/deposits';
import { generateListStub } from 'stubs/utils';
import { Skeleton } from 'toolkit/chakra/skeleton';
import BeaconChainDepositsListItem from 'ui/deposits/beaconChain/BeaconChainDepositsListItem';
import BeaconChainDepositsTable from 'ui/deposits/beaconChain/BeaconChainDepositsTable';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import StickyPaginationWithText from 'ui/shared/StickyPaginationWithText';

const feature = config.features.beaconChain;

const BeaconChainDeposits = () => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const { data, isError, isPlaceholderData, pagination } = useQueryWithPages({
    resourceName: 'general:deposits',
    options: {
      placeholderData: generateListStub<'general:deposits'>(DEPOSIT, 50, { next_page_params: {
        index: 5,
        items_count: 50,
      } }),
    },
  });

  const countersQuery = useApiQuery('general:deposits_counters', {
    queryOptions: {
      placeholderData: {
        deposits_count: '19091878',
      },
    },
  });

  const content = data?.items ? (
    <>
      <Box hideFrom="lg">
        { data.items.map(((item, index) => (
          <BeaconChainDepositsListItem
            key={ item.index + (isPlaceholderData ? String(index) : '') }
            item={ item }
            view="list"
            isLoading={ isPlaceholderData }
          />
        ))) }
      </Box>
      <Box hideBelow="lg">
        <BeaconChainDepositsTable
          items={ data.items }
          view="list"
          top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
          isLoading={ isPlaceholderData }
        />
      </Box>
    </>
  ) : null;

  const text = (() => {
    if (countersQuery.isError || !feature.isEnabled || feature.withdrawalsOnly) {
      return null;
    }

    return (
      <Skeleton loading={ countersQuery.isPlaceholderData || isPlaceholderData } display="flex" flexWrap="wrap">
        { countersQuery.data && (
          <Text lineHeight={{ base: '24px', lg: '32px' }}>
            { t('networkTransfers.deposits_processed', { value: formatBigNumber(BigNumber(countersQuery.data.deposits_count), locale) }) }
          </Text>
        ) }
      </Skeleton>
    );
  })();

  const actionBar = <StickyPaginationWithText text={ text } pagination={ pagination }/>;

  return (
    <>
      <PageTitle
        title={ config.meta.seo.enhancedDataEnabled ? t('networkTransfers.chain_deposits', { chain: config.chain.name }) : t('networkTransfers.deposits') }
        withTextAd
      />
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

export default BeaconChainDeposits;
