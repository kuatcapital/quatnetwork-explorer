// Modified by Quat Capital, 2026-10-26: complete localized NFT phrases and exact quantities. GPL-3.0.
import { chakra } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import type { TokenInfo, TokenInstance } from 'types/api/token';

import { formatBigNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import NftEntity from 'ui/shared/entities/nft/NftEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';

interface Props {
  token: TokenInfo;
  value: string;
  tokenId: string | null;
  instance?: TokenInstance | null;
}

const NftTokenTransferSnippet = ({ value, token, tokenId, instance }: Props) => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const num = value === '1' ? '' : value;

  const tokenIdContent = (() => {
    if (tokenId === null) {
      // ERC-404 may not have an ID
      if (token.type === 'ERC-404') {
        return null;
      }
      return <chakra.span color="text.secondary">{ t('editorShared.not_available') }</chakra.span>;
    }

    return (
      <NftEntity
        hash={ token.address_hash }
        id={ tokenId }
        instance={ instance }
        variant="content"
        maxW={{ base: '100%', lg: '150px' }}
        w="auto"
        flexShrink={ 0 }
      />
    );

  })();

  return (
    <Trans
      t={ t }
      i18nKey={ num ? 'editorShared.nft_many_for' : 'editorShared.nft_for' }
      values={{ value: num ? formatBigNumber(BigNumber(num), locale) : '' }}
      components={{
        'for': <chakra.span color="text.secondary"/>,
        of: <chakra.span color="text.secondary"/>,
        id: tokenIdContent || <span/>,
        token: <TokenEntity token={ token } noCopy w="auto" flexGrow={ 1 }/>,
      }}
    />
  );
};

export default React.memo(NftTokenTransferSnippet);
