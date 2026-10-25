// Quat Capital, 2026-10-25: deterministic hydration data, runtime HTTP reload and invalid-update retention.
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createClientI18n, refreshLocale } from './client';

describe('client runtime dictionaries', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('initializes synchronously from the server snapshot without requesting dictionaries', () => {
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    const instance = createClientI18n({ locale: 'ru', resources: { ru: { common: { retry: 'Повторить' } } }, error: false });
    expect(instance.t('common.retry')).toBe('Повторить');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('loads changed JSON into the existing instance without choosing a language until the caller commits it', async() => {
    let label = 'Повторить';
    vi.stubGlobal('fetch', vi.fn(async(): Promise<Response> => new Response(JSON.stringify({ common: { retry: label } }))));
    const instance = createClientI18n({ locale: 'en', resources: { en: { common: { retry: 'Retry' } } }, error: false });
    expect((await refreshLocale(instance, 'ru')).locale).toBe('ru');
    expect(instance.language).toBe('en');
    label = 'Ещё раз';
    await refreshLocale(instance, 'ru');
    await instance.changeLanguage('ru');
    expect(instance.t('common.retry')).toBe('Ещё раз');
  });

  it('retains good browser resources when both the assets endpoint and standalone API return invalid JSON', async() => {
    vi.stubGlobal('fetch', vi.fn(async(): Promise<Response> => new Response('{broken')));
    const instance = createClientI18n({ locale: 'ru', resources: { ru: { common: { retry: 'Повторить' } } }, error: false });
    const result = await refreshLocale(instance, 'ru');
    expect(result).toEqual({ locale: 'ru', error: true });
    expect(instance.t('common.retry')).toBe('Повторить');
  });

  it('falls back to the same-origin standalone API when the assets endpoint is unavailable', async() => {
    const fetch = vi.fn(async(url: string): Promise<Response> => {
      return url.startsWith('/assets/') ? new Response('', { status: 404 }) : new Response('{"common":{"retry":"Қайталау"}}');
    });
    vi.stubGlobal('fetch', fetch);
    const instance = createClientI18n({ locale: 'kk', resources: {}, error: false });
    expect((await refreshLocale(instance, 'kk')).locale).toBe('kk');
    expect(fetch).toHaveBeenCalledWith('/api/i18n/kk', expect.objectContaining({ cache: 'no-store' }));
  });
});
