// Modified by Quat Capital, 2026-10-27: continue runtime RU/KK/EN localization. GPL-3.0.
// Modified by Quat Capital, 2026-10-26: T18 reviewed literal localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { ZkEvmL2TxnBatchesItem } from 'types/api/zkEvmL2';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import TimeFormatToggle from 'ui/shared/time/TimeFormatToggle';

import ZkEvmTxnBatchesTableItem from './ZkEvmTxnBatchesTableItem';

type Props = {
  items: Array<ZkEvmL2TxnBatchesItem>;
  top: number;
  isLoading?: boolean;
};

const ZkEvmTxnBatchesTable = ({ items, top, isLoading }: Props) => {
  const { t: tQuat } = useTranslation();

  return (
    <TableRoot minW="1100px">
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader width="40%">{ tQuat('l2Ui.batch_marker') }</TableColumnHeader>
          <TableColumnHeader width="60%">{ tQuat('common.status') }</TableColumnHeader>
          <TableColumnHeader width="180px">{ tQuat('common.timestamp') }<TimeFormatToggle/>
          </TableColumnHeader>
          <TableColumnHeader width="100px">{ tQuat('addresses.transaction_count') }</TableColumnHeader>
          <TableColumnHeader width="230px">{ tQuat('transactions.verify_hash') }</TableColumnHeader>
          <TableColumnHeader width="230px">{ tQuat('l2Ui.sequence_hash') }</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items.map((item, index) => (
          <ZkEvmTxnBatchesTableItem
            key={ item.number + (isLoading ? String(index) : '') }
            item={ item }
            isLoading={ isLoading }
          />
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default ZkEvmTxnBatchesTable;
