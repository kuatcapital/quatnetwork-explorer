// Modified by Quat Capital, 2026-10-29: selected-locale progress numbers and loading accessibility text. GPL-3.0.
import { Progress as ChakraProgress } from '@chakra-ui/react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { NUMBER_LOCALES } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';

import { getProgressTranslations } from './accessibilityTranslations';

interface ProgressProps extends ChakraProgress.RootProps {
  trackProps?: ChakraProgress.TrackProps;
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  function Progress(props, ref) {
    const { t } = useTranslation();
    const { locale } = useLocale();
    const { trackProps, color, translations, ...rest } = props;
    const localizedTranslations = React.useMemo(() => ({
      ...getProgressTranslations(t), ...translations,
    }), [ t, translations ]);
    return (
      <ChakraProgress.Root locale={ NUMBER_LOCALES[locale] } { ...rest } translations={ localizedTranslations } ref={ ref }>
        <ChakraProgress.Track { ...trackProps }>
          <ChakraProgress.Range bg={ color }/>
        </ChakraProgress.Track>
      </ChakraProgress.Root>
    );
  },
);
