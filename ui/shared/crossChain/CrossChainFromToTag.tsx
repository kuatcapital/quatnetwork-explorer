// Modified by Quat Capital, 2026-10-26: localize shared controls, details and data feedback. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Badge, type BadgeProps } from 'toolkit/chakra/badge';

interface Props extends BadgeProps {
  type: 'in' | 'out';
  isLoading?: boolean;
}

const CrossChainFromToTag = ({ type, isLoading, ...rest }: Props) => {
  const { t } = useTranslation();
  return (
    <Badge
      loading={ isLoading }
      colorPalette={ type === 'in' ? 'purple' : 'orange' }
      minW={ 8 }
      justifyContent="center"
      { ...rest }
    >
      { type === 'in' ? t('sharedUi.inbound') : t('sharedUi.outbound') }
    </Badge>
  );
};

export default React.memo(CrossChainFromToTag);
