// Modified by Quat Capital, 2026-10-27: complete runtime multichain localization. GPL-3.0.
import { Flex } from '@chakra-ui/react';
import { BigNumber } from 'bignumber.js';
import React from 'react';
import { useTranslation } from 'react-i18next';

import useApiQuery from 'lib/api/useApiQuery';
import { formatBigNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { HOMEPAGE_STATS } from 'stubs/multichain';
import type { HomeStatsItem } from 'ui/home/utils';
import { sortHomeStatsItems, isHomeStatsItemEnabled } from 'ui/home/utils';
import StatsWidget from 'ui/shared/stats/StatsWidget';

import ChainIndicators from './ChainIndicators';

const Stats = () => {
  const { t: tQuat } = useTranslation();
  const { locale } = useLocale();

  const statsQuery = useApiQuery('multichainStats:pages_main', {
    queryOptions: {
      refetchOnMount: false,
      placeholderData: HOMEPAGE_STATS,
    },
  });

  const items: Array<HomeStatsItem> = React.useMemo(() => {
    return [
      statsQuery.data?.total_multichain_txns && {
        id: 'total_txs' as const,
        label: tQuat('home.total_transactions'),
        value: formatBigNumber(BigNumber(statsQuery.data.total_multichain_txns.value), locale),
        icon: 'transactions' as const,
        hint: tQuat('multiUi.transactions_cluster_hint'),
      },
      statsQuery.data?.total_multichain_addresses && {
        id: 'wallet_addresses' as const,
        label: tQuat('multiUi.total_addresses'),
        value: formatBigNumber(BigNumber(statsQuery.data.total_multichain_addresses.value), locale),
        icon: 'wallet' as const,
        hint: tQuat('multiUi.addresses_cluster_hint'),
      },
    ]
      .filter(Boolean)
      .filter(isHomeStatsItemEnabled)
      .sort(sortHomeStatsItems);
  }, [ statsQuery.data, locale, tQuat ]);

  return (
    <Flex mt={ 6 } gap={ 2 } flexDirection={{ base: 'column', lg: 'row' }}>
      { items.length > 0 && (
        <Flex gap={ 2 } flexDirection={{ base: 'row', lg: 'column' }} w={{ base: '100%', lg: '270px' }}>
          { items.map((item) => (
            <StatsWidget
              key={ item.id }
              label={ item.label }
              value={ item.value }
              icon={ item.icon }
              isLoading={ statsQuery.isPlaceholderData }
              hint={ item.hint }
              w={{ base: 'calc((100% - 8px) / 2)', lg: '100%' }}
            />
          )) }
        </Flex>
      ) }
      <ChainIndicators/>
    </Flex>
  );
};

export default React.memo(Stats);
