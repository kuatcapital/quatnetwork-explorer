// Modified by Quat Capital, 2026-10-25: localized homepage chart series names (T18, GPL-3.0).
import { useTranslation } from 'react-i18next';

import type { TimeChartData, TimeChartItemRaw } from 'toolkit/components/charts/types';
import type { ChainIndicatorId } from 'types/homepage';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';

import { getChartData } from './utils/chart';

const rollupFeature = config.features.rollup;
const isOptimisticRollup = rollupFeature.isEnabled && rollupFeature.type === 'optimistic';
const isArbitrumRollup = rollupFeature.isEnabled && rollupFeature.type === 'arbitrum';

const isStatsFeatureEnabled = config.features.stats.isEnabled;

export type UseFetchChartDataResult = {
  isError: boolean;
  isPending: boolean;
  data: TimeChartData;
};

export default function useChartDataQuery(indicatorId: ChainIndicatorId): UseFetchChartDataResult {
  const { t } = useTranslation();
  const { locale } = useLocale();

  const localizedChartData = (id: ChainIndicatorId, items: Array<TimeChartItemRaw>): TimeChartData => {
    const name = (() => {
      switch (id) {
        case 'daily_txs':
        case 'daily_operational_txs':
          return t('home.transactions_per_day');
        case 'coin_price':
          return t('home.coin_price', { symbol: config.features.multichain.isEnabled ? 'ETH' : config.chain.currency.symbol });
        case 'secondary_coin_price':
          return t('home.coin_price', { symbol: config.chain.currency.symbol });
        case 'market_cap':
          return t('common.market_cap');
        case 'tvl':
          return t('home.tvl_short');
      }
    })();
    const valueFormatter = (value: number): string => {
      if (id === 'coin_price' || id === 'secondary_coin_price') {
        return '$' + formatNumber(value, locale, { minimumFractionDigits: 2, maximumFractionDigits: 6 });
      }
      if (id === 'market_cap') {
        return '$' + formatNumber(value, locale, { maximumFractionDigits: 2 });
      }
      const formatted = formatNumber(value, locale, { maximumFractionDigits: 2, notation: 'compact' });
      return id === 'tvl' ? '$' + formatted : formatted;
    };
    return getChartData(id, items).map((series) => ({ ...series, name, valueFormatter }));
  };
  const statsDailyTxsQuery = useApiQuery('stats:pages_main', {
    queryOptions: {
      refetchOnMount: false,
      enabled: isStatsFeatureEnabled && indicatorId === 'daily_txs',
      select: (data) => data.daily_new_transactions?.chart.map((item) => ({ date: new Date(item.date), value: Number(item.value) })) || [],
    },
  });

  const statsDailyOperationalTxsQuery = useApiQuery('stats:pages_main', {
    queryOptions: {
      refetchOnMount: false,
      enabled: isStatsFeatureEnabled && indicatorId === 'daily_operational_txs',
      select: (data) => {
        if (isArbitrumRollup) {
          return data.daily_new_operational_transactions?.chart.map((item) => ({ date: new Date(item.date), value: Number(item.value) })) || [];
        } else if (isOptimisticRollup) {
          return data.op_stack_daily_new_operational_transactions?.chart.map((item) => ({ date: new Date(item.date), value: Number(item.value) })) || [];
        }
        return [];
      },
    },
  });

  const apiDailyTxsQuery = useApiQuery('general:stats_charts_txs', {
    queryOptions: {
      refetchOnMount: false,
      enabled: !isStatsFeatureEnabled && indicatorId === 'daily_txs',
      select: (data) => data.chart_data.map((item) => ({ date: new Date(item.date), value: item.transactions_count })),
    },
  });

  const coinPriceQuery = useApiQuery('general:stats_charts_market', {
    queryOptions: {
      refetchOnMount: false,
      enabled: indicatorId === 'coin_price',
      select: (data) => data.chart_data.map((item) => ({ date: new Date(item.date), value: item.closing_price })),
    },
  });

  const secondaryCoinPriceQuery = useApiQuery('general:stats_charts_secondary_coin_price', {
    queryOptions: {
      refetchOnMount: false,
      enabled: indicatorId === 'secondary_coin_price',
      select: (data) => data.chart_data.map((item) => ({ date: new Date(item.date), value: item.closing_price })),
    },
  });

  const marketCapQuery = useApiQuery('general:stats_charts_market', {
    queryOptions: {
      refetchOnMount: false,
      enabled: indicatorId === 'market_cap',
      select: (data) => data.chart_data.map((item) => (
        {
          date: new Date(item.date),
          value: (() => {
            if (item.market_cap !== undefined) {
              return item.market_cap;
            }

            if (item.closing_price === null) {
              return null;
            }

            return Number(item.closing_price) * Number(data.available_supply);
          })(),
        })),
    },
  });

  const tvlQuery = useApiQuery('general:stats_charts_market', {
    queryOptions: {
      refetchOnMount: false,
      enabled: indicatorId === 'tvl',
      select: (data) => data.chart_data.map((item) => (
        {
          date: new Date(item.date),
          value: item.tvl !== undefined ? item.tvl : 0,
        })),
    },
  });

  switch (indicatorId) {
    case 'daily_txs': {
      const query = isStatsFeatureEnabled ? statsDailyTxsQuery : apiDailyTxsQuery;
      return {
        data: localizedChartData(indicatorId, query.data || []),
        isError: query.isError,
        isPending: query.isPending,
      };
    }
    case 'daily_operational_txs': {
      return {
        data: localizedChartData(indicatorId, statsDailyOperationalTxsQuery.data || []),
        isError: statsDailyOperationalTxsQuery.isError,
        isPending: statsDailyOperationalTxsQuery.isPending,
      };
    }
    case 'coin_price': {
      return {
        data: localizedChartData(indicatorId, coinPriceQuery.data || []),
        isError: coinPriceQuery.isError,
        isPending: coinPriceQuery.isPending,
      };
    }
    case 'secondary_coin_price': {
      return {
        data: localizedChartData(indicatorId, secondaryCoinPriceQuery.data || []),
        isError: secondaryCoinPriceQuery.isError,
        isPending: secondaryCoinPriceQuery.isPending,
      };
    }
    case 'market_cap': {
      return {
        data: localizedChartData(indicatorId, marketCapQuery.data || []),
        isError: marketCapQuery.isError,
        isPending: marketCapQuery.isPending,
      };
    }
    case 'tvl': {
      return {
        data: localizedChartData(indicatorId, tvlQuery.data || []),
        isError: tvlQuery.isError,
        isPending: tvlQuery.isPending,
      };
    }
  }
}
