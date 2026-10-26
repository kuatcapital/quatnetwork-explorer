// Modified by Quat Capital, 2026-10-25: localize event log and status labels. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { InteropMessage } from 'types/api/interop';

import type { StatusTagType } from './StatusTag';
import StatusTag from './StatusTag';

export interface Props {
  status: InteropMessage['status'];
  isLoading?: boolean;
}

const InteropMessageStatus = ({ status, isLoading }: Props) => {
  const { t } = useTranslation();
  let type: StatusTagType;
  let text: string = status;

  switch (status) {
    case 'Relayed': {
      text = t('sharedStatus.relayed');
      type = 'ok';
      break;
    }
    case 'Failed': {
      text = t('common.failed');
      type = 'error';
      break;
    }
    case 'Sent': {
      text = t('sharedStatus.sent');
      type = 'pending';
      break;
    }
    default:
      type = 'pending';
      break;
  }

  return <StatusTag type={ type } text={ text } loading={ isLoading }/>;
};

export default InteropMessageStatus;
