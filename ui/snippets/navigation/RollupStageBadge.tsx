// Modified by Quat Capital, 2026-10-27: runtime stage tooltip and visible RU/KK badge labels. GPL-3.0.
import type { BoxProps } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import config from 'configs/app';
import { useLocale } from 'lib/i18n/provider';
import { Image } from 'toolkit/chakra/image';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';

interface Props extends BoxProps {
  chainConfig?: typeof config;
  isLoading?: boolean;
}

const RollupStageBadge = ({ chainConfig = config, isLoading, ...props }: Props) => {
  const { t } = useTranslation();
  const { locale } = useLocale();

  const feature = chainConfig.features.rollup;

  if (!feature.isEnabled || chainConfig.chain.isTestnet) {
    return null;
  }

  if (isLoading) {
    return <Skeleton w="42px" h="14px" { ...props } loading/>;
  }

  switch (feature.stageIndex) {
    case '1':
    case '2': {
      const tooltipContent = (
        <Trans
          t={ t }
          i18nKey="shellUi.rollup_stage_hint"
          components={{ link: <Link href="https://l2beat.com?utm_source=blockscout&utm_medium=explorer" external>l2beat.com</Link> }}
        />
      );

      return (
        <Tooltip content={ tooltipContent } interactive>
          <Box
            as="span"
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            h="14px"
            minW="42px"
            aria-label={ t('shellUi.stage_label', { stage: feature.stageIndex }) }
            { ...props }
          >
            { locale === 'en' ? (
              <Image src={ feature.stageIndex === '1' ? '/static/labels/stage-1.svg' : '/static/labels/stage-2.svg' } h="14px" w="42px"/>
            ) : (
              <Box
                as="span"
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                h="14px"
                minW="42px"
                px="2px"
                borderWidth="0.4px"
                borderColor={ feature.stageIndex === '1' ? '#D69E2E' : '#48BB78' }
                color={ feature.stageIndex === '1' ? '#D69E2E' : '#48BB78' }
                borderRadius="4px"
                fontSize="8px"
                fontWeight={ 500 }
                lineHeight="12px"
                whiteSpace="nowrap"
              >
                { t('shellUi.stage_label', { stage: feature.stageIndex }) }
              </Box>
            ) }
          </Box>
        </Tooltip>
      );
    }
    default:
      return null;
  }
};

export default React.memo(RollupStageBadge);
