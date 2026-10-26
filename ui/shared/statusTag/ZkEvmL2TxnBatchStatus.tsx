// Modified by Quat Capital, 2026-10-25: localize event log and status labels. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { ZkEvmL2TxnBatchesItem } from 'types/api/zkEvmL2';

import { layerLabels } from 'lib/rollups/utils';

import type { StatusTagType } from './StatusTag';
import StatusTag from './StatusTag';

export interface Props {
  status: ZkEvmL2TxnBatchesItem['status'];
  isLoading?: boolean;
}

const ZkEvmL2TxnBatchStatus = ({ status, isLoading }: Props) => {
  const { t } = useTranslation();
  let type: StatusTagType;
  let text: string;

  switch (status) {
    case 'L1 Sequence Confirmed': {
      type = 'ok';
      text = t('sharedStatus.sequence_confirmed', { layer: layerLabels.parent });
      break;
    }
    case 'Finalized': {
      type = 'ok';
      text = t('sharedStatus.finalized');
      break;
    }
    default: {
      type = 'pending';
      text = status === 'Unfinalized' ? t('sharedStatus.unfinalized') : status;
    }
  }

  return <StatusTag type={ type } text={ text } loading={ isLoading }/>;
};

export default ZkEvmL2TxnBatchStatus;
