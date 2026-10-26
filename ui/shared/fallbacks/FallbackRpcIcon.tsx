// Modified by Quat Capital, 2026-10-26: localize shared controls, details and data feedback. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Tooltip } from 'toolkit/chakra/tooltip';
import IconSvg from 'ui/shared/IconSvg';
import type { IconName, Props as IconSvgProps } from 'ui/shared/IconSvg';

interface Props extends Omit<IconSvgProps, 'name'> {
  name?: IconName;
}

const FallbackRpcIcon = (props: Props) => {
  const { t } = useTranslation();
  return (
    <Tooltip content={ t('sharedUi.rpc_fallback') }>
      <IconSvg name="RPC" color="orange.400" boxSize={ 5 } { ...props }/>
    </Tooltip>
  );
};

export default React.memo(FallbackRpcIcon);
