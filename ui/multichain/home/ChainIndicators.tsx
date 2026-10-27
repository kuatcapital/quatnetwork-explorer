// Modified by Quat Capital, 2026-10-27: complete runtime multichain localization. GPL-3.0.
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { HomeStats } from 'types/api/stats';
import type { TChainIndicator } from 'ui/home/indicators/types';

import useApiQuery from 'lib/api/useApiQuery';
import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { HOMEPAGE_STATS } from 'stubs/multichain';
import ChainIndicatorsChart from 'ui/home/indicators/ChainIndicatorsChart';
import ChainIndicatorsContainer from 'ui/home/indicators/ChainIndicatorsContainer';
import ChainIndicatorsList from 'ui/home/indicators/ChainIndicatorsList';
import { isIndicatorEnabled, sortIndicators } from 'ui/home/indicators/utils/indicators';
import IconSvg from 'ui/shared/IconSvg';

import NativeTokenIcon from '../components/NativeTokenIcon';
import useChartDataQuery from './useChartDataQuery';
import useFetchParentChainApi from './useFetchParentChainApi';

const ChainIndicators = () => {
  const { locale } = useLocale();

  const { t: tQuat } = useTranslation();
  const statsQuery = useApiQuery('multichainStats:pages_main', {
    queryOptions: {
      refetchOnMount: false,
      placeholderData: HOMEPAGE_STATS,
    },
  });

  const parentChainApiFetch = useFetchParentChainApi();

  const parentChainStatsQuery = useQuery({
    queryKey: [ 'parent_chain', 'stats' ],
    queryFn: () => parentChainApiFetch({ path: '/stats' }) as Promise<HomeStats>,
    refetchOnMount: false,
  });

  const indicators: Array<TChainIndicator> = React.useMemo(() => ([
    statsQuery.data && {
      id: 'daily_txs' as const,
      title: tQuat('multiUi.daily_transactions'),
      value: (() => {
        if (statsQuery.data.yesterday_txns_multichain?.value) {
          return formatNumber(Number(statsQuery.data.yesterday_txns_multichain.value), locale, { maximumFractionDigits: 2, notation: 'compact' });
        }
        return 'N/A';
      })(),
      valueDiff: (() => {
        if (statsQuery.data.new_txns_multichain_window) {
          const lastDay = statsQuery.data.new_txns_multichain_window.chart[statsQuery.data.new_txns_multichain_window.chart.length - 1].value;
          const secondLastDay = statsQuery.data.new_txns_multichain_window.chart[statsQuery.data.new_txns_multichain_window.chart.length - 2].value;
          if (Number(secondLastDay) !== 0) {
            return Number(((Number(lastDay) - Number(secondLastDay)) / Number(secondLastDay) * 100).toFixed(2));
          }
        }
        return undefined;
      })(),
      // FIXME use non-navigation icon
      icon: <IconSvg name="navigation/transactions" boxSize={ 6 } bgColor="#56ACD1" borderRadius="base" color="white"/>,
      hint: tQuat('multiUi.daily_transactions_hint'),
    },
    parentChainStatsQuery.data && {
      id: 'coin_price' as const,
      title: tQuat('multiUi.eth_price'),
      value: (() => {
        if (parentChainStatsQuery.data.coin_price) {
          return '$' + formatNumber(Number(parentChainStatsQuery.data.coin_price), locale, { minimumFractionDigits: 2, maximumFractionDigits: 6 });
        }
        return '$N/A';
      })(),
      valueDiff: parentChainStatsQuery.data.coin_price_change_percentage ?? undefined,
      icon: <NativeTokenIcon boxSize={ 6 }/>,
      hint: tQuat('multiUi.eth_daily_hint'),
    },
    parentChainStatsQuery.data && {
      id: 'market_cap' as const,
      title: tQuat('common.market_cap'),
      value: (() => {
        if (parentChainStatsQuery.data.market_cap) {
          return '$' + formatNumber(Number(parentChainStatsQuery.data.market_cap), locale, { maximumFractionDigits: 2, notation: 'compact' });
        }
        return '$N/A';
      })(),
      icon: <IconSvg name="globe" boxSize={ 6 } bgColor="#6A5DCC" borderRadius="base" color="white"/>,

      hint: tQuat('multiUi.market_hint'),
    },
  ]
    .filter(Boolean)
    .filter(isIndicatorEnabled)
    .sort(sortIndicators)
  ), [ parentChainStatsQuery.data, statsQuery.data, tQuat, locale ]);

  const [ selectedIndicatorId, selectIndicatorId ] = React.useState(indicators[0]?.id);
  const selectedIndicator = indicators.find(({ id }) => id === selectedIndicatorId);

  const chartQuery = useChartDataQuery({ indicatorId: selectedIndicatorId });

  return (
    <ChainIndicatorsContainer>
      { selectedIndicator && (
        <ChainIndicatorsChart
          isLoading={ statsQuery.isPlaceholderData || chartQuery.isPending }
          title={ selectedIndicator.title }
          hint={ selectedIndicator.hint }
          value={ selectedIndicator?.value }
          valueDiff={ selectedIndicator?.valueDiff }
          chartQuery={ chartQuery }
        />
      ) }
      <ChainIndicatorsList
        indicators={ indicators }
        isLoading={ statsQuery.isPlaceholderData || parentChainStatsQuery.isPending }
        selectedId={ selectedIndicatorId }
        onItemClick={ selectIndicatorId }
      />
    </ChainIndicatorsContainer>
  );
};

export default React.memo(ChainIndicators);
