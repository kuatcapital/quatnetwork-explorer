// Modified by Quat Capital, 2026-10-26: runtime stats metadata localization. GPL-3.0.
// Modified by Quat Capital, 2026-10-26: localize shared controls, details and data feedback. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { LineChart, Resolution } from '@blockscout/stats-types';
import type { StatsIntervalIds } from 'types/client/stats';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { useAppContext } from 'lib/contexts/app';
import { useMultichainContext } from 'lib/contexts/multichain';
import { localizeStatsMetadata } from 'lib/stats/localizeStatsMetadata';
import { STATS_INTERVALS } from 'ui/stats/constants';

import { formatDate } from './utils';

export default function useChartQuery(id: string, resolution: Resolution, interval: StatsIntervalIds, enabled = true) {
  const { t } = useTranslation();
  const nativeSymbol = useMultichainContext()?.chain.app_config.chain.currency.symbol || config.chain.currency.symbol;
  const { apiData } = useAppContext<'/stats/[id]'>();

  const selectedInterval = STATS_INTERVALS[interval];

  const endDate = selectedInterval.start ? formatDate(new Date()) : undefined;
  const startDate = selectedInterval.start ? formatDate(selectedInterval.start) : undefined;

  const [ info, setInfo ] = React.useState<LineChart['info']>(apiData || undefined);

  const lineQuery = useApiQuery('stats:line', {
    pathParams: { id },
    queryParams: {
      from: startDate,
      to: endDate,
      resolution,
    },
    queryOptions: {
      enabled: enabled,
      refetchOnMount: false,
      placeholderData: {
        info: {
          title: t('sharedUi.chart_placeholder_title'),
          description: t('sharedUi.chart_placeholder_description'),
          resolutions: [ 'DAY', 'WEEK', 'MONTH', 'YEAR' ],
          id: 'placeholder',
          units: undefined,
        },
        chart: [],
      },
    },
  });

  React.useEffect(() => {
    if (!info && lineQuery.data?.info && !lineQuery.isPlaceholderData) {
      // save info to keep title and description when change query params
      setInfo(lineQuery.data?.info);
    }
  }, [ info, lineQuery.data?.info, lineQuery.isPlaceholderData ]);

  const items = React.useMemo(() => lineQuery.data?.chart?.map((item) => {
    return { date: new Date(item.date), date_to: new Date(item.date_to), value: Number(item.value), isApproximate: item.is_approximate };
  }), [ lineQuery ]);

  const localizedInfo = React.useMemo(() => info ? localizeStatsMetadata(info, t, nativeSymbol) : info, [ info, t, nativeSymbol ]);

  return {
    items,
    info: localizedInfo,
    lineQuery,
  };
}
