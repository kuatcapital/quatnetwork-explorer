// Modified by Quat Capital, 2026-10-25: precision and locale regression tests. GPL-3.0.
import BigNumber from 'bignumber.js';

import { describe, expect, it } from 'vitest';

import { formatBigNumber, formatNumber, getNumberSeparators } from './localeNumbers';

describe('locale number formatting', () => {
  it('preserves integer and decimal digits above Number.MAX_SAFE_INTEGER', () => {
    const raw = '9007199254740993123.456789';
    for (const locale of [ 'ru', 'kk', 'en' ] as const) {
      expect(formatBigNumber(new BigNumber(raw), locale).replace(/\D/g, '')).toBe(raw.replace('.', ''));
    }
  });

  it('does not share the active language between calls', () => {
    expect(formatNumber(1234.5, 'en')).toBe('1,234.5');
    expect(formatNumber(1234.5, 'ru')).toBe('1\u00a0234,5');
    expect(formatNumber(1234.5, 'en')).toBe('1,234.5');
    expect(getNumberSeparators('kk').decimal).toBe(',');
  });

  it('rounds the display without modifying the input amount', () => {
    const amount = new BigNumber('12.34567');
    expect(formatBigNumber(amount, 'ru', 2)).toBe('12,35');
    expect(amount.toFixed()).toBe('12.34567');
  });

  it('keeps BigInt values exact', () => {
    expect(formatNumber(BigInt('9007199254740993'), 'en')).toBe('9,007,199,254,740,993');
  });
});
