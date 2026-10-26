// Modified by Quat Capital, 2026-10-26: localize validators, epochs and transfers. GPL-3.0.
import { Box, Text } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';
import { useTranslation } from 'react-i18next';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { formatBigNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { currencyUnits } from 'lib/units';
import { generateListStub } from 'stubs/utils';
import { WITHDRAWAL } from 'stubs/withdrawals';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import StickyPaginationWithText from 'ui/shared/StickyPaginationWithText';
import calculateUsdValue from 'ui/shared/value/calculateUsdValue';
import BeaconChainWithdrawalsListItem from 'ui/withdrawals/beaconChain/BeaconChainWithdrawalsListItem';
import BeaconChainWithdrawalsTable from 'ui/withdrawals/beaconChain/BeaconChainWithdrawalsTable';

const feature = config.features.beaconChain;

const BeaconChainWithdrawals = () => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const { data, isError, isPlaceholderData, pagination } = useQueryWithPages({
    resourceName: 'general:withdrawals',
    options: {
      placeholderData: generateListStub<'general:withdrawals'>(WITHDRAWAL, 50, { next_page_params: {
        index: 5,
        items_count: 50,
      } }),
    },
  });

  const countersQuery = useApiQuery('general:withdrawals_counters', {
    queryOptions: {
      placeholderData: {
        withdrawals_count: '19091878',
        withdrawals_sum: '4630710684332438',
      },
    },
  });

  const content = data?.items ? (
    <>
      <Box hideFrom="lg">
        { data.items.map(((item, index) => (
          <BeaconChainWithdrawalsListItem
            key={ item.index + (isPlaceholderData ? String(index) : '') }
            item={ item }
            view="list"
            isLoading={ isPlaceholderData }
          />
        ))) }
      </Box>
      <Box hideBelow="lg">
        <BeaconChainWithdrawalsTable
          items={ data.items }
          view="list"
          top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
          isLoading={ isPlaceholderData }
        />
      </Box>
    </>
  ) : null;

  const text = (() => {
    if (countersQuery.isError || !feature.isEnabled) {
      return null;
    }

    return (
      <Skeleton loading={ countersQuery.isPlaceholderData || isPlaceholderData } display="flex" flexWrap="wrap">
        { countersQuery.data && (
          <Text lineHeight={{ base: '24px', lg: '32px' }}>
            { t('networkTransfers.withdrawals_processed', {
              value: formatBigNumber(BigNumber(countersQuery.data.withdrawals_count), locale),
              amount: calculateUsdValue({ amount: countersQuery.data.withdrawals_sum, locale }).valueStr, symbol: currencyUnits.ether,
            }) }
          </Text>
        ) }
      </Skeleton>
    );
  })();

  const actionBar = <StickyPaginationWithText text={ text } pagination={ pagination }/>;

  return (
    <>
      <PageTitle
        title={ config.meta.seo.enhancedDataEnabled ?
          t('networkTransfers.chain_withdrawals', { chain: config.chain.name }) : t('networkTransfers.withdrawals') }
        withTextAd
      />
      <DataListDisplay
        isError={ isError }
        itemsNum={ data?.items.length }
        emptyText={ t('networkTransfers.no_withdrawals') }
        actionBar={ actionBar }
      >
        { content }
      </DataListDisplay>
    </>
  );
};

export default BeaconChainWithdrawals;
