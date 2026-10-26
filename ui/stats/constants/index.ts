// Modified by Quat Capital, 2026-10-26: runtime translation and locale formatting. GPL-3.0.
import type { TFunction } from 'i18next';

import { Resolution } from '@blockscout/stats-types';
import type { StatsIntervalIds } from 'types/client/stats';

export const STATS_RESOLUTIONS: Array<{ id: Resolution; title: string }> = [
  {
    id: Resolution.DAY,
    title: 'Day',
  },
  {
    id: Resolution.WEEK,
    title: 'Week',
  },
  {
    id: Resolution.MONTH,
    title: 'Month',
  },
  {
    id: Resolution.YEAR,
    title: 'Year',
  },
];

export const STATS_INTERVALS: { [key in StatsIntervalIds]: { title: string; shortTitle: string; start?: Date } } = {
  all: {
    title: 'All time',
    shortTitle: 'All time',
  },
  oneMonth: {
    title: '1 month',
    shortTitle: '1M',
    start: getStartDateInPast(1),
  },
  threeMonths: {
    title: '3 months',
    shortTitle: '3M',
    start: getStartDateInPast(3),
  },
  sixMonths: {
    title: '6 months',
    shortTitle: '6M',
    start: getStartDateInPast(6),
  },
  oneYear: {
    title: '1 year',
    shortTitle: '1Y',
    start: getStartDateInPast(12),
  },
};

function getStartDateInPast(months: number): Date {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return date;
}

// Retain raw constants for query date ranges; UI labels are translated per render.
export function getStatsResolutions(t: TFunction): typeof STATS_RESOLUTIONS {
  return [
    { id: Resolution.DAY, title: t('statistics.day') },
    { id: Resolution.WEEK, title: t('statistics.week') },
    { id: Resolution.MONTH, title: t('statistics.month') },
    { id: Resolution.YEAR, title: t('statistics.year') },
  ];
}

export function getStatsIntervals(t: TFunction): typeof STATS_INTERVALS {
  return {
    all: { ...STATS_INTERVALS.all, title: t('statistics.all_time'), shortTitle: t('statistics.all_time') },
    oneMonth: { ...STATS_INTERVALS.oneMonth, title: t('statistics.one_month'), shortTitle: t('statistics.one_month_short') },
    threeMonths: { ...STATS_INTERVALS.threeMonths, title: t('statistics.three_months'), shortTitle: t('statistics.three_months_short') },
    sixMonths: { ...STATS_INTERVALS.sixMonths, title: t('statistics.six_months'), shortTitle: t('statistics.six_months_short') },
    oneYear: { ...STATS_INTERVALS.oneYear, title: t('statistics.one_year'), shortTitle: t('statistics.one_year_short') },
  };
}
