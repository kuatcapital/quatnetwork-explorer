// Modified by Quat Capital, 2026-10-26: runtime locale for block and statistics UI. GPL-3.0.
import { Box } from '@chakra-ui/react';
import { upperFirst } from 'es-toolkit';
import React from 'react';
import { useTranslation } from 'react-i18next';

import config from 'configs/app';
import { formatNumber, NUMBER_LOCALES } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { SECOND } from 'toolkit/utils/consts';
import StatsWidget from 'ui/shared/stats/StatsWidget';

const flashblocksFeature = config.features.flashblocks;

interface Props {
  itemsNum: number;
  txsNum: number;
  initialTs: number | undefined;
}

const FlashblocksStats = ({ itemsNum, txsNum, initialTs }: Props) => {
  const { t } = useTranslation();
  const { locale } = useLocale();

  const timeElapsed = initialTs ? Date.now() - initialTs : undefined;

  if (!flashblocksFeature.isEnabled) {
    return null;
  }

  return (
    <Box
      display="grid"
      gridTemplateColumns={{ base: '1fr', lg: `repeat(3, calc(${ 100 / 3 }% - 9px))` }}
      gap={{ base: 1, lg: 3 }}
      mb={ 6 }
    >
      <StatsWidget
        label={ t('flashblocks.rate', { name: upperFirst(flashblocksFeature.name) }) }
        value={ timeElapsed ? Number(itemsNum / (timeElapsed / SECOND)).toLocaleString(NUMBER_LOCALES[locale], { maximumFractionDigits: 0 }) : '-' }
      />
      <StatsWidget
        label="TPS"
        value={ timeElapsed && txsNum > 0 ? Number(txsNum / (timeElapsed / SECOND)).toLocaleString(NUMBER_LOCALES[locale], { maximumFractionDigits: 0 }) : '-' }
      />
      <StatsWidget
        label={ t('flashblocks.time', { name: upperFirst(flashblocksFeature.name) }) }
        value={
          timeElapsed && itemsNum > 0 ?
            t('flashblocks.milliseconds', { value: formatNumber(timeElapsed / itemsNum, locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) }) :
            '-'
        }
      />
    </Box>
  );
};

export default React.memo(FlashblocksStats);
