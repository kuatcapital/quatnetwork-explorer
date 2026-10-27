// Modified by Quat Capital, 2026-10-27: complete runtime multichain localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { AddressTokensErc20Item } from 'ui/address/tokens/types';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';

import MultichainAddressTokensTableItem from './MultichainAddressTokensTableItem';

interface Props {
  data: Array<AddressTokensErc20Item>;
  top: number;
  isLoading: boolean;
}

const MultichainAddressTokensTable = ({ data, top, isLoading }: Props) => {
  const { t: tQuat } = useTranslation();

  return (
    <TableRoot>
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader width="55%">{ tQuat('addresses.asset') }</TableColumnHeader>
          <TableColumnHeader width="15%" isNumeric>{ tQuat('common.price') }</TableColumnHeader>
          <TableColumnHeader width="15%" isNumeric>{ tQuat('multiUi.quantity') }</TableColumnHeader>
          <TableColumnHeader width="15%" isNumeric>{ tQuat('multiUi.value') }</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { data.map((item, index) => (
          <MultichainAddressTokensTableItem
            key={ item.token.address_hash + (isLoading ? index : '') + (item.chain_values ? Object.keys(item.chain_values).join(',') : '') }
            data={ item }
            isLoading={ isLoading }
          />
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default React.memo(MultichainAddressTokensTable);
