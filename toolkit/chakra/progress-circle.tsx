// Modified by Quat Capital, 2026-10-29: selected-locale circular progress accessibility defaults. GPL-3.0.
import type { SystemStyleObject } from '@chakra-ui/react';
import {
  AbsoluteCenter,
  ProgressCircle as ChakraProgressCircle,
} from '@chakra-ui/react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { NUMBER_LOCALES } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';

import { getProgressTranslations } from './accessibilityTranslations';

export interface ProgressCircleRingProps extends ChakraProgressCircle.CircleProps {
  trackColor?: SystemStyleObject['stroke'];
  cap?: SystemStyleObject['strokeLinecap'];
}

export const ProgressCircleRing = React.forwardRef<
  SVGSVGElement,
  ProgressCircleRingProps
>(function ProgressCircleRing(props, ref) {
  const { trackColor, cap, color, ...rest } = props;
  return (
    <ChakraProgressCircle.Circle { ...rest } ref={ ref }>
      <ChakraProgressCircle.Track stroke={ trackColor }/>
      <ChakraProgressCircle.Range stroke={ color } strokeLinecap={ cap }/>
    </ChakraProgressCircle.Circle>
  );
});

export const ProgressCircleValueText = React.forwardRef<
  HTMLDivElement,
  ChakraProgressCircle.ValueTextProps
>(function ProgressCircleValueText(props, ref) {
  return (
    <AbsoluteCenter>
      <ChakraProgressCircle.ValueText { ...props } ref={ ref }/>
    </AbsoluteCenter>
  );
});

export interface ProgressCircleRootProps extends ChakraProgressCircle.RootProps {}
export const ProgressCircleRoot = React.forwardRef<HTMLDivElement, ProgressCircleRootProps>(
  function ProgressCircleRoot(props, ref) {
    const { t } = useTranslation();
    const { locale } = useLocale();
    const { translations, ...rest } = props;
    const localizedTranslations = React.useMemo(() => ({
      ...getProgressTranslations(t), ...translations,
    }), [ t, translations ]);
    return <ChakraProgressCircle.Root locale={ NUMBER_LOCALES[locale] } { ...rest } translations={ localizedTranslations } ref={ ref }/>;
  },
);
