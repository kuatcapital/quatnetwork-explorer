// Modified by Quat Capital, 2026-10-27: localized L2 and interop interface. GPL-3.0.
// Modified by Quat Capital, 2026-10-26: T18 reviewed literal localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { ArbitrumL2TxnBatchesItem } from 'types/api/arbitrumL2';

import { layerLabels } from 'lib/rollups/utils';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import TimeFormatToggle from 'ui/shared/time/TimeFormatToggle';

import ArbitrumL2TxnBatchesTableItem from './ArbitrumL2TxnBatchesTableItem';

type Props = {
  items: Array<ArbitrumL2TxnBatchesItem>;
  top: number;
  isLoading?: boolean;
};

const ArbitrumL2TxnBatchesTable = ({ items, top, isLoading }: Props) => {
  const { t: tQuat } = useTranslation();

  return (
    <TableRoot tableLayout="auto" minW="1000px">
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader>{ tQuat('l2Ui.batch_marker') }</TableColumnHeader>
          <TableColumnHeader>{ tQuat('l2Ui.layer_status', { layer: layerLabels.parent }) }</TableColumnHeader>
          <TableColumnHeader>{ tQuat('l2Ui.layer_block', { layer: layerLabels.parent }) }</TableColumnHeader>
          <TableColumnHeader>{ tQuat('l2Ui.block_count') }</TableColumnHeader>
          <TableColumnHeader>{ tQuat('l2Ui.layer_transaction', { layer: layerLabels.parent }) }</TableColumnHeader>
          <TableColumnHeader>{ tQuat('common.timestamp') }<TimeFormatToggle/>
          </TableColumnHeader>
          <TableColumnHeader>{ tQuat('addresses.transaction_count') }</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items.map((item, index) => (
          <ArbitrumL2TxnBatchesTableItem
            key={ item.number + (isLoading ? String(index) : '') }
            item={ item }
            isLoading={ isLoading }
          />
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default ArbitrumL2TxnBatchesTable;
