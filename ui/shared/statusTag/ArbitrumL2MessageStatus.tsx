// Modified by Quat Capital, 2026-10-25: localize event log and status labels. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { ArbitrumL2MessagesItem } from 'types/api/arbitrumL2';

import type { StatusTagType } from './StatusTag';
import StatusTag from './StatusTag';

export interface Props {
  status: ArbitrumL2MessagesItem['status'];
  isLoading?: boolean;
}

const ArbitrumL2MessageStatus = ({ status, isLoading }: Props) => {
  const { t } = useTranslation();
  let type: StatusTagType;
  let text: string;

  switch (status) {
    case 'relayed': {
      type = 'ok';
      text = t('sharedStatus.relayed');
      break;
    }
    case 'confirmed': {
      type = 'pending';
      text = t('sharedStatus.ready_for_relay');
      break;
    }
    case 'sent': {
      type = 'pending';
      text = t('sharedStatus.waiting');
      break;
    }
    case 'initiated': {
      type = 'pending';
      text = t('common.pending');
      break;
    }
    default:
      type = 'pending';
      text = status;
      break;
  }

  return <StatusTag type={ type } text={ text } loading={ isLoading }/>;
};

export default ArbitrumL2MessageStatus;
