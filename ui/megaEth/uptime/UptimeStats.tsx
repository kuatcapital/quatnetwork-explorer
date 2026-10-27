// Modified by Quat Capital, 2026-10-27: T18 supplemental interface localization. GPL-3.0.
import { Box } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { UptimeRealTimeData } from 'types/api/megaEth';

import { NUMBER_LOCALES } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import StatsWidget from 'ui/shared/stats/StatsWidget';

interface Props {
  realtimeData: UptimeRealTimeData | null;
}

const UptimeStats = ({ realtimeData }: Props) => {
  const { locale } = useLocale();
  const { t: tQuat } = useTranslation();

  return (
    <Box
      columnGap={ 2 }
      rowGap={ 2 }
      mb={ 8 }
      display="grid"
      gridTemplateColumns={{ base: '1fr', lg: 'repeat(4, 1fr)' }}
    >
      <StatsWidget
        label={ tQuat('suppUi.current_tps') }
        hint={ tQuat('suppUi.tps_hint') }
        value={ realtimeData ? Number(realtimeData.instant_tps).toLocaleString(NUMBER_LOCALES[locale]) : '-' }
      />
      <StatsWidget
        label={ tQuat('suppUi.mgas_second') }
        hint={ tQuat('suppUi.gas_second_hint') }
        value={ realtimeData ? Number(realtimeData.instant_mgas_per_second).toLocaleString(NUMBER_LOCALES[locale], { maximumFractionDigits: 2 }) : '-' }
      />
      <StatsWidget
        label={ tQuat('suppUi.block_height') }
        hint={ tQuat('suppUi.height_hint') }
        value={ realtimeData ? Number(realtimeData.latest_mini_block_id).toLocaleString(NUMBER_LOCALES[locale]) : '-' }
      />
      <StatsWidget
        label={ tQuat('suppUi.block_time') }
        hint={ tQuat('suppUi.block_time_hint') }
        valuePostfix={ tQuat('suppUi.milliseconds') }
        value={ realtimeData ? Number(realtimeData.instant_mini_block_interval).toLocaleString(NUMBER_LOCALES[locale], { maximumFractionDigits: 2 }) : '-' }
      />
    </Box>
  );
};

export default React.memo(UptimeStats);
