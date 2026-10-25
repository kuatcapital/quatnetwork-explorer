// Modified by Quat Capital, 2026-10-25: registered RU/KK and locale-aware week/date formats. GPL-3.0.
// eslint-disable-next-line no-restricted-imports
import dayjs from 'dayjs';
import kkLocale from 'dayjs/locale/kk';
import ruLocale from 'dayjs/locale/ru';
import duration from 'dayjs/plugin/duration';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import minMax from 'dayjs/plugin/minMax';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import utc from 'dayjs/plugin/utc';
import weekOfYear from 'dayjs/plugin/weekOfYear';

import { nbsp } from 'toolkit/utils/htmlEntities';

const relativeTimeConfig = {
  thresholds: [
    { l: 's', r: 1 },
    { l: 'ss', r: 59, d: 'second' },
    { l: 'm', r: 1 },
    { l: 'mm', r: 59, d: 'minute' },
    { l: 'h', r: 1 },
    { l: 'hh', r: 23, d: 'hour' },
    { l: 'd', r: 1 },
    { l: 'dd', r: 6, d: 'day' },
    { l: 'w', r: 1 },
    { l: 'ww', r: 4, d: 'week' },
    { l: 'M', r: 1 },
    { l: 'MM', r: 11, d: 'month' },
    { l: 'y', r: 17 },
    { l: 'yy', d: 'year' },
  ],
};

dayjs.extend(relativeTime, relativeTimeConfig);
dayjs.extend(updateLocale);
dayjs.extend(localizedFormat);
dayjs.extend(duration);
dayjs.extend(weekOfYear);
dayjs.extend(minMax);
dayjs.extend(utc);

dayjs.updateLocale('en', {
  formats: {
    llll: `MMM DD YYYY HH:mm:ss (Z${ nbsp }UTC)`,
    lll: 'MMM D, YYYY H:mm',
  },
  relativeTime: {
    s: '1s',
    ss: '%ds',
    future: 'in %s',
    past: '%s ago',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
    d: '1d',
    dd: '%dd',
    w: '1w',
    ww: '%dw',
    M: '1mo',
    MM: '%dmo',
    y: '1y',
    yy: '%dy',
  },
});

// Register locale data once; the active language belongs to each dayjs instance.
function russianWeeks(count: number, withoutSuffix: boolean): string {
  const forms = [ withoutSuffix ? 'неделя' : 'неделю', 'недели', 'недель' ];
  const lastTwo = count % 100;
  const last = count % 10;
  let form = forms[2];
  if (lastTwo < 11 || lastTwo > 14) {
    if (last === 1) {
      form = forms[0];
    } else if (last >= 2 && last <= 4) {
      form = forms[1];
    }
  }
  return `${ count } ${ form }`;
}

dayjs.updateLocale('ru', {
  formats: {
    ...ruLocale.formats,
    llll: `D MMM YYYY HH:mm:ss (Z${ nbsp }UTC)`,
    lll: 'D MMM YYYY HH:mm',
  },
  relativeTime: {
    ...ruLocale.relativeTime,
    w: (_count: number, withoutSuffix: boolean) => withoutSuffix ? 'неделя' : 'неделю',
    ww: russianWeeks,
  },
});

dayjs.updateLocale('kk', {
  formats: {
    ...kkLocale.formats,
    llll: `D MMM YYYY HH:mm:ss (Z${ nbsp }UTC)`,
    lll: 'D MMM YYYY HH:mm',
  },
  relativeTime: {
    ...kkLocale.relativeTime,
    w: 'бір апта',
    ww: '%d апта',
  },
});

export default dayjs;

export const FORMATS = {
  // the "lll" format with seconds
  lll_s: 'MMM D, YYYY H:mm:ss',
};
