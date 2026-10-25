// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { AddressMudTables } from 'types/api/address';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';

import AddressMudTablesTableItem from './AddressMudTablesTableItem';

type Props = {
  items: AddressMudTables['items'];
  isLoading: boolean;
  top: number;
  hash: string;
};

//sorry for the naming
const AddressMudTablesTable = ({ items, isLoading, top, hash }: Props) => {
  const { t: tQuat } = useTranslation();

  return (
    <TableRoot style={{ tableLayout: 'auto' }}>
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader width="24px"></TableColumnHeader>
          <TableColumnHeader>{ tQuat('addresses.full_name') }</TableColumnHeader>
          <TableColumnHeader>{ tQuat('addresses.table_id') }</TableColumnHeader>
          <TableColumnHeader>{ tQuat('common.type') }</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items.map((item, index) => (
          <AddressMudTablesTableItem
            key={ item.table.table_id + (isLoading ? String(index) : '') }
            item={ item }
            isLoading={ isLoading }
            hash={ hash }
          />
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default AddressMudTablesTable;
