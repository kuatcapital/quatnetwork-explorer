// Modified by Quat Capital, 2026-10-26: runtime toolkit labels for RU/KK/EN. GPL-3.0.
import { Icon } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import InfoIcon from 'icons/info.svg';

import type { IconButtonProps } from '../../chakra/icon-button';
import { IconButton } from '../../chakra/icon-button';
import type { TooltipProps } from '../../chakra/tooltip';
import { Tooltip } from '../../chakra/tooltip';

export interface HintProps extends IconButtonProps {
  label: string | React.ReactNode;
  tooltipProps?: Partial<TooltipProps>;
  isLoading?: boolean;
  as?: React.ElementType;
}

export const Hint = React.memo(({ label, tooltipProps, isLoading, boxSize = 5, ...rest }: HintProps) => {
  const { t } = useTranslation();
  return (
    <Tooltip
      content={ label }
      positioning={{ placement: 'top' }}
      { ...tooltipProps }
    >
      <IconButton
        aria-label={ t('toolkit.hint') }
        boxSize={ boxSize }
        loadingSkeleton={ isLoading }
        borderRadius="sm"
        variant="icon_secondary"
        { ...rest }
      >
        <Icon boxSize={ boxSize }>
          <InfoIcon/>
        </Icon>
      </IconButton>
    </Tooltip>
  );
});
