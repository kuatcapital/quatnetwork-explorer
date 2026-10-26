// Modified by Quat Capital, 2026-10-26: selected-locale toolkit defaults. GPL-3.0.
import { chakra } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { ColorMode } from '../../../../chakra/color-mode';
import { Image } from '../../../../chakra/image';
import { Skeleton } from '../../../../chakra/skeleton';

interface Props {
  src: string | undefined;
  onLoad?: () => void;
  onError?: () => void;
  isInvalid: boolean;
  className?: string;
  fallback: React.ReactElement;
  colorMode?: ColorMode;
}

export const FormFieldImagePreview = chakra(React.memo(({
  src,
  isInvalid,
  onError,
  onLoad,
  className,
  fallback: fallbackProp,
  colorMode,
}: Props) => {
  const { t } = useTranslation();
  const skeleton = <Skeleton loading className={ [ className, colorMode === 'dark' ? 'dark' : undefined ].filter(Boolean).join(' ') } w="100%" h="100%"/>;

  const fallback = (() => {
    if (src && !isInvalid) {
      return skeleton;
    }
    return fallbackProp;
  })();

  return (
    <Image
      key={ src }
      className={ className }
      src={ src }
      alt={ t('toolkit.image_preview') }
      w="auto"
      h="100%"
      fallback={ fallback }
      onError={ onError }
      onLoad={ onLoad }
    />
  );
}));
