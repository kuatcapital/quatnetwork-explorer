// Modified by Quat Capital, 2026-10-26: localize shared controls, details and data feedback. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import config from 'configs/app';
import type { AlertProps } from 'toolkit/chakra/alert';
import { Alert } from 'toolkit/chakra/alert';

interface Props extends AlertProps {
  view?: 'block' | 'tx';
}

const BlockPendingUpdateAlert = ({ view = 'block', ...props }: Props) => {
  const { t } = useTranslation();
  if (!config.UI.views.block.pendingUpdateAlertEnabled) {
    return null;
  }

  const content = view === 'block' ?
    t('sharedEntities.block_resync') :
    t('sharedEntities.transaction_resync');

  return (
    <Alert status="info" showIcon { ...props }>
      { content }
    </Alert>
  );
};

export default React.memo(BlockPendingUpdateAlert);
