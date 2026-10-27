// Modified by Quat Capital, 2026-10-27: metadata locale isolation, route coverage and payload regressions. GPL-3.0.
import { createInstance } from 'i18next';
import { readFileSync } from 'node:fs';
import path from 'node:path';

import type { Route } from 'nextjs-routes';

import { parseDictionary, validateDictionary } from 'lib/i18n/config';
import { describe, expect, it, vi } from 'vitest';

import generate from './generate';
import { localizeMetadataTemplate, metadataRouteKey } from './templates/localize';

vi.mock('configs/app', () => ({ 'default': {
  chain: { name: 'Quat Network', shortName: 'QUAT', currency: { symbol: 'KZTT', weiName: 'wei', gweiName: 'Gwei' } },
  app: { baseUrl: 'https://example.test', host: 'example.test' },
  features: { marketplace: { isEnabled: true, titles: { entity_name: 'dapp' } }, rollup: { isEnabled: false } },
  meta: { promoteBlockscoutInTitle: true, og: { description: 'Operator description', imageUrl: 'https://example.test/image.png' } },
} }));

const fragment = parseDictionary(readFileSync(path.join(process.cwd(), 'tools/i18n/metadata-translations.json'), 'utf8'));
const dictionaries = {
  en: validateDictionary(fragment.en), ru: validateDictionary(fragment.ru), kk: validateDictionary(fragment.kk),
};
const declaration = readFileSync(path.join(process.cwd(), 'nextjs/nextjs-routes.d.ts'), 'utf8');
const routes = Array.from(declaration.matchAll(/(?:StaticRoute|DynamicRoute)<"([^"]+)"/gu), (match) => match[1]) as Array<Route['pathname']>;

async function translator(locale: string) {
  const instance = createInstance();
  await instance.init({
    lng: locale, fallbackLng: false,
    resources: Object.fromEntries(Object.entries(dictionaries).map(([ language, dictionary ]) => [ language, { translation: dictionary } ])),
    interpolation: { escapeValue: false },
  });
  return instance.t.bind(instance);
}

describe('runtime page metadata', () => {
  it('covers every generated route and preserves original English metadata', async() => {
    const english = await translator('en');
    expect(routes.length).toBeGreaterThan(90);
    expect(new Set(routes.map(metadataRouteKey)).size).toBe(routes.length);
    for (const pathname of routes) {
      const route = { pathname, query: { hash: '0x123', height_or_hash: '123', height: '123', q: 'hello', id: 'custom', name: 'name.eth' } };
      const original = generate(route);
      expect(generate(route, null, english)).toEqual(original);
      for (const locale of [ 'ru', 'kk' ] as const) {
        const t = await translator(locale);
        expect(t(`metaSeo.title.routes.${ metadataRouteKey(pathname) }`)).not.toContain('metaSeo.');
        const translated = generate(route, null, t);
        expect(translated.title).not.toMatch(/metaSeo\.|%\w+%|\{\{/u);
        expect(translated.description).not.toMatch(/metaSeo\.|%\w+%|\{\{/u);
        expect(translated.canonical).toBe(original.canonical);
      }
    }
  });

  it('keeps independent request languages and permits dictionary updates without code imports', async() => {
    const [ ru, kk, en ] = await Promise.all([ translator('ru'), translator('kk'), translator('en') ]);
    const route = { pathname: '/tx/[hash]' as const, query: { hash: '0xabc' } };
    expect(generate(route, null, ru).title).toContain('Транзакция');
    expect(generate(route, null, kk).title).toContain('транзакциясы');
    expect(generate(route, null, en).title).toContain('transaction');
    expect(generate(route, null, ru).title).toContain('Транзакция');
    const updated = createInstance();
    await updated.init({ lng: 'ru', resources: { ru: { translation: { metaSeo: { title: { routes: { tx_by_hash: 'Новый текст {{hash}}' } } } } } } });
    expect(generate(route, null, updated.t.bind(updated)).title).toBe('Новый текст 0xabc | Blockscout');
  });

  it('does not reinterpret user placeholders and preserves array query values', async() => {
    const t = await translator('ru');
    const query = { q: [ '%network_name%', '{{hash}}', '<tag>' ], lng: 'en', ns: 'untrusted' };
    const result = generate({ pathname: '/search-results', query }, null, t);
    expect(result.title).toContain('%network_name%, {{hash}}, <tag>');
    expect(result.title).toContain('Результат поиска');
    expect(query.q).toEqual([ '%network_name%', '{{hash}}', '<tag>' ]);
    expect(localizeMetadataTemplate('Fallback %value%', 'missing.key', t, { value: 'literal {{value}}' })).toBe('Fallback literal {{value}}');
  });

  it('localizes enriched titles while retaining API text, schema fields and canonical URLs', async() => {
    const t = await translator('kk');
    const apiData = { domain_name: 'custom.example' };
    expect(generate({ pathname: '/address/[hash]', query: { hash: '0xabc' } }, apiData, t).title).toContain('custom.example');
    const token = {
      name: 'Original name', symbol: 'RAW', symbol_or_name: 'RAW', address_hash: '0xabc', description: 'Original API description',
      type: 'ERC-20', decimals: '2', holders_count: null, exchange_rate: null, total_supply: null,
      icon_url: null, circulating_market_cap: null, reputation: null,
    };
    const route = { pathname: '/token/[hash]' as const, query: { hash: '0xabc' } };
    expect(generate(route, token, t).jsonLd).toEqual(generate(route, token).jsonLd);
    const chart = { id: 'custom', title: 'Custom API title', description: 'Custom API description', resolutions: [] };
    expect(generate({ pathname: '/stats/[id]', query: { id: 'custom' } }, chart, t).description).toBe('Custom API description');
    expect(generate({ pathname: '/txs' }, null, t).canonical).toBe('https://example.test/txs');

    const cases = [
      { pathname: '/token/[hash]', apiData: token, payload: 'RAW' },
      { pathname: '/token/[hash]/instance/[id]', apiData: { symbol_or_name: 'RAW' }, payload: 'RAW' },
      { pathname: '/apps/[id]', apiData: { app_name: 'Custom {{network_name}} app' }, payload: 'Custom {{network_name}} app' },
      { pathname: '/address/[hash]', apiData, payload: 'custom.example' },
      { pathname: '/stats/[id]', apiData: chart, payload: 'Custom API title' },
    ] as const;
    const en = await translator('en');
    for (const item of cases) {
      const enrichedRoute = { pathname: item.pathname, query: { hash: '0xabc', id: 'custom' } };
      expect(generate(enrichedRoute, item.apiData, en)).toEqual(generate(enrichedRoute, item.apiData));
      for (const locale of [ 'ru', 'kk' ]) {
        const translated = generate(enrichedRoute, item.apiData, await translator(locale));
        expect(translated.title).toContain(item.payload);
        expect(translated.title).not.toContain('metaSeo.');
      }
    }
  });
});
