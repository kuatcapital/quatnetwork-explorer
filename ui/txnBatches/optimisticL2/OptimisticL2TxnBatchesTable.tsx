// Modified by Quat Capital, 2026-10-27: localized L2 and interop interface. GPL-3.0.
// Modified by Quat Capital, 2026-10-26: T18 reviewed literal localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { OptimisticL2TxnBatchesItem } from 'types/api/optimisticL2';

import { layerLabels } from 'lib/rollups/utils';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import TimeFormatToggle from 'ui/shared/time/TimeFormatToggle';

import OptimisticL2TxnBatchesTableItem from './OptimisticL2TxnBatchesTableItem';

type Props = {
  items: Array<OptimisticL2TxnBatchesItem>;
  top: number;
  isLoading?: boolean;
};

const OptimisticL2TxnBatchesTable = ({ items, top, isLoading }: Props) => {
  const { t: tQuat } = useTranslation();

  return (
    <TableRoot tableLayout="auto" minW="850px">
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader>{ tQuat('l2Ui.batch_id') }</TableColumnHeader>
          <TableColumnHeader>{ tQuat('l2Ui.storage') }</TableColumnHeader>
          <TableColumnHeader>{ tQuat('common.timestamp') }<TimeFormatToggle/>
          </TableColumnHeader>
          <TableColumnHeader isNumeric>{ tQuat('l2Ui.layer_txn_count', { layer: layerLabels.parent }) }</TableColumnHeader>
          <TableColumnHeader isNumeric>{ tQuat('l2Ui.layer_blocks', { layer: layerLabels.current }) }</TableColumnHeader>
          <TableColumnHeader isNumeric>{ tQuat('l2Ui.txn') }</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items.map((item, index) => (
          <OptimisticL2TxnBatchesTableItem
            key={ item.number + (isLoading ? String(index) : '') }
            item={ item }
            isLoading={ isLoading }
          />
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default OptimisticL2TxnBatchesTable;
