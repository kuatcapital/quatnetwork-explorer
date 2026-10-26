// Modified by Quat Capital, 2026-10-25: localize event log and status labels. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { Props as StatusTagProps } from './StatusTag';
import StatusTag from './StatusTag';

export interface Props extends Omit<StatusTagProps, 'type' | 'text'> {
  isFinalized: boolean;
}

const CeloEpochStatus = ({ isFinalized, ...rest }: Props) => {
  const { t } = useTranslation();
  return (
    <StatusTag
      { ...rest }
      type={ isFinalized ? 'ok' : 'pending' }
      text={ isFinalized ? t('sharedStatus.finalized') : t('sharedStatus.in_progress') }
    />
  );
};

export default CeloEpochStatus;
