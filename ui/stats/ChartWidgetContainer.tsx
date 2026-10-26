// Modified by Quat Capital, 2026-10-26: runtime stats metadata localization. GPL-3.0.
// Modified by Quat Capital, 2026-10-26: localize block, gas and statistics UI. GPL-3.0.
import { chakra } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Resolution } from '@blockscout/stats-types';
import type { StatsIntervalIds } from 'types/client/stats';

import { route, type Route } from 'nextjs-routes';

import config from 'configs/app';
import { useMultichainContext } from 'lib/contexts/multichain';
import { localizeStatsMetadata } from 'lib/stats/localizeStatsMetadata';
import { ChartWidget } from 'toolkit/components/charts/ChartWidget';
import { useChartsConfig } from 'ui/shared/chart/config';
import useChartQuery from 'ui/shared/chart/useChartQuery';

type Props = {
  id: string;
  title: string;
  description: string;
  interval: StatsIntervalIds;
  onLoadingError: () => void;
  isPlaceholderData: boolean;
  className?: string;
  href?: Route;
};

const ChartWidgetContainer = ({
  id,
  title,
  description,
  interval,
  onLoadingError,
  isPlaceholderData,
  className,
  href,
}: Props) => {
  const { t } = useTranslation();
  const nativeSymbol = useMultichainContext()?.chain.app_config.chain.currency.symbol || config.chain.currency.symbol;
  const { items, lineQuery } = useChartQuery(id, Resolution.DAY, interval, !isPlaceholderData);
  const chartsConfig = useChartsConfig();
  const metadata = localizeStatsMetadata({ id, title, description, units: lineQuery.data?.info?.units }, t, nativeSymbol);

  useEffect(() => {
    if (lineQuery.isError) {
      onLoadingError();
    }
  }, [ lineQuery.isError, onLoadingError ]);

  const charts = React.useMemo(() => {
    if (!lineQuery.data?.info || !items) {
      return [];
    }

    return [
      {
        id: lineQuery.data?.info?.id,
        name: t('statistics.chart_value'),
        items,
        charts: chartsConfig,
        units: localizeStatsMetadata(lineQuery.data.info, t, nativeSymbol).units,
      },
    ];
  }, [ lineQuery.data?.info, items, chartsConfig, t, nativeSymbol ]);

  return (
    <ChartWidget
      isError={ lineQuery.isError }
      charts={ charts }
      title={ metadata.title }
      description={ metadata.description }
      isLoading={ lineQuery.isPlaceholderData }
      minH="230px"
      className={ className }
      href={ href ? route(href) : undefined }
      chartUrl={ href ? `${ config.app.baseUrl }${ route(href) }` : undefined }
    />
  );
};

export default chakra(ChartWidgetContainer);
