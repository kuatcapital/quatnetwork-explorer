// Modified by Quat Capital, 2026-10-25: localized relative-time regression tests. GPL-3.0.
import { describe, expect, it } from 'vitest';

import dayjs from './dayjs';

describe('localized date instances', () => {
  const anchor = dayjs('2026-10-25T00:00:00Z');

  it('provides Russian and Kazakh week forms for the custom relative-time thresholds', () => {
    expect(anchor.subtract(14, 'day').locale('ru').from(anchor)).toBe('2 недели назад');
    expect(anchor.add(14, 'day').locale('ru').from(anchor)).toBe('через 2 недели');
    expect(anchor.subtract(14, 'day').locale('kk').from(anchor)).toContain('2 апта');
  });

  it('keeps the global language unchanged when formatting separate requests', () => {
    const globalLocale = dayjs.locale();
    const russian = anchor.locale('ru').format('MMM');
    const kazakh = anchor.locale('kk').format('MMM');
    const english = anchor.locale('en').format('MMM');
    expect(russian).not.toBe(english);
    expect(kazakh).not.toBe(english);
    expect(dayjs.locale()).toBe(globalLocale);
  });
});
