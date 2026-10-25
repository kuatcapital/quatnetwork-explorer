// Modified by Quat Capital, 2026-10-25: locale-aware transaction status labels. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { Transaction } from 'types/api/transaction';

import type { BadgeProps } from 'toolkit/chakra/badge';

import type { StatusTagType } from './StatusTag';
import StatusTag from './StatusTag';

export interface Props extends BadgeProps {
  status: Transaction['status'];
  errorText?: string | null;
  isLoading?: boolean;
}

const TxStatus = ({ status, errorText, isLoading, ...rest }: Props) => {
  const { t } = useTranslation();
  if (status === undefined) {
    return null;
  }

  let text;
  let type: StatusTagType;

  switch (status) {
    case 'ok':
      text = t('common.success');
      type = 'ok';
      break;
    case 'error':
      text = t('common.failed');
      type = 'error';
      break;
    case null:
      text = t('common.pending');
      type = 'pending';
      break;
  }

  return <StatusTag type={ type } text={ text } errorText={ errorText } loading={ isLoading } { ...rest }/>;
};

export default TxStatus;
