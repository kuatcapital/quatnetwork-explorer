// Modified by Quat Capital, 2026-10-26: reorder the complete asset phrase for each language. GPL-3.0.
import { chakra } from '@chakra-ui/react';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import type { TokenInfo } from 'types/api/token';

import TokenValue from 'ui/shared/value/TokenValue';

interface Props {
  token: TokenInfo;
  value: string;
  decimals: string | null;
}
const FtTokenTransferSnippet = ({ token, value, decimals }: Props) => {
  const { t } = useTranslation();
  return (
    <Trans
      t={ t }
      i18nKey="editorShared.ft_for"
      components={{
        'for': <chakra.span color="text.secondary"/>,
        asset: <TokenValue amount={ value } token={ token } decimals={ decimals } accuracy={ 0 }/>,
      }}
    />
  );
};

export default React.memo(FtTokenTransferSnippet);
