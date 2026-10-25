// Modified by Quat Capital, 2026-10-25: localized own homepage metric labels (T18, GPL-3.0).
import { Grid } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';
import { useTranslation } from 'react-i18next';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { formatBigNumber, formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { layerLabels } from 'lib/rollups/utils';
import { HOMEPAGE_STATS, HOMEPAGE_STATS_MICROSERVICE } from 'stubs/stats';
import GasInfoTooltip from 'ui/shared/gas/GasInfoTooltip';
import GasPrice from 'ui/shared/gas/GasPrice';
import IconSvg from 'ui/shared/IconSvg';
import StatsWidget from 'ui/shared/stats/StatsWidget';
import { WEI } from 'ui/shared/value/utils';

import StatsDegraded from './fallbacks/StatsDegraded';
import type { HomeStatsItem } from './utils';
import { isHomeStatsItemEnabled, sortHomeStatsItems } from './utils';

const rollupFeature = config.features.rollup;
const isOptimisticRollup = rollupFeature.isEnabled && rollupFeature.type === 'optimistic';
const isArbitrumRollup = rollupFeature.isEnabled && rollupFeature.type === 'arbitrum';
const isStatsFeatureEnabled = config.features.stats.isEnabled;

const Stats = () => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const [ hasGasTracker, setHasGasTracker ] = React.useState(config.features.gasTracker.isEnabled);

  // data from stats microservice is prioritized over data from stats api
  const statsQuery = useApiQuery('stats:pages_main', {
    queryOptions: {
      refetchOnMount: false,
      placeholderData: isStatsFeatureEnabled ? HOMEPAGE_STATS_MICROSERVICE : undefined,
      enabled: isStatsFeatureEnabled,
    },
  });

  const apiQuery = useApiQuery('general:stats', {
    queryOptions: {
      refetchOnMount: false,
      placeholderData: HOMEPAGE_STATS,
    },
  });

  const isPlaceholderData = statsQuery.isPlaceholderData || apiQuery.isPlaceholderData;

  React.useEffect(() => {
    if (!isPlaceholderData && !apiQuery.data?.gas_prices?.average) {
      setHasGasTracker(false);
    }
  // should run only after initial fetch
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ isPlaceholderData ]);

  const zkEvmLatestBatchQuery = useApiQuery('general:homepage_zkevm_latest_batch', {
    queryOptions: {
      placeholderData: 12345,
      enabled: rollupFeature.isEnabled && rollupFeature.type === 'zkEvm' && config.UI.homepage.stats.includes('latest_batch'),
    },
  });

  const zkSyncLatestBatchQuery = useApiQuery('general:homepage_zksync_latest_batch', {
    queryOptions: {
      placeholderData: 12345,
      enabled: rollupFeature.isEnabled && rollupFeature.type === 'zkSync' && config.UI.homepage.stats.includes('latest_batch'),
    },
  });

  const arbitrumLatestBatchQuery = useApiQuery('general:homepage_arbitrum_latest_batch', {
    queryOptions: {
      placeholderData: 12345,
      enabled: rollupFeature.isEnabled && rollupFeature.type === 'arbitrum' && config.UI.homepage.stats.includes('latest_batch'),
    },
  });

  const latestBatchQuery = (() => {
    if (!rollupFeature.isEnabled || !config.UI.homepage.stats.includes('latest_batch')) {
      return;
    }

    switch (rollupFeature.type) {
      case 'zkEvm':
        return zkEvmLatestBatchQuery;
      case 'zkSync':
        return zkSyncLatestBatchQuery;
      case 'arbitrum':
        return arbitrumLatestBatchQuery;
    }
  })();

  if (apiQuery.isError || statsQuery.isError || latestBatchQuery?.isError) {
    return <StatsDegraded/>;
  }

  const isLoading = isPlaceholderData || latestBatchQuery?.isPlaceholderData;

  const apiData = apiQuery.data;
  const statsData = statsQuery.data;

  const items: Array<HomeStatsItem> = (() => {
    if (!statsData && !apiData) {
      return [];
    }

    const gasInfoTooltip = hasGasTracker && apiData?.gas_prices && apiData.gas_prices.average ? (
      <GasInfoTooltip data={ apiData } dataUpdatedAt={ apiQuery.dataUpdatedAt }>
        <IconSvg
          isLoading={ isLoading }
          name="info"
          boxSize={ 5 }
          flexShrink={ 0 }
          cursor="pointer"
          color="icon.secondary"
          _hover={{ color: 'hover' }}
        />
      </GasInfoTooltip>
    ) : null;

    return [
      latestBatchQuery?.data !== undefined && {
        id: 'latest_batch' as const,
        icon: 'txn_batches' as const,
        label: t('home.latest_batch'),
        value: formatNumber(latestBatchQuery.data, locale),
        href: { pathname: '/batches' as const },
        isLoading,
      },
      (statsData?.total_blocks?.value || apiData?.total_blocks) && {
        id: 'total_blocks' as const,
        icon: 'block' as const,
        label: t('home.total_blocks'),
        value: formatNumber(Number(statsData?.total_blocks?.value || apiData?.total_blocks), locale),
        href: { pathname: '/blocks' as const },
        isLoading,
      },
      (statsData?.average_block_time?.value || apiData?.average_block_time) && {
        id: 'average_block_time' as const,
        icon: 'clock-light' as const,
        label: t('home.average_block_time'),
        value: t('home.seconds', {
          value: formatNumber(
            statsData?.average_block_time?.value ? Number(statsData.average_block_time.value) : apiData!.average_block_time / 1000,
            locale,
            { minimumFractionDigits: 1, maximumFractionDigits: 1 },
          ),
        }),
        isLoading,
      },
      (statsData?.total_transactions?.value || apiData?.total_transactions) && {
        id: 'total_txs' as const,
        icon: 'transactions' as const,
        label: t('home.total_transactions'),
        value: formatNumber(Number(statsData?.total_transactions?.value || apiData?.total_transactions), locale),
        href: { pathname: '/txs' as const },
        isLoading,
      },
      (isArbitrumRollup && statsData?.total_operational_transactions?.value) && {
        id: 'total_operational_txs' as const,
        icon: 'transactions' as const,
        label: t('home.total_operational_transactions'),
        value: formatNumber(Number(statsData?.total_operational_transactions?.value), locale),
        href: { pathname: '/txs' as const },
        isLoading,
      },
      (isOptimisticRollup && statsData?.op_stack_total_operational_transactions?.value) && {
        id: 'total_operational_txs' as const,
        icon: 'transactions' as const,
        label: t('home.total_operational_transactions'),
        value: formatNumber(Number(statsData?.op_stack_total_operational_transactions?.value), locale),
        href: { pathname: '/txs' as const },
        isLoading,
      },
      apiData?.last_output_root_size && {
        id: 'latest_l1_state_batch' as const,
        icon: 'txn_batches' as const,
        label: t('home.latest_state_batch', { layer: layerLabels.parent }),
        value: apiData?.last_output_root_size,
        href: { pathname: '/batches' as const },
        isLoading,
      },
      (statsData?.total_addresses?.value || apiData?.total_addresses) && {
        id: 'wallet_addresses' as const,
        icon: 'wallet' as const,
        label: t('home.wallet_addresses'),
        value: formatNumber(Number(statsData?.total_addresses?.value || apiData?.total_addresses), locale),
        isLoading,
      },
      hasGasTracker && apiData?.gas_prices && {
        id: 'gas_tracker' as const,
        icon: 'gas' as const,
        label: t('navigation.gas_tracker'),
        value: apiData.gas_prices.average ? <GasPrice data={ apiData.gas_prices.average }/> : t('home.not_available'),
        hint: gasInfoTooltip,
        isLoading,
      },
      apiData?.rootstock_locked_btc && {
        id: 'btc_locked' as const,
        icon: 'coins/bitcoin' as const,
        label: t('home.btc_locked'),
        value: `${ formatBigNumber(BigNumber(apiData.rootstock_locked_btc).div(WEI).dp(0), locale) } RBTC`,
        isLoading,
      },
      apiData?.celo && {
        id: 'current_epoch' as const,
        icon: 'hourglass' as const,
        label: t('home.current_epoch_label'),
        value: `#${ apiData.celo.epoch_number }`,
        href: { pathname: '/epochs/[number]' as const, query: { number: String(apiData.celo.epoch_number) } },
        isLoading,
      },
    ]
      .filter(Boolean)
      .filter(isHomeStatsItemEnabled)
      .sort(sortHomeStatsItems);
  })();

  if (items.length === 0) {
    return null;
  }

  return (
    <Grid
      gridTemplateColumns="1fr 1fr"
      gridGap={{ base: 1, lg: 2 }}
      flexBasis="50%"
      flexGrow={ 1 }
    >
      { items.map((item, index) => (
        <StatsWidget
          key={ item.id }
          { ...item }
          isLoading={ isLoading }
          _last={ items.length % 2 === 1 && index === items.length - 1 ? { gridColumn: 'span 2' } : undefined }/>
      ),
      ) }
    </Grid>

  );
};

export default Stats;
