// Modified by Quat Capital, 2026-10-29: runtime PIN accessibility labels, caller translations preserved. GPL-3.0.
import { PinInput as ChakraPinInput, Group } from '@chakra-ui/react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { useLocale } from 'lib/i18n/provider';

import { getPinInputTranslations } from './accessibilityTranslations';

export interface PinInputProps extends ChakraPinInput.RootProps {
  rootRef?: React.Ref<HTMLDivElement>;
  count?: number;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  attached?: boolean;
}

export const PinInput = React.forwardRef<HTMLInputElement, PinInputProps>(
  function PinInput(props, ref) {
    const { t } = useTranslation();
    const { locale } = useLocale();
    const { count = 6, inputProps, rootRef, attached, placeholder = ' ', bgColor, translations, ...rest } = props;
    const localizedTranslations = React.useMemo(() => ({
      ...getPinInputTranslations(t, locale, count), ...translations,
    }), [ t, locale, count, translations ]);
    return (
      <ChakraPinInput.Root ref={ rootRef } placeholder={ placeholder } { ...rest } translations={ localizedTranslations }>
        <ChakraPinInput.HiddenInput ref={ ref } { ...inputProps }/>
        <ChakraPinInput.Control>
          <Group attached={ attached }>
            { Array.from({ length: count }).map((_, index) => (
              <ChakraPinInput.Input key={ index } index={ index } bgColor={ bgColor }/>
            )) }
          </Group>
        </ChakraPinInput.Control>
      </ChakraPinInput.Root>
    );
  },
);
