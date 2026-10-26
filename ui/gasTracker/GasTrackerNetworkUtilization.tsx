// Modified by Quat Capital, 2026-10-26: runtime locale for block and statistics UI. GPL-3.0.
import { chakra } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import getNetworkUtilizationParams from 'lib/networks/getNetworkUtilizationParams';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { mdash } from 'toolkit/utils/htmlEntities';

interface Props {
  percentage: number;
  isLoading: boolean;
}

const GasTrackerNetworkUtilization = ({ percentage, isLoading }: Props) => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const { load, color } = getNetworkUtilizationParams(percentage);
  const loadLabels = { high: t('gasTracker.high'), medium: t('gasTracker.medium'), low: t('gasTracker.low') };
  const loadLabel = loadLabels[load as keyof typeof loadLabels];

  return (
    <Skeleton loading={ isLoading } whiteSpace="pre-wrap">
      <span>{ t('gasTracker.utilization') } </span>
      <chakra.span color={ color }>
        { formatNumber(percentage, locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }% { mdash } { loadLabel }
      </chakra.span>
    </Skeleton>
  );
};

export default React.memo(GasTrackerNetworkUtilization);
