// Modified by Quat Capital, 2026-10-25: runtime transaction interface localization. GPL-3.0.
import { Flex } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { TokenTransfer } from 'types/api/tokenTransfer';

import { route } from 'nextjs-routes';

import { Link } from 'toolkit/chakra/link';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import IconSvg from 'ui/shared/IconSvg';
import TokenTransferSnippet from 'ui/shared/TokenTransferSnippet/TokenTransferSnippet';
interface Props {
  data: Array<TokenTransfer>;
  txHash: string;
  isOverflow: boolean;
}

const TOKEN_TRANSFERS_TYPES = [
  { title: 'transactions.tokens_transferred', hint: 'transactions.tokens_transferred_hint', type: 'token_transfer' },
  { title: 'transactions.tokens_minted', hint: 'transactions.tokens_minted_hint', type: 'token_minting' },
  { title: 'transactions.tokens_burnt', hint: 'transactions.tokens_burnt_hint', type: 'token_burning' },
  { title: 'transactions.tokens_created', hint: 'transactions.tokens_created_hint', type: 'token_spawning' },
];

const TxDetailsTokenTransfers = ({ data, txHash, isOverflow }: Props) => {
  const { t: tTx } = useTranslation();
  const viewAllUrl = route({ pathname: '/tx/[hash]', query: { hash: txHash, tab: 'token_transfers' } });

  const transferGroups = TOKEN_TRANSFERS_TYPES.map((group) => ({
    ...group,
    title: tTx(group.title),
    hint: tTx(group.hint),
    items: data?.filter((token) => token.type === group.type) || [],
  }));

  return (
    <>
      { transferGroups.map(({ title, hint, type, items }) => {
        if (items.length === 0) {
          return null;
        }

        return (
          <React.Fragment key={ type }>
            <DetailedInfo.ItemLabel
              hint={ hint }
            >
              { title }
            </DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue position="relative" multiRow>
              <Flex
                flexDirection="column"
                alignItems="flex-start"
                rowGap={ 1 }
                w="100%"
              >
                { items.map((item, index) => <TokenTransferSnippet key={ index } data={ item }/>) }
              </Flex>
              { isOverflow && (
                <>
                  { /* FIXME use non-navigation icon */ }
                  <IconSvg name="navigation/tokens" boxSize={ 6 }/>
                  <Link href={ viewAllUrl }>
                    { tTx('common.view_all') }</Link>
                </>
              ) }
            </DetailedInfo.ItemValue>
          </React.Fragment>
        );
      }) }
    </>
  );
};

export default React.memo(TxDetailsTokenTransfers);
