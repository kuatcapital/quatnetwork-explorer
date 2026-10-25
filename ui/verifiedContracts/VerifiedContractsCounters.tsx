// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import { Box } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { useMultichainContext } from 'lib/contexts/multichain';
import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { VERIFIED_CONTRACTS_COUNTERS, VERIFIED_CONTRACTS_COUNTERS_MICROSERVICE } from 'stubs/contract';
import StatsWidget from 'ui/shared/stats/StatsWidget';

const VerifiedContractsCounters = () => {
  const { t: tQuat } = useTranslation();
  const { locale } = useLocale();

  const multichainContext = useMultichainContext();

  const chainConfig = multichainContext?.chain.app_config || config;
  const isStatsFeatureEnabled = chainConfig.features.stats.isEnabled;

  const countersStatsQuery = useApiQuery('stats:pages_contracts', {
    queryOptions: {
      enabled: isStatsFeatureEnabled,
      placeholderData: isStatsFeatureEnabled ? VERIFIED_CONTRACTS_COUNTERS_MICROSERVICE : undefined,
    },
  });

  const countersApiQuery = useApiQuery('general:verified_contracts_counters', {
    queryOptions: {
      enabled: !isStatsFeatureEnabled,
      placeholderData: !isStatsFeatureEnabled ? VERIFIED_CONTRACTS_COUNTERS : undefined,
    },
  });

  if (!(isStatsFeatureEnabled ? countersStatsQuery.data : countersApiQuery.data)) {
    return null;
  }

  const isLoading = isStatsFeatureEnabled ? countersStatsQuery.isPlaceholderData : countersApiQuery.isPlaceholderData;

  const contractsCount = isStatsFeatureEnabled ? countersStatsQuery.data?.total_contracts?.value : countersApiQuery.data?.smart_contracts;
  const newContractsCount = isStatsFeatureEnabled ? countersStatsQuery.data?.new_contracts_24h?.value : countersApiQuery.data?.new_smart_contracts_24h;

  const verifiedContractsCount = isStatsFeatureEnabled ?
    countersStatsQuery.data?.total_verified_contracts?.value :
    countersApiQuery.data?.verified_smart_contracts;
  const newVerifiedContractsCount = isStatsFeatureEnabled ?
    countersStatsQuery.data?.new_verified_contracts_24h?.value :
    countersApiQuery.data?.new_verified_smart_contracts_24h;

  return (
    <Box columnGap={ 3 } rowGap={ 3 } mb={ 6 } display="grid" gridTemplateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }}>
      <StatsWidget
        label={ tQuat('verification.total_contracts') }
        value={ formatNumber(Number(contractsCount), locale) }
        diff={ newContractsCount }
        diffFormatted={ formatNumber(Number(newContractsCount), locale) }
        isLoading={ isLoading }
        // there is no stats for contracts growth for now
        // href={ config.features.stats.isEnabled ? { pathname: '/stats/[id]', query: { id: 'contractsGrowth' } } : undefined }
      />
      <StatsWidget
        label={ tQuat('verification.verified_contracts') }
        value={ formatNumber(Number(verifiedContractsCount), locale) }
        diff={ newVerifiedContractsCount }
        diffFormatted={ formatNumber(Number(newVerifiedContractsCount), locale) }
        isLoading={ isLoading }
        href={
          chainConfig.features.stats.isEnabled ?
            {
              pathname: '/stats/[id]',
              query: { id: 'verifiedContractsGrowth', ...(multichainContext?.chain.id ? { chain_id: multichainContext.chain.id } : {}) },
            } :
            undefined
        }
      />
    </Box>
  );
};

export default VerifiedContractsCounters;
