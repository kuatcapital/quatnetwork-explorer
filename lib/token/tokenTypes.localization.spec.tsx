// Modified by Quat Capital, 2026-10-29: native display, protocol ids and real portfolio-link locale regressions. GPL-3.0.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { I18nextProvider } from 'react-i18next';

import type { AddressTokensErc20Item } from 'ui/address/tokens/types';

import type { Locale } from 'configs/app/i18n';
import { getSearchPlaceholder } from 'lib/clusters/actionBarUtils';
import type { Dictionary } from 'lib/i18n/config';
import { createI18n, parseDictionary, validateDictionary } from 'lib/i18n/config';
import MultichainAddressTokensListItem from 'ui/multichain/address/portfolio/MultichainAddressTokensListItem';
import MultichainAddressTokensTableItem from 'ui/multichain/address/portfolio/MultichainAddressTokensTableItem';
import { describe, expect, it, vi } from 'vitest';

import { getTokenTypeName, getTokenTypes, isFungibleTokenType } from './tokenTypes';

vi.mock('configs/app', () => ({ 'default': { chain: {
  tokenStandard: 'ERC', additionalTokenTypes: [ { id: 'CUSTOM_TYPE', name: 'Operator {{name}}' } ],
  currency: { weiName: 'wei', gweiName: 'Gwei', symbol: 'TEST' },
} } }));
vi.mock('configs/multichain', () => ({ 'default': () => undefined }));

/* eslint-disable @typescript-eslint/naming-convention -- preserve component export names in isolated test doubles */
vi.mock('@chakra-ui/react', () => ({
  Grid: ({ children }: React.PropsWithChildren) => <div>{ children }</div>,
  VStack: ({ children }: React.PropsWithChildren) => <div>{ children }</div>,
}));
vi.mock('toolkit/chakra/table', () => ({
  TableRow: ({ children }: React.PropsWithChildren) => <div>{ children }</div>,
  TableCell: ({ children }: React.PropsWithChildren) => <div>{ children }</div>,
}));
vi.mock('toolkit/chakra/tag', () => ({ Tag: ({ children }: React.PropsWithChildren) => <span>{ children }</span> }));
vi.mock('toolkit/chakra/skeleton', () => ({ Skeleton: ({ children }: React.PropsWithChildren) => <div>{ children }</div> }));
/* eslint-enable @typescript-eslint/naming-convention */
vi.mock('ui/shared/ListItemMobile/ListItemMobile', () => ({ 'default': ({ children }: React.PropsWithChildren) => <div>{ children }</div> }));
vi.mock('ui/shared/celo/NativeTokenTag', () => ({ 'default': () => <span data-native-tag="true"/> }));
vi.mock('ui/shared/entities/token/TokenEntity', () => ({ 'default': ({ token, noLink }: { token: { type: string }; noLink?: boolean }) => (
  <span data-token-type={ token.type } data-no-link={ String(Boolean(noLink)) }/>
) }));
vi.mock('ui/shared/entities/address/AddressEntity', () => ({ 'default': () => <span data-address="true"/> }));
vi.mock('ui/shared/value/calculateUsdValue', () => ({ 'default': () => ({ valueBn: '0', usdBn: '0' }) }));
vi.mock('ui/shared/value/SimpleValue', () => ({ 'default': () => null }));

const fragment = parseDictionary(readFileSync(path.join(process.cwd(), 'tools/i18n/core-labels8-translations.json'), 'utf8'));
const resources = Object.fromEntries([ 'en', 'ru', 'kk' ].map(locale => [ locale, {
  ...parseDictionary(readFileSync(path.join(process.cwd(), `locales/${ locale }.json`), 'utf8')),
  ...validateDictionary(fragment[locale]),
} ])) as Record<Locale, Dictionary>;

function tokenData(type: string): AddressTokensErc20Item {
  return { value: '1', token: {
    address_hash: '0x123', type, symbol: 'TEST', name: 'Original token', decimals: '18', holders_count: null,
    exchange_rate: null, total_supply: null, icon_url: null, circulating_market_cap: null, reputation: null,
  } };
}

describe('native token and cluster display localization', () => {
  it('localizes native display names without changing protocol types or operator metadata', () => {
    const instance = createI18n({ locale: 'ru', resources, error: false });
    const catalogue = JSON.stringify(getTokenTypes(false));
    expect(getTokenTypeName('NATIVE')).toBe('Native token');
    expect(getTokenTypeName('NATIVE', undefined, instance.getFixedT('en'))).toBe('Native token');
    for (const locale of [ 'ru', 'kk' ]) {
      const t = instance.getFixedT(locale);
      expect(getTokenTypeName('NATIVE', undefined, t)).not.toMatch(/Native token|tokenUi\./u);
      for (const type of [ 'ERC-20', 'ERC-721', 'ERC-1155', 'ERC-404' ]) expect(getTokenTypeName(type, undefined, t)).toBe(type);
      expect(getTokenTypeName('CUSTOM_TYPE', undefined, t)).toBe('Operator {{name}}');
      for (const type of [ 'unknown_{{type}}', 'constructor', '__proto__' ]) expect(getTokenTypeName(type, undefined, t)).toBe(type);
    }
    expect(JSON.stringify(getTokenTypes(false))).toBe(catalogue);
    expect(isFungibleTokenType('NATIVE')).toBe(true);
    expect(isFungibleTokenType('Нативный токен')).toBe(false);
  });

  it('keeps native-token links disabled in both actual portfolio views across locales', () => {
    for (const locale of [ 'en', 'ru', 'kk' ] as const) {
      const instance = createI18n({ locale, resources, error: false });
      for (const Component of [ MultichainAddressTokensListItem, MultichainAddressTokensTableItem ]) {
        const source = tokenData('NATIVE');
        const native = renderToStaticMarkup(<I18nextProvider i18n={ instance }><Component data={ source } isLoading={ false }/></I18nextProvider>);
        expect(native).toContain('data-token-type="NATIVE" data-no-link="true"');
        expect(native).not.toContain('data-address="true"');
        expect(source.token.type).toBe('NATIVE');
        const regular = renderToStaticMarkup(
          <I18nextProvider i18n={ instance }><Component data={ tokenData('ERC-20') } isLoading={ false }/></I18nextProvider>,
        );
        expect(regular).toContain('data-token-type="ERC-20" data-no-link="false"');
        expect(regular).toContain('data-address="true"');
      }
    }
  });

  it('changes the cluster-search prompt while keeping legacy callers compatible', () => {
    const instance = createI18n({ locale: 'ru', resources, error: false });
    const english = 'Search clusters by name or EVM address';
    expect(getSearchPlaceholder()).toBe(english);
    expect(getSearchPlaceholder(instance.getFixedT('en'))).toBe(english);
    expect(getSearchPlaceholder(instance.getFixedT('ru'))).toBe('Поиск кластеров по имени или EVM-адресу');
    expect(getSearchPlaceholder(instance.getFixedT('kk'))).toBe('Кластерлерді атауы немесе EVM мекенжайы бойынша іздеу');
  });
});
