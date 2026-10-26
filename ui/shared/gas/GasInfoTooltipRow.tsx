// Modified by Quat Capital, 2026-10-26: localize shared controls, details and data feedback. GPL-3.0.
import { Box, chakra } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { GasPriceInfo } from 'types/api/stats';

import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { space } from 'toolkit/utils/htmlEntities';
import GasPrice from 'ui/shared/gas/GasPrice';

interface Props {
  name: string;
  info: GasPriceInfo | null;
}

const GasInfoTooltipRow = ({ name, info }: Props) => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  return (
    <>
      <Box textAlign="left">
        <chakra.span>{ name }</chakra.span>
        { info && typeof info.time === 'number' && info.time > 0 && (
          <chakra.span color="text.secondary">
            { space }{ t('sharedUi.seconds_short', { value: formatNumber(info.time / 1000, locale, { maximumFractionDigits: 1 }) }) }
          </chakra.span>
        ) }
      </Box>
      <GasPrice data={ info } textAlign="right"/>
      <GasPrice data={ info } unitMode="secondary" color="text.secondary" textAlign="right"/>
    </>
  );
};

export default React.memo(GasInfoTooltipRow);
