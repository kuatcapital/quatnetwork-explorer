// Modified by Quat Capital, 2026-10-27: complete token value label localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { AddressTokensErc20Item } from './types';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';

import ERC20TokensTableItem from './ERC20TokensTableItem';

interface Props {
  data: Array<AddressTokensErc20Item>;
  top: number;
  isLoading: boolean;
  hasAdditionalTokenTypes?: boolean;
}

const ERC20TokensTable = ({ data, top, isLoading, hasAdditionalTokenTypes }: Props) => {
  const { t: tQuat } = useTranslation();

  return (
    <TableRoot>
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader width="30%">{ tQuat('addresses.asset') }</TableColumnHeader>
          <TableColumnHeader width="30%">{ tQuat('addresses.contract_address') }</TableColumnHeader>
          <TableColumnHeader width="10%" isNumeric>{ tQuat('common.price') }</TableColumnHeader>
          <TableColumnHeader width="15%" isNumeric>{ tQuat('addresses.quantity') }</TableColumnHeader>
          <TableColumnHeader width="15%" isNumeric>{ tQuat('addresses.asset_value') }</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { data.map((item, index) => (
          <ERC20TokensTableItem
            key={ item.token.address_hash + (isLoading ? index : '') + (item.chain_values ? Object.keys(item.chain_values).join(',') : '') }
            { ...item }
            isLoading={ isLoading }
            hasAdditionalTokenTypes={ hasAdditionalTokenTypes }
          />
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default ERC20TokensTable;
