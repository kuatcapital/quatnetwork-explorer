// Modified by Quat Capital, 2026-10-29: verify localized network notifications and unchanged wallet actions. GPL-3.0.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { I18nextProvider } from 'react-i18next';

import type { Locale } from 'configs/app/i18n';
import type { Dictionary } from 'lib/i18n/config';
import { createI18n, parseDictionary } from 'lib/i18n/config';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import useAddChainClick from './useAddChainClick';

const calls = vi.hoisted(() => ({ add: vi.fn(), switchChain: vi.fn(), success: vi.fn(), error: vi.fn(), log: vi.fn(), onSuccess: vi.fn() }));
vi.mock('lib/web3/useAddChain', () => ({ 'default': () => calls.add }));
vi.mock('lib/web3/useSwitchChain', () => ({ 'default': () => calls.switchChain }));
vi.mock('lib/web3/useProvider', () => ({ 'default': () => ({ data: { wallet: 'MetaMask', provider: {} } }) }));
vi.mock('toolkit/chakra/toaster', () => ({ toaster: { success: calls.success, error: calls.error } }));
vi.mock('lib/mixpanel/index', () => ({ EventTypes: { ADD_TO_WALLET: 'add_to_wallet' }, logEvent: calls.log }));

const resources: Partial<Record<Locale, Dictionary>> = {};
for (const locale of [ 'en', 'ru', 'kk' ] as const) {
  resources[locale] = parseDictionary(readFileSync(path.join(process.cwd(), 'locales', `${ locale }.json`), 'utf8'));
}

function handler(locale: Locale) {
  const instance = createI18n({ locale, resources, error: false });
  let onClick!: ReturnType<typeof useAddChainClick>;
  const Probe = () => {
    onClick = useAddChainClick({ source: 'Top bar', onSuccess: calls.onSuccess });
    return null;
  };
  renderToStaticMarkup(<I18nextProvider i18n={ instance }><Probe/></I18nextProvider>);
  return { onClick, t: instance.t };
}

describe('network-add notifications', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('adds/switches once and preserves analytics while showing current-locale success text', async() => {
    for (const locale of [ 'ru', 'kk' ] as const) {
      vi.clearAllMocks();
      const { onClick, t } = handler(locale);
      await onClick();
      expect(calls.add).toHaveBeenCalledOnce();
      expect(calls.switchChain).toHaveBeenCalledOnce();
      expect(calls.onSuccess).toHaveBeenCalledOnce();
      expect(calls.success).toHaveBeenCalledWith({ title: t('common.success'), description: t('coreUi.network_added') });
      expect(calls.log).toHaveBeenCalledWith('add_to_wallet', { Target: 'network', Wallet: 'MetaMask', Source: 'Top bar' });
    }
  });

  it('keeps wallet errors and stops subsequent actions on failure', async() => {
    calls.add.mockRejectedValueOnce(new Error('User rejected the request.'));
    const { onClick, t } = handler('kk');
    await onClick();
    expect(calls.error).toHaveBeenCalledWith({ title: t('common.error'), description: 'User rejected the request.' });
    expect(calls.switchChain).not.toHaveBeenCalled();
    expect(calls.onSuccess).not.toHaveBeenCalled();
    expect(calls.log).not.toHaveBeenCalled();
  });

  it('localizes failures without a message', async() => {
    calls.add.mockRejectedValueOnce(null);
    const { onClick, t } = handler('ru');
    await onClick();
    expect(calls.error).toHaveBeenCalledWith({ title: t('common.error'), description: t('contracts.unexpected_error') });
  });
});
