// Modified by Quat Capital, 2026-10-25: localize event log and status labels. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { ArbitrumL2TxnBatchesItem } from 'types/api/arbitrumL2';

import type { StatusTagType } from './StatusTag';
import StatusTag from './StatusTag';

export interface Props {
  status: ArbitrumL2TxnBatchesItem['commitment_transaction']['status'];
  isLoading?: boolean;
}

const ArbitrumL2TxnBatchStatus = ({ status, isLoading }: Props) => {
  const { t } = useTranslation();
  let type: StatusTagType;

  switch (status) {
    case 'finalized':
      type = 'ok';
      break;
    default:
      type = 'pending';
      break;
  }

  return <StatusTag type={ type } text={ status === 'finalized' ? t('sharedStatus.finalized') : status } loading={ isLoading }/>;
};

export default ArbitrumL2TxnBatchStatus;
