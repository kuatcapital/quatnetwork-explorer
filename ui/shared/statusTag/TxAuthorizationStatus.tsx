// Modified by Quat Capital, 2026-10-25: localize event log and status labels. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { TxAuthorization } from 'types/api/transaction';

import type { BadgeProps } from 'toolkit/chakra/badge';

import StatusTag from './StatusTag';

export interface Props extends BadgeProps {
  status: TxAuthorization['status'];
}

const TxAuthorizationStatus = ({ status, ...rest }: Props) => {
  const { t } = useTranslation();

  const type = (() => {
    if (!status) {
      return 'pending';
    }
    if (status === 'ok') {
      return 'ok';
    }
    return 'error';
  })();

  const text = (() => {
    if (!status) {
      return t('common.pending');
    }
    if (status === 'ok') {
      return t('common.success');
    }
    switch (status) {
      case 'invalid_chain_id': return t('sharedStatus.invalid_chain_id');
      case 'invalid_nonce': return t('sharedStatus.invalid_nonce');
      case 'invalid_signature': return t('sharedStatus.invalid_signature');
      default: return status;
    }
  })();

  return <StatusTag { ...rest } type={ type } text={ text }/>;
};

export default TxAuthorizationStatus;
