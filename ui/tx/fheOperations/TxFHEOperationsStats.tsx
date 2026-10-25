// Modified by Quat Capital, 2026-10-25: runtime transaction interface localization. GPL-3.0.
import { Box } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import StatsWidget from 'ui/shared/stats/StatsWidget';

interface Props {
  totalHcu: number;
  maxDepthHcu: number;
  operationCount: number;
  isLoading?: boolean;
}

const TxFHEOperationsStats = ({ totalHcu, maxDepthHcu, operationCount, isLoading }: Props) => {
  const { locale } = useLocale();
  const { t: tTx } = useTranslation();
  return (
    <Box
      display="grid"
      gridTemplateColumns={{ base: '1fr', lg: 'repeat(3, calc(33.333% - 8px))' }}
      gap={ 3 }
      mb={ 6 }
    >
      <StatsWidget
        label={ tTx('transactions.total_hcu') }
        hint={ tTx('transactions.hcu_total_hint') }
        value={ formatNumber((totalHcu || 0), locale) }
        isLoading={ isLoading }
      />
      <StatsWidget
        label={ tTx('transactions.max_depth_hcu') }
        hint={ tTx('transactions.hcu_depth_hint') }
        value={ formatNumber((maxDepthHcu || 0), locale) }
        isLoading={ isLoading }
      />
      <StatsWidget
        label={ tTx('navigation.operations') }
        hint={ tTx('transactions.fhe_count_hint') }
        value={ formatNumber(operationCount, locale) }
        isLoading={ isLoading }
      />
    </Box>
  );
};

export default React.memo(TxFHEOperationsStats);
