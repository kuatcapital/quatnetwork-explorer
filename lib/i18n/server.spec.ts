// Quat Capital, 2026-10-25: runtime edits, invalid update fallback and independent server snapshots.
import type { Locale } from 'configs/app/i18n';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const files = vi.hoisted(() => new Map<string, string>());
vi.mock('node:fs/promises', () => ({
  readFile: vi.fn(async(file: string): Promise<string> => {
    const locale = /([^/\\]+)\.json$/.exec(file)?.[1];
    const content = locale && files.get(locale);
    if (!content) throw new Error('Not found');
    return content;
  }),
}));

describe('server runtime dictionaries', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('QUAT_I18N_SERVER_BASE_URL', '');
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    files.set('ru', '{"common":{"retry":"Повторить"}}');
    files.set('kk', '{"common":{"retry":"Қайталау"}}');
    files.set('en', '{"common":{"retry":"Retry"}}');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    files.clear();
  });

  it('reads changed JSON without a module reload or a build', async() => {
    const { readRuntimeDictionary } = await import('./server');
    expect(await readRuntimeDictionary('ru')).toEqual({ common: { retry: 'Повторить' } });
    files.set('ru', '{"common":{"retry":"Ещё раз"}}');
    expect(await readRuntimeDictionary('ru')).toEqual({ common: { retry: 'Ещё раз' } });
  });

  it('retains the last valid per-language dictionary after a malformed update', async() => {
    const { readRuntimeDictionary, loadServerSnapshot } = await import('./server');
    await readRuntimeDictionary('kk');
    files.set('kk', '{bad json');
    const snapshot = await loadServerSnapshot('quat_locale=kk');
    expect(snapshot.locale).toBe('kk');
    expect(snapshot.resources.kk).toEqual({ common: { retry: 'Қайталау' } });
    expect(snapshot.error).toBe(true);
  });

  it('retains the last valid dictionary when a hot update renames interpolation parameters', async() => {
    const { readRuntimeDictionary, loadServerSnapshot } = await import('./server');
    files.set('kk', '{"common":{"retry":"{{count}} рет қайталау"}}');
    await readRuntimeDictionary('kk');
    files.set('kk', '{"common":{"retry":"{{n}} рет қайталау"}}');
    const snapshot = await loadServerSnapshot('quat_locale=kk');
    expect(snapshot.locale).toBe('kk');
    expect(snapshot.resources.kk).toEqual({ common: { retry: '{{count}} рет қайталау' } });
    expect(snapshot.error).toBe(true);
  });

  it('does not mix selected languages between simultaneous requests', async() => {
    const { loadServerSnapshot } = await import('./server');
    const [ russian, english ] = await Promise.all([ loadServerSnapshot('quat_locale=ru'), loadServerSnapshot('quat_locale=en') ]);
    expect(russian.locale).toBe('ru');
    expect(english.locale).toBe('en');
  });

  it('rejects unsupported locale paths before reading a file', async() => {
    const { readRuntimeDictionary } = await import('./server');
    await expect(readRuntimeDictionary('../../secret' as Locale)).rejects.toThrow('Unsupported translation locale');
  });

  it('falls back to Russian when the requested dictionary is not available', async() => {
    const { loadServerSnapshot } = await import('./server');
    files.delete('kk');
    const snapshot = await loadServerSnapshot('quat_locale=kk');
    expect(snapshot.locale).toBe('ru');
    expect(snapshot.error).toBe(true);
  });

  it('returns a serializable controlled error snapshot when all resources are unavailable', async() => {
    const { loadServerSnapshot } = await import('./server');
    files.clear();
    expect(await loadServerSnapshot('quat_locale=en')).toEqual({ locale: 'en', resources: {}, error: true });
  });
});
