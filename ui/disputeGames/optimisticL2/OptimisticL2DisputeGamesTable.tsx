// Modified by Quat Capital, 2026-10-27: localized L2 and interop interface. GPL-3.0.
// Modified by Quat Capital, 2026-10-26: T18 reviewed literal localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { OptimisticL2DisputeGamesItem } from 'types/api/optimisticL2';

import { layerLabels } from 'lib/rollups/utils';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import TimeFormatToggle from 'ui/shared/time/TimeFormatToggle';

import OptimisticL2DisputeGamesTableItem from './OptimisticL2DisputeGamesTableItem';

type Props = {
  items: Array<OptimisticL2DisputeGamesItem>;
  top: number;
  isLoading?: boolean;
};

const OptimisticL2DisputeGamesTable = ({ items, top, isLoading }: Props) => {
  const { t: tQuat } = useTranslation();

  return (
    <TableRoot tableLayout="auto" minW="950px">
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader>{ tQuat('l2Ui.index') }</TableColumnHeader>
          <TableColumnHeader>{ tQuat('l2Ui.game_type') }</TableColumnHeader>
          <TableColumnHeader>{ tQuat('l2Ui.address') }</TableColumnHeader>
          <TableColumnHeader>{ tQuat('l2Ui.layer_block_marker', { layer: layerLabels.current }) }</TableColumnHeader>
          <TableColumnHeader>{ tQuat('l2Ui.timestamp') }<TimeFormatToggle/>
          </TableColumnHeader>
          <TableColumnHeader>{ tQuat('l2Ui.status') }</TableColumnHeader>
          <TableColumnHeader>{ tQuat('l2Ui.resolved') }<TimeFormatToggle/>
          </TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items.map((item, index) => (
          <OptimisticL2DisputeGamesTableItem
            key={ String(item.index) + (isLoading ? index : '') }
            item={ item }
            isLoading={ isLoading }
          />
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default OptimisticL2DisputeGamesTable;
