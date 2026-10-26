// Modified by Quat Capital, 2026-10-26: date language/zone isolation regressions. GPL-3.0.
import { describe, expect, it } from 'vitest';

import dayjs from './dayjs';
import { timestampDate } from './timestamp';

describe('timestampDate', () => {
  const timestamp = '2026-10-25T23:40:00-05:00';

  it('preserves the same instant in UTC and local display for all UI languages', () => {
    for (const locale of [ 'ru', 'kk', 'en' ] as const) {
      const utc = timestampDate(timestamp, locale);
      const local = timestampDate(timestamp, locale, true);
      expect(utc.valueOf()).toBe(Date.parse(timestamp));
      expect(local.valueOf()).toBe(utc.valueOf());
      expect(utc.utcOffset()).toBe(0);
      expect(local.utcOffset()).toBe(-new Date(timestamp).getTimezoneOffset());
      expect(utc.format('YYYY-MM-DD HH:mm')).toBe('2026-10-26 04:40');
      expect(utc.locale()).toBe(locale);
      expect(local.locale()).toBe(locale);
    }
  });

  it('does not change the global language or the following timestamp', () => {
    const initialLocale = dayjs.locale();
    timestampDate(timestamp, 'kk', true).format('lll');
    expect(dayjs.locale()).toBe(initialLocale);
    expect(timestampDate(0, 'en').format('YYYY-MM-DD HH:mm')).toBe('1970-01-01 00:00');
  });
});
