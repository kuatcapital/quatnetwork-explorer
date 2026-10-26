// Modified by Quat Capital, 2026-10-26: gas formatting and zero-fee regressions across UI languages. GPL-3.0.
import type { GasPriceInfo } from 'types/api/stats';

import { describe, expect, it, vi } from 'vitest';

import formatGasValue from './formatGasValue';

vi.mock('lib/units', () => ({ currencyUnits: { gwei: 'Gwei', wei: 'wei', ether: 'ETH' } }));

const PRICE: GasPriceInfo = { price: 12.5, fiat_price: '1.25', time: null, base_fee: null, priority_fee: null };

describe('localized gas values', () => {
  it('selects decimal separators without mutating the source values', () => {
    expect(formatGasValue(PRICE, 'gwei', 'ru')).toBe('12,5 Gwei');
    expect(formatGasValue(PRICE, 'gwei', 'kk')).toBe('12,5 Gwei');
    expect(formatGasValue(PRICE, 'gwei', 'en')).toBe('12.5 Gwei');
    expect(formatGasValue(PRICE, 'usd', 'ru')).toBe('$1,25');
    expect(PRICE.price).toBe(12.5);
    expect(PRICE.fiat_price).toBe('1.25');
  });

  it('displays a valid zero gas price as below precision instead of unavailable', () => {
    expect(formatGasValue({ ...PRICE, price: 0 }, 'gwei', 'ru', 'н/д')).toBe('< 0,1 Gwei');
    expect(formatGasValue({ ...PRICE, fiat_price: '0' }, 'usd', 'kk', 'жоқ')).toBe('< $0,01');
  });

  it('keeps missing data distinct from valid low prices', () => {
    expect(formatGasValue({ ...PRICE, price: null }, 'gwei', 'ru', 'н/д')).toBe('н/д Gwei');
    expect(formatGasValue({ ...PRICE, fiat_price: null }, 'usd', 'kk', 'жоқ')).toBe('$жоқ');
    expect(formatGasValue(PRICE, 'gwei')).toBe('12.5 Gwei');
  });
});
