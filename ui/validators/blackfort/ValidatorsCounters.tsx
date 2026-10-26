// Modified by Quat Capital, 2026-10-26: localize validators, epochs and transfers. GPL-3.0.
import { Box } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';
import { useTranslation } from 'react-i18next';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { formatBigNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { VALIDATORS_BLACKFORT_COUNTERS } from 'stubs/validators';
import StatsWidget from 'ui/shared/stats/StatsWidget';

const ValidatorsCounters = () => {
  const { locale } = useLocale();
  const { t } = useTranslation();
  const countersQuery = useApiQuery('general:validators_blackfort_counters', {
    queryOptions: {
      enabled: config.features.validators.isEnabled,
      placeholderData: VALIDATORS_BLACKFORT_COUNTERS,
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
    </Box>
  );
};

export default React.memo(ValidatorsCounters);
