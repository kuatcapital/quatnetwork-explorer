// Modified by Quat Capital, 2026-10-26: localize validators, epochs and transfers. GPL-3.0.
import { Box } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';
import { useTranslation } from 'react-i18next';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { formatNumber, formatBigNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { VALIDATORS_STABILITY_COUNTERS } from 'stubs/validators';
import StatsWidget from 'ui/shared/stats/StatsWidget';

const ValidatorsCounters = () => {
  const { locale } = useLocale();
  const { t } = useTranslation();
  const countersQuery = useApiQuery('general:validators_stability_counters', {
    queryOptions: {
      enabled: config.features.validators.isEnabled,
      placeholderData: VALIDATORS_STABILITY_COUNTERS,
    },
  });

  if (!countersQuery.data) {
    return null;
  }

  return (
    <Box columnGap={ 3 } rowGap={ 3 } mb={ 6 } display="grid" gridTemplateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }}>
      <StatsWidget
        label={ t('networkTransfers.total_validators') }
        value={ formatBigNumber(BigNumber(countersQuery.data.validators_count), locale) }
        diff={ formatBigNumber(BigNumber(countersQuery.data.new_validators_count_24h), locale) }
        isLoading={ countersQuery.isPlaceholderData }
      />
      <StatsWidget
        label={ t('networkTransfers.active_validators') }
        value={ `${ formatNumber(Number(countersQuery.data.active_validators_percentage), locale) }%` }
        isLoading={ countersQuery.isPlaceholderData }
      />
    </Box>
  );
};

export default React.memo(ValidatorsCounters);
