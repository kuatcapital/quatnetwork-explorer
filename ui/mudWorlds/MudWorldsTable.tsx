// Modified by Quat Capital, 2026-10-27: T18 reviewed literal localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { MudWorldItem } from 'types/api/mudWorlds';

import { currencyUnits } from 'lib/units';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';

import MudWorldsTableItem from './MudWorldsTableItem';

type Props = {
  items: Array<MudWorldItem>;
  top: number;
  isLoading?: boolean;
};

const MudWorldsTable = ({ items, top, isLoading }: Props) => {
  const { t: tQuat } = useTranslation();

  return (
    <TableRoot style={{ tableLayout: 'auto' }}>
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader>{ tQuat('suppUi.address') }</TableColumnHeader>
          <TableColumnHeader isNumeric>{ tQuat('suppUi.balance_currency', { currency: currencyUnits.ether }) }</TableColumnHeader>
          <TableColumnHeader isNumeric>{ tQuat('suppUi.txn_count') }</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items.map((item, index) => (
          <MudWorldsTableItem
            key={ String(item.address.hash) + (isLoading ? index : '') }
            item={ item }
            isLoading={ isLoading }
          />
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default MudWorldsTable;
