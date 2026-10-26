// Modified by Quat Capital, 2026-10-26: locale changes preserve advanced-filter API values and exact amounts. GPL-3.0.

import type { AdvancedFilterParams } from 'types/api/advancedFilter';

import { createI18n } from 'lib/i18n/config';
import { describe, expect, it, vi } from 'vitest';

import { getAdvancedFilterAgeLabel, getAdvancedFilterTypes, getTableColumns, TABLE_COLUMNS } from './constants';
import { getFilterTags } from './lib';

vi.mock('configs/app', () => ({
  'default': { chain: { currency: { name: 'Ether', symbol: 'ETH' }, tokenStandard: 'ERC', additionalTokenTypes: [] } },
}));

const instance = createI18n({
  locale: 'ru', error: false,
  resources: {
    ru: {
      common: { type: 'Тип', age: 'Давность' },
      advancedFilterUi: { coin_transfer: 'Перевод монеты', age_1m: '1 мес' },
    },
    kk: {
      common: { type: 'Түрі', age: 'Өткен уақыт' },
      advancedFilterUi: { coin_transfer: 'Монета аударымы', age_1m: '1 ай' },
    },
  },
}, { parseMissingKeyHandler: (key) => key });

describe('advanced-filter localization', () => {
  it('changes display labels while keeping column/type ids, widths and numeric behavior', () => {
    const ru = instance.getFixedT('ru');
    const kk = instance.getFixedT('kk');
    expect(getAdvancedFilterTypes(undefined, true, ru).map(type => type.id)).toEqual(getAdvancedFilterTypes(undefined, true, kk).map(type => type.id));
    expect(getAdvancedFilterTypes(undefined, false, ru)[0].name).toBe('Перевод монеты');
    expect(getAdvancedFilterTypes(undefined, false, kk)[0].name).toBe('Монета аударымы');
    const columns = getTableColumns(kk);
    expect(columns.map(({ name: _name, ...column }) => column)).toEqual(TABLE_COLUMNS.map(({ name: _name, ...column }) => column));
    expect(columns.find(column => column.id === 'type')?.name).toBe('Түрі');
    expect(getAdvancedFilterAgeLabel('1m', kk)).toBe('1 ай');
  });

  it('does not mutate machine query values when formatting tags in different languages', () => {
    const filters: AdvancedFilterParams = {
      age: '1m', age_from: '2026-10-01T00:00:00Z', age_to: '2026-10-26T00:00:00Z',
      amount_from: '900719925474099312345.25', transaction_types: [ 'coin_transfer' ], methods: [ '0xa9059cbb' ], methods_names: [ 'transfer' ],
    };
    const before = JSON.stringify(filters);
    const russian = getFilterTags(filters, undefined, instance.getFixedT('ru'), 'ru');
    const kazakh = getFilterTags(filters, undefined, instance.getFixedT('kk'), 'kk');
    expect(russian.find(tag => tag.key === 'age')?.value).toBe('1 мес');
    expect(kazakh.find(tag => tag.key === 'age')?.value).toBe('1 ай');
    expect(String(russian.find(tag => tag.key === 'amount_from')?.value).replace(/\s/g, '')).toBe('900719925474099312345,25');
    expect(russian.find(tag => tag.key === 'methods')?.value).toBe('transfer');
    expect(russian.some(tag => tag.key === 'age_from' || tag.key === 'age_to')).toBe(false);
    expect(JSON.stringify(filters)).toBe(before);
  });
});
