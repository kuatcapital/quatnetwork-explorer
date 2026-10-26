// Modified by Quat Capital, 2026-10-25: localize event log and status labels. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import * as tac from '@blockscout/tac-operation-lifecycle-types';

import { getTacOperationStatus } from 'lib/operations/tac';
import { Tooltip } from 'toolkit/chakra/tooltip';

import StatusTag from './StatusTag';

interface Props {
  status: tac.OperationType;
  isLoading?: boolean;
  noTooltip?: boolean;
}

const TacOperationStatus = ({ status, isLoading, noTooltip }: Props) => {
  const { t } = useTranslation();
  const text = (() => {
    switch (status) {
      case tac.OperationType.ERROR: return t('common.error');
      case tac.OperationType.ROLLBACK: return t('sharedStatus.rollback');
      case tac.OperationType.INSUFFICIENT_FEE: return t('sharedStatus.insufficient_fee');
      case tac.OperationType.PENDING: return t('common.pending');
      default: return getTacOperationStatus(status);
    }
  })();

  if (!text) {
    return null;
  }

  switch (status) {
    case tac.OperationType.ERROR:
    case tac.OperationType.INSUFFICIENT_FEE:
      return <StatusTag type="error" text={ text } loading={ isLoading }/>;
    case tac.OperationType.ROLLBACK:
      return (
        <Tooltip
          content={ t('sharedStatus.rollback_hint') }
          disabled={ noTooltip }
        >
          <StatusTag type="error" text={ text } loading={ isLoading }/>
        </Tooltip>
      );
    case tac.OperationType.PENDING: {
      return <StatusTag type="pending" text={ text } loading={ isLoading }/>;
    }
    default: {
      return <StatusTag type="ok" text={ text } loading={ isLoading }/>;
    }
  }
};

export default React.memo(TacOperationStatus);
