// Modified by Quat Capital, 2026-10-27: localized L2 and interop interface. GPL-3.0.
// Modified by Quat Capital, 2026-10-26: T18 reviewed literal localization. GPL-3.0.
import React from 'react';

import type { OptimisticL2OutputRootsItem } from 'types/api/optimisticL2';

import { layerLabels } from 'lib/rollups/utils';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import TimeFormatToggle from 'ui/shared/time/TimeFormatToggle';

import OptimisticL2OutputRootsTableItem from './OptimisticL2OutputRootsTableItem';
import { useTranslation } from 'react-i18next';


type Props = {
  items: Array<OptimisticL2OutputRootsItem>;
  top: number;
  isLoading?: boolean;
};

const OptimisticL2OutputRootsTable = ({ items, top, isLoading }: Props) => {
  const { t: tQuat } = useTranslation();

  return (
    <TableRoot minW="900px">
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader width="160px">{ layerLabels.current }{ ' ' }{ tQuat('l2Ui.output_index') }</TableColumnHeader>
          <TableColumnHeader width="20%">{ tQuat('l2Ui.timestamp') }<TimeFormatToggle/>
          </TableColumnHeader>
          <TableColumnHeader width="20%">{ tQuat('l2Ui.layer_block_marker', { layer: layerLabels.current }) }</TableColumnHeader>
          <TableColumnHeader width="30%">{ tQuat('l2Ui.layer_txn_hash', { layer: layerLabels.parent }) }</TableColumnHeader>
          <TableColumnHeader width="30%">{ tQuat('l2Ui.output_root') }</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items.map((item, index) => (
          <OptimisticL2OutputRootsTableItem
            key={ item.l2_output_index + (Number(isLoading ? index : '') ? String(index) : '') }
            item={ item }
            isLoading={ isLoading }
          />
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default OptimisticL2OutputRootsTable;
