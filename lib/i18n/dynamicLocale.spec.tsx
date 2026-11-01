// @vitest-environment jsdom
// Modified by Quat Capital, 2026-11-01: real Dynamic SDK locale, React binding and reload regressions. GPL-3.0.
import { Locale as DynamicLocale } from '@dynamic-labs/locale';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';

import type { Locale } from 'configs/app/i18n';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createClientI18n, refreshLocale } from './client';
import type { Dictionary } from './config';
import { createI18n, NAMESPACE, parseDictionary } from './config';
import { connectDynamicLocale, synchronizeDynamicLocale } from './dynamicLocale';
import { useDynamicLocale } from './useDynamicLocale';

const resources = Object.fromEntries([ 'en', 'ru', 'kk' ].map(locale => [
  locale, parseDictionary(readFileSync(path.join(process.cwd(), 'locales', locale + '.json'), 'utf8')),
])) as Record<Locale, Dictionary>;
const KEY = 'dyn_waas.backup.done';
const sdk = DynamicLocale.getInstance();
const require = createRequire(import.meta.url);
const sdkRequire = createRequire(require.resolve('@dynamic-labs/sdk-react-core'));

// Resolve the SDK's own react-i18next copy, rather than accidentally testing the app binding.
interface SdkBinding {
  I18nextProvider: React.ComponentType<{ i18n: typeof sdk; children: React.ReactNode }>;
  useTranslation: () => { t: (key: string) => string };
}
const sdkBinding = sdkRequire('react-i18next') as SdkBinding;
const SdkI18nextProvider = sdkBinding.I18nextProvider;

afterEach(() => vi.unstubAllGlobals());

describe('Dynamic runtime locale bridge', () => {
  it('uses the real SDK instance for RU/KK, interpolation and Russian plural forms', async() => {
    const source = createI18n({ locale: 'ru', resources, error: false });
    const originalInstance = DynamicLocale.getInstance();
    for (const locale of [ 'ru', 'kk', 'ru' ] as const) {
      await source.changeLanguage(locale);
      expect(synchronizeDynamicLocale(source)).toBe(true);
      expect(sdk.t(KEY)).toBe(locale === 'ru' ? 'Готово' : 'Дайын');
      expect(sdk.t('dyn_waas.backup.downloading', { current: 2, total: 5 })).toContain('2/5');
      expect(sdk.t('dyn_no_access.chainalysis.social_media_link_url')).toBe('https://docs.dynamic.xyz/docs');
      expect(DynamicLocale.getInstance()).toBe(originalInstance);
    }
    for (const count of [ 1, 2, 5 ]) {
      const text = sdk.t('dyn_waas.backup.success_description', { count });
      expect(text).toContain(String(count));
      expect(text).not.toContain('{{');
      expect(text).toContain(count === 1 ? 'кошелька' : 'кошельков');
    }
  });

  it('updates a JSON resource in the same language and disconnects its listener', async() => {
    const source = createI18n({ locale: 'kk', resources, error: false });
    const disconnect = connectDynamicLocale(source);
    try {
      source.addResourceBundle('kk', NAMESPACE, { dynamicUi: { dyn_waas: { backup: { done: 'Жаңартылған мәтін' } } } }, true, true);
      await source.changeLanguage('kk');
      expect(sdk.t(KEY)).toBe('Жаңартылған мәтін');
    } finally {
      disconnect();
    }
    await source.changeLanguage('ru');
    expect(sdk.language).toBe('kk');
    expect(sdk.t(KEY)).toBe('Жаңартылған мәтін');
  });

  it('rejects partial or incompatible dictionaries before changing working SDK state', async() => {
    const source = createI18n({ locale: 'ru', resources, error: false });
    expect(synchronizeDynamicLocale(source)).toBe(true);
    const original = structuredClone(sdk.getResourceBundle('ru', NAMESPACE));
    source.removeResourceBundle('kk', NAMESPACE);
    source.addResourceBundle('kk', NAMESPACE, { dynamicUi: { dyn_waas: { backup: { done: 'Неполный' } } } });
    await source.changeLanguage('kk');
    expect(synchronizeDynamicLocale(source)).toBe(false);
    expect(sdk.language).toBe('ru');
    expect(sdk.getResourceBundle('ru', NAMESPACE)).toEqual(original);
    source.addResourceBundle('kk', NAMESPACE, resources.kk, true, true);
    source.addResourceBundle('kk', NAMESPACE, { dynamicUi: { dyn_waas: { backup: { downloading: '{{removed}}' } } } }, true, true);
    expect(synchronizeDynamicLocale(source)).toBe(false);
    expect(sdk.language).toBe('ru');
  });

  it('keeps cached translations when runtime HTTP reload fails', async() => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    const source = createClientI18n({ locale: 'kk', resources, error: false });
    const disconnect = connectDynamicLocale(source);
    try {
      const result = await refreshLocale(source, 'kk');
      expect(result.error).toBe(true);
      await source.changeLanguage(result.locale);
      expect(sdk.language).toBe('kk');
      expect(sdk.t(KEY)).toBe('Дайын');
    } finally {
      disconnect();
    }
  });

  it('renders the SDK binding in RU on first mount and preserves mounted state across RU/KK and reload', async() => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
    const source = createI18n({ locale: 'ru', resources, error: false });
    const container = document.createElement('div');
    document.body.append(container);
    const root = createRoot(container);
    let mounts = 0;
    const firstLabels: Array<string> = [];
    function Probe() {
      const { t } = sdkBinding.useTranslation();
      const [ clicks, setClicks ] = React.useState(0);
      const handleClick = React.useCallback(() => setClicks(count => count + 1), []);
      React.useEffect(() => {
        mounts++;
      }, []);
      firstLabels.push(t(KEY));
      return <button onClick={ handleClick }>{ t(KEY) }:{ clicks }</button>;
    }
    function Harness() {
      const initialized = useDynamicLocale(source);
      return initialized ? <SdkI18nextProvider i18n={ sdk }><Probe/></SdkI18nextProvider> : null;
    }
    try {
      await act(async() => root.render(<Harness/>));
      const button = container.querySelector('button');
      expect(firstLabels[0]).toBe('Готово');
      await act(async() => button?.click());
      for (const locale of [ 'kk', 'ru', 'kk' ] as const) {
        await act(async() => {
          await source.changeLanguage(locale);
        });
        expect(container.querySelector('button')).toBe(button);
        expect(button?.textContent).toBe((locale === 'ru' ? 'Готово' : 'Дайын') + ':1');
      }
      await act(async() => {
        source.addResourceBundle('kk', NAMESPACE, { dynamicUi: { dyn_waas: { backup: { done: 'Жаңартылған мәтін' } } } }, true, true);
        await source.changeLanguage('kk');
      });
      expect(button?.textContent).toBe('Жаңартылған мәтін:1');
      expect(mounts).toBe(1);
    } finally {
      await act(async() => root.unmount());
      container.remove();
    }
  });
});
