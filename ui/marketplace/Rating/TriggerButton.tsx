// Modified by Quat Capital, 2026-10-26: marketplace, rewards or token info localization. GPL-3.0.
import { chakra, Text } from '@chakra-ui/react';
import type { TFunction } from 'i18next';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { getFeaturePayload } from 'configs/app/features/types';

import config from 'configs/app';
import { formatNumber } from 'lib/format/localeNumbers';
import useIsMobile from 'lib/hooks/useIsMobile';
import usePreventFocusAfterModalClosing from 'lib/hooks/usePreventFocusAfterModalClosing';
import { useLocale } from 'lib/i18n/provider';
import type { ButtonProps } from 'toolkit/chakra/button';
import { Button } from 'toolkit/chakra/button';
import { PopoverTrigger } from 'toolkit/chakra/popover';
import { Tooltip } from 'toolkit/chakra/tooltip';
import IconSvg from 'ui/shared/IconSvg';

interface Props extends ButtonProps {
  rating?: number;
  count?: number;
  fullView?: boolean;
  canRate: boolean;
};

const getTooltipText = (tEco: TFunction, canRate: boolean) => {
  if (!canRate) {
    const entity = getFeaturePayload(config.features.marketplace)?.titles.entity_name || 'Dapp';
    return /^(?:dapp|app)$/i.test(entity) ?
      tEco('marketplaceUI.rating_login_default') : tEco('marketplaceUI.rating_login_custom', { entity });
  }
  return <>{ tEco('marketplaceUI.rating_verified') }<br/>{ tEco('marketplaceUI.click_rate') }</>;
};

const TriggerButton = (
  { rating, count, fullView, canRate, onClick, ...rest }: Props,
  ref: React.ForwardedRef<HTMLButtonElement>,
) => {
  const { t: tEco } = useTranslation();
  const { locale } = useLocale();
  const onFocusCapture = usePreventFocusAfterModalClosing();
  const isMobile = useIsMobile();

  return (
    <Tooltip
      content={ getTooltipText(tEco, canRate) }
      closeOnClick={ Boolean(canRate) || isMobile }
      disableOnMobile={ canRate }
    >
      <div>
        <PopoverTrigger>
          <Button
            ref={ ref }
            size="xs"
            variant="link"
            p={ 0 }
            fontSize={ fullView ? 'md' : 'sm' }
            fontWeight={ fullView ? '400' : '500' }
            lineHeight="21px"
            ml={ fullView ? 3 : 0 }
            onFocusCapture={ onFocusCapture }
            cursor={ canRate ? 'pointer' : 'default' }
            { ...rest }
          >
            { !fullView && (
              <IconSvg
                name={ rating ? 'star_filled' : 'star_outline' }
                color={ rating ? 'yellow.400' : 'icon.secondary' }
                boxSize={ 5 }
                mr={ 1 }
              />
            ) }
            { (rating && !fullView) ? (
              <chakra.span color="text.primary" transition="inherit" display="inline-flex">
                { formatNumber(rating, locale) }
                <Text color="text.secondary" ml={ 1 }>({ count === undefined ? '' : formatNumber(count, locale) })</Text>
              </chakra.span>
            ) : (
              tEco('marketplaceUI.rate_it')
            ) }
          </Button>
        </PopoverTrigger>
      </div>
    </Tooltip>
  );
};

export default React.forwardRef(TriggerButton);
