// Modified by Quat Capital, 2026-10-26: translate complete incomplete-period labels. GPL-3.0.
import { useToken } from '@chakra-ui/react';
import * as d3 from 'd3';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Resolution } from '../../types';

import ChartTooltipRow from './ChartTooltipRow';

const ChartTooltipTitle = ({ resolution = Resolution.DAY }: { resolution?: Resolution }) => {
  const { t } = useTranslation();
  const titleColor = useToken('colors', 'yellow.300');
  const resolutionTitle = (() => {
    switch (resolution) {
      case Resolution.WEEK: return t('charts.incomplete_week');
      case Resolution.MONTH: return t('charts.incomplete_month');
      case Resolution.YEAR: return t('charts.incomplete_year');
      default: return t('charts.incomplete_day');
    }
  })();

  return (
    <ChartTooltipRow lineNum={ 0 }>
      <text
        className="ChartTooltip__title"
        transform="translate(0,0)"
        fill={ titleColor[0] }
        opacity={ 0 }
        dominantBaseline="hanging"
      >
        { resolutionTitle }
      </text>
    </ChartTooltipRow>
  );
};

export default React.memo(ChartTooltipTitle);

export function useRenderTitle(ref: React.RefObject<SVGGElement | null>) {
  return React.useCallback((isVisible: boolean) => {
    d3.select(ref.current)
      .select('.ChartTooltip__title')
      .attr('opacity', isVisible ? 1 : 0);
  }, [ ref ]);
}
