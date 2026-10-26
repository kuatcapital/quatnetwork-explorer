// Modified by Quat Capital, 2026-10-26: localize shared controls, details and data feedback. GPL-3.0.
import type { BoxProps } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import config from 'configs/app';
import { Tooltip } from 'toolkit/chakra/tooltip';
import IconSvg from 'ui/shared/IconSvg';

interface Props extends BoxProps {
  view?: 'block' | 'tx';
}

const BlockPendingUpdateHint = ({ view = 'block', ...props }: Props) => {
  const { t } = useTranslation();
  if (!config.UI.views.block.pendingUpdateAlertEnabled) {
    return null;
  }

  const tooltipContent = view === 'block' ?
    t('sharedEntities.block_resync') :
    t('sharedEntities.transaction_resync');

  return (
    <Tooltip content={ tooltipContent }>
      <IconSvg boxSize={ 5 } color="icon.secondary" name="status/warning" { ...props }/>
    </Tooltip>
  );
};

export default React.memo(BlockPendingUpdateHint);
