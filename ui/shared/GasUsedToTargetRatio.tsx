// Modified by Quat Capital, 2026-10-26: localize shared controls, details and data feedback. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';

type Props = {
  value: number;
  isLoading?: boolean;
};

const GasUsedToTargetRatio = ({ value, isLoading }: Props) => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  return (
    <Tooltip content={ t('sharedUi.gas_target_percent') }>
      <Skeleton color="text.secondary" loading={ isLoading }>
        <span>{ (value > 0 ? '+' : '') + formatNumber(value, locale, { maximumFractionDigits: 2 }) }%</span>
      </Skeleton>
    </Tooltip>
  );
};

export default React.memo(GasUsedToTargetRatio);
