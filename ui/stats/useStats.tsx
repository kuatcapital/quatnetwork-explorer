// Modified by Quat Capital, 2026-10-26: runtime stats metadata localization. GPL-3.0.
import { useRouter } from 'next/router';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type * as stats from '@blockscout/stats-types';
import type { StatsIntervalIds } from 'types/client/stats';
import type { ExternalChainExtended } from 'types/externalChains';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import getQueryParamString from 'lib/router/getQueryParamString';
import { localizeStatsMetadata, localizeStatsSection } from 'lib/stats/localizeStatsMetadata';
import { STATS_CHARTS } from 'stubs/stats';

function isSectionMatches(section: stats.LineChartSection, currentSection: string): boolean {
  return currentSection === 'all' || section.id === currentSection;
}

function isChartNameMatches(q: string, chart: stats.LineChartInfo) {
  return chart.title.toLowerCase().includes(q.toLowerCase());
}

interface Props {
  chain?: ExternalChainExtended;
}

export default function useStats({ chain }: Props = {}) {
  const { t } = useTranslation();
  const router = useRouter();

  const { data, isPlaceholderData, isError } = useApiQuery('stats:lines', {
    queryOptions: {
      placeholderData: STATS_CHARTS,
    },
    chain,
  });

  const nativeSymbol = chain?.app_config?.chain.currency.symbol || config.chain.currency.symbol;
  const localizedSections = useMemo(() => data?.sections?.map(section => ({
    ...localizeStatsSection(section, t),
    charts: section.charts.map(chart => localizeStatsMetadata(chart, t, nativeSymbol)),
  })), [ data?.sections, t, nativeSymbol ]);
  const autoFilterRef = React.useRef<{ id: string; title: string } | undefined>(undefined);

  const [ currentSection, setCurrentSection ] = useState('all');
  const [ filterQuery, setFilterQuery ] = useState('');
  const [ initialFilterQuery, setInitialFilterQuery ] = React.useState('');
  const [ interval, setInterval ] = useState<StatsIntervalIds>('oneMonth');
  const sectionIds = useMemo(() => localizedSections?.map(({ id }) => id), [ localizedSections ]);

  React.useEffect(() => {
    if (isPlaceholderData || isError) {
      return;
    }
    const requestedChartId = getQueryParamString(router.query.chartId);
    const chartId = requestedChartId || autoFilterRef.current?.id;
    const chart = localizedSections?.flatMap(section => section.charts).find(chart => chart.id === chartId);
    if (!chart) {
      return;
    }
    autoFilterRef.current = { id: chart.id, title: chart.title };
    setInitialFilterQuery(chart.title);
    setFilterQuery(chart.title);
    if (requestedChartId) {
      router.replace({ pathname: '/stats' }, undefined, { scroll: false });
    }
  }, [ isPlaceholderData, isError, localizedSections, router ]);

  const displayedCharts = React.useMemo(() => {
    return localizedSections
      ?.map((section) => {
        const charts = section.charts.filter((chart) => isSectionMatches(section, currentSection) && isChartNameMatches(filterQuery, chart));

        return {
          ...section,
          charts,
        };
      }).filter((section) => section.charts.length > 0);
  }, [ currentSection, localizedSections, filterQuery ]);

  const handleSectionChange = useCallback((newSection: string) => {
    setCurrentSection(newSection);
  }, []);

  const handleIntervalChange = useCallback((newInterval: StatsIntervalIds) => {
    setInterval(newInterval);
  }, []);

  const handleFilterChange = useCallback((q: string) => {
    if (q !== autoFilterRef.current?.title) {
      autoFilterRef.current = undefined;
    }
    setFilterQuery(q);
  }, []);

  return React.useMemo(() => ({
    sections: localizedSections,
    sectionIds,
    isPlaceholderData,
    isError,
    initialFilterQuery,
    filterQuery,
    currentSection,
    handleSectionChange,
    interval,
    handleIntervalChange,
    handleFilterChange,
    displayedCharts,
  }), [
    localizedSections,
    sectionIds,
    isPlaceholderData,
    isError,
    initialFilterQuery,
    filterQuery,
    currentSection,
    handleSectionChange,
    interval,
    handleIntervalChange,
    handleFilterChange,
    displayedCharts,
  ]);
}
