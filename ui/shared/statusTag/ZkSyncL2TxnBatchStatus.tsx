// Modified by Quat Capital, 2026-10-25: localize event log and status labels. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { ZkSyncBatchStatus } from 'types/api/zkSyncL2';

import { layerLabels } from 'lib/rollups/utils';

import type { StatusTagType } from './StatusTag';
import StatusTag from './StatusTag';

export interface Props {
  status: ZkSyncBatchStatus;
  isLoading?: boolean;
}

const ZkSyncL2TxnBatchStatus = ({ status, isLoading }: Props) => {
  const { t } = useTranslation();
  let type: StatusTagType;

  switch (status) {
    case 'Executed on L1':
      type = 'ok';
      break;
    default:
      type = 'pending';
      break;
  }

  const text = {
    'Processed on L2': t('sharedStatus.processed_on', { layer: layerLabels.current }),
    'Sealed on L2': t('sharedStatus.sealed_on', { layer: layerLabels.current }),
    'Sent to L1': t('sharedStatus.sent_to', { layer: layerLabels.parent }),
    'Validated on L1': t('sharedStatus.validated_on', { layer: layerLabels.parent }),
    'Executed on L1': t('sharedStatus.executed_on', { layer: layerLabels.parent }),
  }[status];

  return <StatusTag type={ type } text={ text } loading={ isLoading }/>;
};

export default ZkSyncL2TxnBatchStatus;
