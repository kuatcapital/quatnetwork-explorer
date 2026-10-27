// Modified by Quat Capital, 2026-10-27: complete runtime multichain localization. GPL-3.0.
import type { BoxProps } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';
import { BigNumber } from 'bignumber.js';
import React from 'react';
import { useTranslation } from 'react-i18next';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { formatBigNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import getStatsLabelFromTitle from 'lib/stats/getStatsLabelFromTitle';
import { TXS_STATS_MICROSERVICE } from 'stubs/tx';
import StatsWidget from 'ui/shared/stats/StatsWidget';

interface Props extends BoxProps {}

const ZetaChainCCTXsStats = (props: Props) => {
  const { t: tQuat } = useTranslation();
  const { locale } = useLocale();

  const isStatsFeatureEnabled = config.features.stats.isEnabled;

  const txsStatsQuery = useApiQuery('stats:pages_transactions', {
    queryOptions: {
      enabled: isStatsFeatureEnabled,
      placeholderData: isStatsFeatureEnabled ? TXS_STATS_MICROSERVICE : undefined,
    },
  });

  if (!txsStatsQuery.data) {
    return null;
  }

  const isLoading = txsStatsQuery.isPlaceholderData;

  const cctxCountTotal = txsStatsQuery.data?.total_zetachain_cross_chain_txns;
  const cctxPendingCountTotal = txsStatsQuery.data?.pending_zetachain_cross_chain_txns;
  const cctxCount24h = txsStatsQuery.data?.new_zetachain_cross_chain_txns_24h;

  const itemsCount = [
    cctxCountTotal,
    cctxPendingCountTotal,
    cctxCount24h,
  ].filter(item => item !== null && item !== undefined).length;

  return (
    <Box
      display="grid"
      gridTemplateColumns={{ base: '1fr', lg: `repeat(${ itemsCount }, calc(${ 100 / itemsCount }% - 9px))` }}
      rowGap={ 3 }
      columnGap={ 3 }
      mb={ 6 }
      { ...props }
    >
      { cctxCountTotal && (
        <StatsWidget
          label={ locale === 'en' ? getStatsLabelFromTitle(cctxCountTotal.title) : tQuat('multiUi.total_cctx') }
          value={ formatBigNumber(BigNumber(cctxCountTotal.value), locale) }
          isLoading={ isLoading }
        />
      ) }
      { cctxPendingCountTotal && (
        <StatsWidget
          label={ locale === 'en' ? getStatsLabelFromTitle(cctxPendingCountTotal.title) : tQuat('multiUi.pending_cctx') }
          value={ formatBigNumber(BigNumber(cctxPendingCountTotal.value), locale) }
          isLoading={ isLoading }
        />
      ) }
      { cctxCount24h && (
        <StatsWidget
          label={ locale === 'en' ? getStatsLabelFromTitle(cctxCount24h.title) : tQuat('multiUi.new_cctx') }
          value={ formatBigNumber(BigNumber(cctxCount24h.value), locale) }
          period="24h"
          isLoading={ isLoading }
        />
      ) }
    </Box>
  );
};

export default React.memo(ZetaChainCCTXsStats);
