// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import type BigNumber from 'bignumber.js';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { AddressesItem } from 'types/api/addresses';

import { currencyUnits } from 'lib/units';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import { ZERO } from 'toolkit/utils/consts';

import AddressesTableItem from './AddressesTableItem';

interface Props {
  items: Array<AddressesItem>;
  totalSupply: BigNumber;
  pageStartIndex: number;
  top: number;
  isLoading?: boolean;
}

const AddressesTable = ({ items, totalSupply, pageStartIndex, top, isLoading }: Props) => {
  const { t: tQuat } = useTranslation();

  const hasPercentage = !totalSupply.eq(ZERO);
  return (
    <TableRoot>
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader width="64px">{ tQuat('addresses.rank') }</TableColumnHeader>
          <TableColumnHeader width={ hasPercentage ? '50%' : '60%' }>{ tQuat('common.address') }</TableColumnHeader>
          <TableColumnHeader width={ hasPercentage ? '20%' : '25%' } isNumeric>{ `Balance ${ currencyUnits.ether }` }</TableColumnHeader>
          { hasPercentage && <TableColumnHeader width="15%" isNumeric>{ tQuat('addresses.percentage') }</TableColumnHeader> }
          <TableColumnHeader width="15%" isNumeric>{ tQuat('addresses.transaction_count') }</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items.map((item, index) => (
          <AddressesTableItem
            key={ item.hash + (isLoading ? index : '') }
            item={ item }
            totalSupply={ totalSupply }
            index={ pageStartIndex + index }
            hasPercentage={ hasPercentage }
            isLoading={ isLoading }
          />
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default AddressesTable;
