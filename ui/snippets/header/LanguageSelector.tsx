// Quat Capital, 2026-10-25: accessible desktop/mobile RU / KZ / EN language switcher.
import { VisuallyHidden } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { Locale } from 'configs/app/i18n';
import { isLocale, SUPPORTED_LOCALES } from 'configs/app/i18n';
import { useLocale } from 'lib/i18n/provider';
import { Button } from 'toolkit/chakra/button';
import { MenuContent, MenuItem, MenuRadioItem, MenuRadioItemGroup, MenuRoot, MenuTrigger } from 'toolkit/chakra/menu';

const LANGUAGE_LABELS = { ru: 'RU', kk: 'KZ', en: 'EN' } satisfies Record<Locale, string>;

export function LanguageSelector(): React.JSX.Element {
  const { t } = useTranslation();
  const { locale, setLocale, reload, isLoading, error } = useLocale();
  const handleChange = React.useCallback(({ value }: { value: string }): void => {
    if (isLocale(value)) void setLocale(value);
  }, [ setLocale ]);
  const handleRetry = React.useCallback((): void => {
    void reload();
  }, [ reload ]);

  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <Button
          variant="header"
          size="sm"
          minW={ 12 }
          flexShrink={ 0 }
          aria-label={ t('common.language') }
          aria-busy={ isLoading }
          loading={ isLoading }
          title={ error ? t('common.language_error') : t('common.language') }
        >
          { LANGUAGE_LABELS[locale] }
        </Button>
      </MenuTrigger>
      <MenuContent minW="120px">
        <MenuRadioItemGroup value={ locale } onValueChange={ handleChange } aria-label={ t('common.language') }>
          { SUPPORTED_LOCALES.map((value) => (
            <MenuRadioItem key={ value } value={ value } lang={ value }>
              { LANGUAGE_LABELS[value] }
            </MenuRadioItem>
          )) }
        </MenuRadioItemGroup>
        { error && <MenuItem value="retry" onSelect={ handleRetry }>{ t('common.retry') }</MenuItem> }
      </MenuContent>
      { error && <VisuallyHidden role="status">{ t('common.language_error') }</VisuallyHidden> }
    </MenuRoot>
  );
}
