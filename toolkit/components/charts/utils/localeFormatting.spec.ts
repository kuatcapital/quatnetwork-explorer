// Modified by Quat Capital, 2026-10-26: chart locale/formatter isolation regressions. GPL-3.0.
import * as d3 from 'd3';

import type { TimeChartData } from '../types';
import { Resolution } from '../types';

import { NUMBER_LOCALES } from 'lib/format/localeNumbers';
import { describe, expect, it } from 'vitest';

import { getDateLabel } from './getDateLabel';
import { getAxesParams } from './timeChartAxis';

const data: TimeChartData = [ {
  id: 'native', name: 'data', charts: [],
  items: [ { date: new Date('2026-01-01T00:00:00Z'), value: 0.1 }, { date: new Date('2026-01-10T00:00:00Z'), value: 0.9 } ],
} ];

describe('chart locale formatters', () => {
  it('formats axis numbers using the same locale used to measure label widths', () => {
    for (const locale of [ 'ru', 'kk', 'en' ] as const) {
      const axes = getAxesParams(data, undefined, locale);
      const formatter = axes.y.tickFormatter();
      expect(formatter(0.125)).toBe(new Intl.NumberFormat(NUMBER_LOCALES[locale], axes.y.labelFormatParams).format(0.125));
      const ticks = axes.y.scale.ticks(3);
      expect(new Set(ticks.map(formatter)).size).toBe(ticks.length);
      expect(axes.y.labelFormatParams.maxLabelLength).toBeGreaterThanOrEqual(Math.max(...ticks.map((tick) => formatter(tick).length)));
    }
  });

  it('keeps per-request month names isolated and preserves custom value formatters', () => {
    const axis = d3.axisBottom(d3.scaleTime().domain([ data[0].items[0].date, data[0].items[1].date ]));
    const date = data[0].items[0].date;
    const english = getAxesParams(data, undefined, 'en').x.tickFormatter(axis)(date);
    const russian = getAxesParams(data, undefined, 'ru').x.tickFormatter(axis)(date);
    const kazakh = getAxesParams(data, undefined, 'kk').x.tickFormatter(axis)(date);
    expect(russian).not.toBe(english);
    expect(kazakh).not.toBe(english);
    expect(getAxesParams(data, undefined, 'en').x.tickFormatter(axis)(date)).toBe(english);
    const custom = () => () => 'custom-unit';
    expect(getAxesParams(data, { y: { tickFormatter: custom } }, 'ru').y.tickFormatter()(10)).toBe('custom-unit');
  });

  it('formats date intervals in UTC while retaining the original English output', () => {
    const start = new Date('2026-01-25T23:40:00-05:00');
    const end = new Date('2026-02-01T04:40:00Z');
    const english = getDateLabel(start, end, Resolution.WEEK, 'en');
    expect(english).toBe('26 Jan 2026 –  1 Feb 2026');
    expect(getDateLabel(start, end, Resolution.WEEK, 'ru')).toContain('26 янв. 2026');
    expect(getDateLabel(start, end, Resolution.WEEK, 'kk')).not.toBe(english);
    expect(getDateLabel(start, undefined, Resolution.YEAR, 'kk')).toBe('2026');
    expect(getDateLabel(start, end, Resolution.WEEK, 'en')).toBe(english);
  });
});
