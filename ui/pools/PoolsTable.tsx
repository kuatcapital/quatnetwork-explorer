// Modified by Quat Capital, 2026-10-27: T18 reviewed literal localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { Pool } from 'types/api/pools';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';

import PoolsTableItem from './PoolsTableItem';

type Props = {
  items: Array<Pool>;
  page: number;
  isLoading?: boolean;
  top?: number;
};

const PoolsTable = ({ items, page, isLoading, top }: Props) => {
  const { t: tQuat } = useTranslation();

  return (
    <TableRoot minWidth="900px">
      <TableHeaderSticky top={ top ?? ACTION_BAR_HEIGHT_DESKTOP }>
        <TableRow>
          <TableColumnHeader width="70%">{ tQuat('suppUi.pool') }</TableColumnHeader>
          <TableColumnHeader width="30%">DEX </TableColumnHeader>
          <TableColumnHeader width="130px" isNumeric>{ tQuat('suppUi.liquidity') }</TableColumnHeader>
          <TableColumnHeader width="75px" isNumeric>{ tQuat('suppUi.view_in') }</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items.map((item, index) => (
          <PoolsTableItem key={ item.pool_id + (isLoading ? index : '') } item={ item } index={ index } page={ page } isLoading={ isLoading }/>
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default PoolsTable;
