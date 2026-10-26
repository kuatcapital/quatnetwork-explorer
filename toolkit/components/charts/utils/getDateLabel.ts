// Modified by Quat Capital, 2026-10-26: localized chart dates without a global D3 locale. GPL-3.0.
import * as d3 from 'd3';

import { Resolution } from '../types';

import type { Locale } from 'configs/app/i18n';
import dayjs from 'lib/date/dayjs';

export function getDateLabel(date: Date, dateTo?: Date, resolution?: Resolution, locale: Locale = 'en'): string {
  if (locale !== 'en') {
    const localDate = dayjs(date).utc().locale(locale);
    switch (resolution) {
      case Resolution.WEEK:
        return localDate.format('D MMM YYYY') + (dateTo ? ` – ${ dayjs(dateTo).utc().locale(locale).format('D MMM YYYY') }` : '');
      case Resolution.MONTH: return localDate.format('MMM YYYY');
      case Resolution.YEAR: return localDate.format('YYYY');
      default: return localDate.format('D MMM YYYY');
    }
  }
  switch (resolution) {
    case Resolution.WEEK:
      return d3.utcFormat('%e %b %Y')(date) + (dateTo ? ` – ${ d3.utcFormat('%e %b %Y')(dateTo) }` : '');
    case Resolution.MONTH:
      return d3.utcFormat('%b %Y')(date);
    case Resolution.YEAR:
      return d3.utcFormat('%Y')(date);
    default:
      return d3.utcFormat('%e %b %Y')(date);
  }
}
