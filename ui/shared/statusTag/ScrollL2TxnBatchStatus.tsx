// Modified by Quat Capital, 2026-10-25: localize event log and status labels. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { StatusTagType } from './StatusTag';
import StatusTag from './StatusTag';

export interface Props {
  status: 'Finalized' | 'Committed';
  isLoading?: boolean;
}

const ScrollL2TxnBatchStatus = ({ status, isLoading }: Props) => {
  const { t } = useTranslation();
  let type: StatusTagType;

  switch (status) {
    case 'Finalized':
      type = 'ok';
      break;
    default:
      type = 'pending';
      break;
  }

  return <StatusTag type={ type } text={ status === 'Finalized' ? t('sharedStatus.finalized') : t('sharedStatus.committed') } loading={ isLoading }/>;
};

export default ScrollL2TxnBatchStatus;
