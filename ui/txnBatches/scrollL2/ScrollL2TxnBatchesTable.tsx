// Modified by Quat Capital, 2026-10-27: continue runtime RU/KK/EN localization. GPL-3.0.
// Modified by Quat Capital, 2026-10-26: T18 reviewed literal localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { ScrollL2TxnBatch } from 'types/api/scrollL2';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import TimeFormatToggle from 'ui/shared/time/TimeFormatToggle';

import ScrollL2TxnBatchesTableItem from './ScrollL2TxnBatchesTableItem';

type Props = {
  items: Array<ScrollL2TxnBatch>;
  top: number;
  isLoading?: boolean;
};

const ScrollL2TxnBatchesTable = ({ items, top, isLoading }: Props) => {
  const { t: tQuat } = useTranslation();

  return (
    <TableRoot tableLayout="auto" minW="1000px">
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader>{ tQuat('l2Ui.batch_marker') }</TableColumnHeader>
          <TableColumnHeader>{ tQuat('l2Ui.container') }</TableColumnHeader>
          <TableColumnHeader>{ tQuat('common.status') }</TableColumnHeader>
          <TableColumnHeader>{ tQuat('l2Ui.committed_block') }</TableColumnHeader>
          <TableColumnHeader>{ tQuat('l2Ui.committed_txn_hash') }</TableColumnHeader>
          <TableColumnHeader>{ tQuat('common.timestamp') }<TimeFormatToggle/>
          </TableColumnHeader>
          <TableColumnHeader>{ tQuat('l2Ui.finalized_block') }</TableColumnHeader>
          <TableColumnHeader>{ tQuat('l2Ui.finalized_txn_hash') }</TableColumnHeader>
          <TableColumnHeader isNumeric>{ tQuat('common.blocks') }</TableColumnHeader>
          <TableColumnHeader isNumeric>{ tQuat('l2Ui.txn') }</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items.map((item, index) => (
          <ScrollL2TxnBatchesTableItem
            key={ item.number + (isLoading ? String(index) : '') }
            item={ item }
            isLoading={ isLoading }
          />
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default ScrollL2TxnBatchesTable;
