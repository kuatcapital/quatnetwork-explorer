// Modified by Quat Capital, 2026-10-27: complete runtime multichain localization. GPL-3.0.
// Modified by Quat Capital, 2026-10-26: T18 reviewed literal localization. GPL-3.0.
import { Box } from '@chakra-ui/react';
import { BigNumber } from 'bignumber.js';
import React from 'react';
import { useTranslation } from 'react-i18next';

import useApiQuery from 'lib/api/useApiQuery';
import { formatBigNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { INTERCHAIN_STATS_DAILY } from 'stubs/interchainIndexer';
import StatsWidget from 'ui/shared/stats/StatsWidget';

interface Props {}

const TransactionsCrossChainStats = (props: Props) => {
  const { locale } = useLocale();

  const { t: tQuat } = useTranslation();

  const { data, isPlaceholderData, isError } = useApiQuery('interchainIndexer:stats_daily', {
    queryOptions: {
      placeholderData: INTERCHAIN_STATS_DAILY,
    },
  });

  if (isError || !data) {
    return null;
  }

  return (
    <Box
      display="grid"
      gridTemplateColumns="1fr"
      rowGap={ 3 }
      columnGap={ 3 }
      mb={ 6 }
      { ...props }
    >
      <StatsWidget
        label={ tQuat('home.cross_chain_txns') }
        value={ formatBigNumber(BigNumber(data.daily_messages), locale) }
        period="24h"
        isLoading={ isPlaceholderData }
      />
    </Box>
  );
};

export default React.memo(TransactionsCrossChainStats);
