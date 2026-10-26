// Modified by Quat Capital, 2026-10-26: runtime stats metadata localization. GPL-3.0.
// Modified by Quat Capital, 2026-10-26: localize block, gas and statistics UI. GPL-3.0.
import { Box, Flex, chakra } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { localizeStatsMetadata } from 'lib/stats/localizeStatsMetadata';
import { STATS_CHARTS_SECTION_GAS } from 'stubs/stats';
import { Link } from 'toolkit/chakra/link';
import { ContentLoader } from 'toolkit/components/loaders/ContentLoader';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import ChartWidgetContainer from 'ui/stats/ChartWidgetContainer';

const GAS_PRICE_CHART_ID = 'averageGasPrice';

const GasTrackerChart = () => {
  const { t } = useTranslation();
  const [ isChartLoadingError, setChartLoadingError ] = React.useState(false);
  const { data, isPlaceholderData, isError } = useApiQuery('stats:lines', {
    queryOptions: {
      placeholderData: {
        sections: [ STATS_CHARTS_SECTION_GAS ],
      },
    },
  });

  const handleLoadingError = React.useCallback(() => {
    setChartLoadingError(true);
  }, []);

  const chart = data?.sections.map((section) => section.charts.find((chart) => chart.id === GAS_PRICE_CHART_ID)).filter(Boolean)?.[0];

  const content = (() => {
    if (isPlaceholderData) {
      return <ContentLoader/>;
    }

    if (isChartLoadingError || isError) {
      return <DataFetchAlert/>;
    }

    if (!chart) {
      return null;
    }

    const metadata = localizeStatsMetadata(chart, t, config.chain.currency.symbol);
    return (
      <ChartWidgetContainer
        id={ GAS_PRICE_CHART_ID }
        title={ metadata.title }
        description={ metadata.description }
        interval="oneMonth"
        isPlaceholderData={ isPlaceholderData }
        onLoadingError={ handleLoadingError }
        h="320px"
      />
    );
  })();

  if (!chart) {
    return null;
  }

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb={ 6 }>
        <chakra.h3 textStyle="h3">{ t('gasTracker.history') }</chakra.h3>
        <Link href={ route({ pathname: '/stats', hash: 'gas' }) }>{ t('gasTracker.charts') }</Link>
      </Flex>
      { content }
    </Box>
  );
};

export default React.memo(GasTrackerChart);
