// Modified by Quat Capital, 2026-10-26: runtime toolkit labels for RU/KK/EN. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { CloseButtonProps } from '../../chakra/close-button';
import { CloseButton } from '../../chakra/close-button';

export interface ClearButtonProps extends CloseButtonProps {
  visible?: boolean;
}

export const ClearButton = ({ disabled, visible = true, ...rest }: ClearButtonProps) => {
  const { t } = useTranslation();
  return (
    <CloseButton
      disabled={ disabled || !visible }
      aria-label={ t('toolkit.clear') }
      title={ t('toolkit.clear') }
      opacity={ visible ? 1 : 0 }
      visibility={ visible ? 'visible' : 'hidden' }
      color={{ _light: 'gray.300', _dark: 'whiteAlpha.300' }}
      { ...rest }
    />
  );
};
