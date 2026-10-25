// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { TokenHolder, TokenInfo } from 'types/api/token';

import { hasTokenIds, isConfidentialTokenType } from 'lib/token/tokenTypes';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import TokenHoldersTableItem from 'ui/token/TokenHolders/TokenHoldersTableItem';

interface Props {
  data: Array<TokenHolder>;
  token: TokenInfo;
  top: number;
  isLoading?: boolean;
}

const TokenHoldersTable = ({ data, token, top, isLoading }: Props) => {
  const { t: tQuat } = useTranslation();

  return (
    <TableRoot>
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader w="70%">{ tQuat('tokenUi.holder') }</TableColumnHeader>
          { (hasTokenIds(token.type)) && <TableColumnHeader w="30%">{ tQuat('tokenUi.id_number') }</TableColumnHeader> }
          <TableColumnHeader isNumeric width="220px">{ tQuat('tokenUi.quantity') }</TableColumnHeader>
          { token.total_supply && token.type !== 'ERC-404' && !isConfidentialTokenType(token.type) && (
            <TableColumnHeader isNumeric width="175px">{ tQuat('tokenUi.percentage') }</TableColumnHeader>
          ) }
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { data.map((item, index) => {
          const tokenId = 'token_id' in item ? item.token_id : null;
          return (
            <TokenHoldersTableItem key={ item.address.hash + tokenId + (isLoading ? index : '') } holder={ item } token={ token } isLoading={ isLoading }/>
          );
        }) }
      </TableBody>
    </TableRoot>
  );
};

export default React.memo(TokenHoldersTable);
