// Modified by Quat Capital, 2026-10-25: localize event log and status labels. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import { MessageStatus } from '@blockscout/interchain-indexer-types';

import type { BadgeProps } from 'toolkit/chakra/badge';

import StatusTag, { type Props as StatusTagProps } from './StatusTag';

interface Props extends BadgeProps {
  status: MessageStatus;
  mode?: StatusTagProps['mode'];
}

const CrossChainTxsStatusTag = ({ status: statusProp, mode = 'compact', ...rest }: Props) => {
  const { t } = useTranslation();

  const { status, text } = (() => {
    switch (statusProp) {
      case MessageStatus.MESSAGE_STATUS_COMPLETED:
        return { status: 'ok' as const, text: t('sharedStatus.completed') };
      case MessageStatus.MESSAGE_STATUS_FAILED:
        return { status: 'error' as const, text: t('common.failed') };
      case MessageStatus.MESSAGE_STATUS_INITIATED:
        return { status: 'pending' as const, text: t('sharedStatus.initiated') };
      default:
        return { status: undefined, text: undefined };
    }
  })();

  if (!status) {
    return null;
  }

  return <StatusTag type={ status } text={ text } mode={ mode } { ...rest }/>;
};

export default React.memo(CrossChainTxsStatusTag);
