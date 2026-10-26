// Modified by Quat Capital, 2026-10-26: localize shared controls, details and data feedback. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import config from 'configs/app';
import { Tag, type TagProps } from 'toolkit/chakra/tag';
import { Tooltip } from 'toolkit/chakra/tooltip';

interface Props extends TagProps {
  chainConfig?: typeof config;
}

const NativeTokenTag = ({ chainConfig: chainConfigProp, ...rest }: Props) => {
  const { t } = useTranslation();
  const chainConfig = chainConfigProp || config;
  if (!chainConfig.UI.views.address.nativeTokenAddress) {
    return null;
  }

  return (
    <Tooltip
      content={ t('sharedUi.native_token_balance', { symbol: chainConfig.chain.currency.symbol }) }
    >
      <Tag { ...rest }>{ t('sharedUi.native_token') }</Tag>
    </Tooltip>
  );
};

export default React.memo(NativeTokenTag);
