// Quat Capital, 2026-10-25: request-isolated i18next provider and persistent language selection.
import React from 'react';
import { I18nextProvider } from 'react-i18next';

import type { Locale } from 'configs/app/i18n';
import { isLocale } from 'configs/app/i18n';

import { createClientI18n, refreshLocale } from './client';
import type { I18nSnapshot } from './config';
import { emptySnapshot, localeFromCookie, LOCALE_COOKIE, NAMESPACE } from './config';

interface LocaleContextValue {
  readonly locale: Locale;
  readonly setLocale: (locale: Locale) => Promise<void>;
  readonly reload: () => Promise<void>;
  readonly ready: boolean;
  readonly isLoading: boolean;
  readonly error: boolean;
}

const LocaleContext = React.createContext<LocaleContextValue | undefined>(undefined);
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60;
const BOOTSTRAP = {
  ru: { loading: 'Загрузка переводов…', error: 'Не удалось загрузить переводы.', retry: 'Повторить' },
  kk: { loading: 'Аудармалар жүктелуде…', error: 'Аудармаларды жүктеу мүмкін болмады.', retry: 'Қайталау' },
  en: { loading: 'Loading translations…', error: 'Translations could not be loaded.', retry: 'Retry' },
} satisfies Record<Locale, { loading: string; error: string; retry: string }>;

interface Props {
  readonly snapshot?: I18nSnapshot;
  readonly children: React.ReactNode;
}

export function LocaleProvider({ snapshot, children }: Props): React.JSX.Element {
  const [ instance ] = React.useState(() => createClientI18n(snapshot || emptySnapshot()));
  const [ locale, updateLocale ] = React.useState<Locale>(snapshot?.locale || emptySnapshot().locale);
  const [ ready, setReady ] = React.useState(() => instance.hasResourceBundle(locale, NAMESPACE));
  const [ isLoading, setIsLoading ] = React.useState(false);
  const [ error, setError ] = React.useState(Boolean(snapshot?.error));
  const generation = React.useRef(0);
  const initialSnapshot = React.useRef(snapshot);
  const initialLocale = React.useRef(locale);
  const initialLoadStarted = React.useRef(false);

  const setLocale = React.useCallback(async(nextLocale: Locale): Promise<void> => {
    if (!isLocale(nextLocale)) return;
    const currentGeneration = ++generation.current;
    setIsLoading(true);
    try {
      const result = await refreshLocale(instance, nextLocale);
      if (generation.current !== currentGeneration) return;
      await instance.changeLanguage(result.locale);
      if (generation.current !== currentGeneration) return;
      updateLocale(result.locale);
      setReady(true);
      setError(result.error);
      document.documentElement.lang = result.locale;
      const secure = location.protocol === 'https:' ? '; Secure' : '';
      document.cookie = `${ LOCALE_COOKIE }=${ nextLocale }; Path=/; Max-Age=${ COOKIE_MAX_AGE }; SameSite=Lax${ secure }`;
      // Cookie remains the authoritative preference if browser storage is disabled.
      try {
        localStorage.setItem(LOCALE_COOKIE, nextLocale);
      } catch (cause) {
        return;
      }
    } catch (cause) {
      if (generation.current === currentGeneration) setError(true);
    } finally {
      if (generation.current === currentGeneration) setIsLoading(false);
    }
  }, [ instance ]);

  const reload = React.useCallback(() => setLocale(localeFromCookie(document.cookie)), [ setLocale ]);

  React.useEffect(() => {
    document.documentElement.lang = instance.resolvedLanguage || initialLocale.current;
    // Page navigation does not overwrite a browser language choice with older page props.
    if (!initialLoadStarted.current && (!initialSnapshot.current || !instance.hasResourceBundle(initialLocale.current, NAMESPACE))) {
      initialLoadStarted.current = true;
      void reload();
    }
  }, [ instance, reload ]);

  const value = React.useMemo(() => ({ locale, setLocale, reload, ready, isLoading, error }), [ locale, setLocale, reload, ready, isLoading, error ]);
  const bootstrap = BOOTSTRAP[locale];

  return (
    <LocaleContext.Provider value={ value }>
      <I18nextProvider i18n={ instance }>
        { ready ? children : (
          <main role={ error ? 'alert' : 'status' } aria-busy={ isLoading }>
            <p>{ error ? bootstrap.error : bootstrap.loading }</p>
            { error && <button type="button" onClick={ reload } disabled={ isLoading }>{ bootstrap.retry }</button> }
          </main>
        ) }
      </I18nextProvider>
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const context = React.useContext(LocaleContext);
  if (!context) throw new Error('useLocale requires LocaleProvider');
  return context;
}
