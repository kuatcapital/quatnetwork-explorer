// Modified by Quat Capital, 2026-10-27: localize transaction statistics without rounding API integers. GPL-3.0.
import type { BoxProps } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';
import { useTranslation } from 'react-i18next';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { useMultichainContext } from 'lib/contexts/multichain';
import { formatBigNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import getStatsLabelFromTitle from 'lib/stats/getStatsLabelFromTitle';
import { HOMEPAGE_STATS } from 'stubs/stats';
import { TXS_STATS, TXS_STATS_MICROSERVICE } from 'stubs/tx';
import { thinsp } from 'toolkit/utils/htmlEntities';
import StatsWidget from 'ui/shared/stats/StatsWidget';
import calculateUsdValue from 'ui/shared/value/calculateUsdValue';

interface Props extends BoxProps {}

const TxsStats = (props: Props) => {
  const { locale } = useLocale();
  const { t: tTx } = useTranslation();
  const multichainContext = useMultichainContext();

  const chainConfig = multichainContext?.chain.app_config || config;
  const isStatsFeatureEnabled = chainConfig.features.stats.isEnabled;
  const rollupFeature = chainConfig.features.rollup;
  const isOptimisticRollup = rollupFeature.isEnabled && rollupFeature.type === 'optimistic';
  const isArbitrumRollup = rollupFeature.isEnabled && rollupFeature.type === 'arbitrum';

  const txsStatsQuery = useApiQuery('stats:pages_transactions', {
    queryOptions: {
      enabled: isStatsFeatureEnabled,
      placeholderData: isStatsFeatureEnabled ? TXS_STATS_MICROSERVICE : undefined,
    },
  });

  const txsStatsApiQuery = useApiQuery('general:txs_stats', {
    queryOptions: {
      enabled: !isStatsFeatureEnabled,
      placeholderData: !isStatsFeatureEnabled ? TXS_STATS : undefined,
    },
  });

  const statsQuery = useApiQuery('general:stats', {
    queryOptions: {
      placeholderData: HOMEPAGE_STATS,
    },
  });

  if ((isStatsFeatureEnabled && !txsStatsQuery.data) || (!isStatsFeatureEnabled && !txsStatsApiQuery.data)) {
    return null;
  }

  const isLoading = isStatsFeatureEnabled ? txsStatsQuery.isPlaceholderData : txsStatsApiQuery.isPlaceholderData;

  const txCount24h = isStatsFeatureEnabled ? txsStatsQuery.data?.transactions_24h?.value : txsStatsApiQuery.data?.transactions_count_24h;
  const operationalTxns24hArbitrum = isArbitrumRollup && isStatsFeatureEnabled ? txsStatsQuery.data?.operational_transactions_24h?.value : null;
  const operationalTxns24hOptimistic = isOptimisticRollup && isStatsFeatureEnabled ? txsStatsQuery.data?.op_stack_operational_transactions_24h?.value : null;

  const pendingTxns = isStatsFeatureEnabled ? txsStatsQuery.data?.pending_transactions_30m?.value : txsStatsApiQuery.data?.pending_transactions_count;

  // in microservice data, fee values are already divided by 10^decimals
  const txFeeSumRaw = isStatsFeatureEnabled ? txsStatsQuery.data?.transactions_fee_24h?.value : txsStatsApiQuery.data?.transaction_fees_sum_24h;
  const txFeeSum24h = (() => {
    if (txFeeSumRaw === null || txFeeSumRaw === undefined) {
      return null;
    }
    const sum = BigNumber(txFeeSumRaw);
    return isStatsFeatureEnabled ? sum : sum.div(BigNumber(10).pow(chainConfig.chain.currency.decimals));
  })();

  const avgFee = isStatsFeatureEnabled ? txsStatsQuery.data?.average_transactions_fee_24h?.value : txsStatsApiQuery.data?.transaction_fees_avg_24h;

  const txFeeAvg = avgFee ? calculateUsdValue({
    amount: avgFee,
    exchangeRate: statsQuery.data?.coin_price,
    // in microservice data, fee values are already divided by 10^decimals
    decimals: isStatsFeatureEnabled ? '0' : String(chainConfig.chain.currency.decimals),
    locale,
  }) : null;

  const itemsCount = [
    txCount24h,
    operationalTxns24hArbitrum,
    operationalTxns24hOptimistic,
    pendingTxns,
    txFeeSum24h,
    txFeeAvg,
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
      { txCount24h && (
        <StatsWidget
          label={ txsStatsQuery.data?.transactions_24h?.title ?
            getStatsLabelFromTitle(txsStatsQuery.data?.transactions_24h?.title) :
            tTx('common.transactions') }
          value={ formatBigNumber(BigNumber(txCount24h), locale) }
          period="24h"
          isLoading={ isLoading }
          href={
            chainConfig.features.stats.isEnabled ?
              { pathname: '/stats/[id]', query: { id: 'newTxns', ...(multichainContext?.chain.id ? { chain_id: multichainContext.chain.id } : {}) } } :
              undefined
          }
        />
      ) }
      { operationalTxns24hArbitrum && (
        <StatsWidget
          label={ txsStatsQuery.data?.operational_transactions_24h?.title ?
            getStatsLabelFromTitle(txsStatsQuery.data?.operational_transactions_24h?.title) :
            tTx('home.daily_operational_transactions') }
          value={ formatBigNumber(BigNumber(operationalTxns24hArbitrum), locale) }
          period="24h"
          isLoading={ isLoading }
        />
      ) }
      { operationalTxns24hOptimistic && (
        <StatsWidget
          label={ txsStatsQuery.data?.op_stack_operational_transactions_24h?.title ?
            getStatsLabelFromTitle(txsStatsQuery.data?.op_stack_operational_transactions_24h?.title) :
            tTx('home.daily_operational_transactions') }
          value={ formatBigNumber(BigNumber(operationalTxns24hOptimistic), locale) }
          period="24h"
          isLoading={ isLoading }
        />
      ) }
      { pendingTxns && (
        <StatsWidget
          label={ txsStatsQuery.data?.pending_transactions_30m?.title ?
            getStatsLabelFromTitle(txsStatsQuery.data?.pending_transactions_30m?.title) :
            tTx('transactions.pending_transactions') }
          value={ formatBigNumber(BigNumber(pendingTxns), locale) }
          period={ isStatsFeatureEnabled ? '30min' : '1h' }
          isLoading={ isLoading }
        />
      ) }
      { txFeeSum24h != null && (
        <StatsWidget
          label={ txsStatsQuery.data?.transactions_fee_24h?.title ?
            getStatsLabelFromTitle(txsStatsQuery.data?.transactions_fee_24h?.title) :
            tTx('transactions.transaction_fees') }
          value={ formatBigNumber(txFeeSum24h, locale, 2) }
          valuePostfix={ thinsp + chainConfig.chain.currency.symbol }
          period="24h"
          isLoading={ isLoading }
          href={
            chainConfig.features.stats.isEnabled ?
              { pathname: '/stats/[id]', query: { id: 'txnsFee', ...(multichainContext?.chain.id ? { chain_id: multichainContext.chain.id } : {}) } } :
              undefined
          }
        />
      ) }
      { txFeeAvg && (
        <StatsWidget
          label={ txsStatsQuery.data?.average_transactions_fee_24h?.title ?
            getStatsLabelFromTitle(txsStatsQuery.data?.average_transactions_fee_24h?.title) :
            tTx('transactions.average_fee') }
          value={ txFeeAvg.usdStr ? txFeeAvg.usdStr : txFeeAvg.valueStr }
          valuePrefix={ txFeeAvg.usdStr ? '$' : undefined }
          valuePostfix={ txFeeAvg.usdStr ? undefined : thinsp + chainConfig.chain.currency.symbol }
          period="24h"
          isLoading={ isLoading }
          href={
            chainConfig.features.stats.isEnabled ?
              { pathname: '/stats/[id]', query: { id: 'averageTxnFee', ...(multichainContext?.chain.id ? { chain_id: multichainContext.chain.id } : {}) } } :
              undefined
          }
        />
      ) }
    </Box>
  );
};

export default React.memo(TxsStats);
