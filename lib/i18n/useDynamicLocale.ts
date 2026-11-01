// Modified by Quat Capital, 2026-11-01: initialize SDK locale before its first mount and keep one live subscription. GPL-3.0.
import type { i18n as I18nInstance } from 'i18next';
import React from 'react';

import { connectDynamicLocale } from './dynamicLocale';

export function useDynamicLocale(source: I18nInstance): boolean {
  const [ initialized, setInitialized ] = React.useState(false);
  // DynamicProvider is loaded with ssr:false. Gate only the first mount, never a language switch.
  React.useLayoutEffect(() => {
    const disconnect = connectDynamicLocale(source);
    setInitialized(true);
    return disconnect;
  }, [ source ]);
  return initialized;
}
