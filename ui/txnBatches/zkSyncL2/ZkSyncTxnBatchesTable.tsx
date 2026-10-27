// Modified by Quat Capital, 2026-10-27: continue runtime RU/KK/EN localization. GPL-3.0.
// Modified by Quat Capital, 2026-10-26: T18 reviewed literal localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { ZkSyncBatchesItem } from 'types/api/zkSyncL2';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import TimeFormatToggle from 'ui/shared/time/TimeFormatToggle';

import ZkSyncTxnBatchesTableItem from './ZkSyncTxnBatchesTableItem';

type Props = {
  items: Array<ZkSyncBatchesItem>;
  top: number;
  isLoading?: boolean;
};

const ZkSyncTxnBatchesTable = ({ items, top, isLoading }: Props) => {
  const { t: tQuat } = useTranslation();

  return (
    <TableRoot minW="1000px">
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader width="40%">{ tQuat('l2Ui.batch_marker') }</TableColumnHeader>
          <TableColumnHeader width="60%">{ tQuat('common.status') }</TableColumnHeader>
          <TableColumnHeader width="180px">{ tQuat('common.timestamp') }<TimeFormatToggle/>
          </TableColumnHeader>
          <TableColumnHeader width="120px">{ tQuat('addresses.transaction_count') }</TableColumnHeader>
          <TableColumnHeader width="210px">{ tQuat('l2Ui.commit_tx') }</TableColumnHeader>
          <TableColumnHeader width="210px">{ tQuat('l2Ui.prove_tx') }</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items.map((item, index) => (
          <ZkSyncTxnBatchesTableItem
            key={ item.number + (isLoading ? String(index) : '') }
            item={ item }
            isLoading={ isLoading }
          />
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default ZkSyncTxnBatchesTable;
