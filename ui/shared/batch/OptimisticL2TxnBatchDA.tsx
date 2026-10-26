// Modified by Quat Capital, 2026-10-26: localize shared controls, details and data feedback. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { OptimisticL2TxnBatchesItem } from 'types/api/optimisticL2';
import type { ExcludeUndefined } from 'types/utils';

import type { BadgeProps } from 'toolkit/chakra/badge';
import { Badge } from 'toolkit/chakra/badge';

export interface Props extends BadgeProps {
  container: ExcludeUndefined<OptimisticL2TxnBatchesItem['batch_data_container']>;
  isLoading?: boolean;
}

const OptimisticL2TxnBatchDA = ({ container, isLoading, ...rest }: Props) => {
  const { t } = useTranslation();

  const text = (() => {
    switch (container) {
      case 'in_blob4844':
        return t('sharedUi.eip4844_blob');
      case 'in_calldata':
        return t('sharedUi.calldata');
      case 'in_celestia':
        return t('sharedUi.celestia_blob');
      case 'in_eigenda':
        return 'EigenDA';
    }
  })();

  if (!text) {
    return null;
  }

  return (
    <Badge colorPalette="yellow" loading={ isLoading } { ...rest }>
      { text }
    </Badge>
  );
};

export default React.memo(OptimisticL2TxnBatchDA);
