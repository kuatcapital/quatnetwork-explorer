// Modified by Quat Capital, 2026-10-27: localized L2 and interop interface. GPL-3.0.
// Modified by Quat Capital, 2026-10-26: T18 reviewed literal localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { ArbitrumL2MessagesItem } from 'types/api/arbitrumL2';

import { layerLabels } from 'lib/rollups/utils';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import TimeFormatToggle from 'ui/shared/time/TimeFormatToggle';

import type { MessagesDirection } from './ArbitrumL2Messages';
import ArbitrumL2MessagesTableItem from './ArbitrumL2MessagesTableItem';

type Props = {
  items: Array<ArbitrumL2MessagesItem>;
  direction: MessagesDirection;
  top: number;
  isLoading?: boolean;
};

const ArbitrumL2MessagesTable = ({ items, direction, top, isLoading }: Props) => {
  const { t: tQuat } = useTranslation();

  return (
    <TableRoot tableLayout="auto" minW="950px">
      <TableHeaderSticky top={ top }>
        <TableRow>
          { direction === 'to-rollup' && <TableColumnHeader>{ tQuat('l2Ui.layer_block', { layer: layerLabels.parent }) }</TableColumnHeader> }
          { direction === 'from-rollup' && <TableColumnHeader>{ tQuat('common.from') }</TableColumnHeader> }
          <TableColumnHeader>{ tQuat('l2Ui.message_marker') }</TableColumnHeader>
          <TableColumnHeader>{ tQuat('l2Ui.layer_transaction', { layer: layerLabels.current }) }</TableColumnHeader>
          <TableColumnHeader>{ tQuat('l2Ui.timestamp') }<TimeFormatToggle/>
          </TableColumnHeader>
          <TableColumnHeader>{ tQuat('l2Ui.status') }</TableColumnHeader>
          <TableColumnHeader>{ tQuat('l2Ui.layer_transaction', { layer: layerLabels.parent }) }</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items.map((item, index) => (
          <ArbitrumL2MessagesTableItem
            key={ String(item.id) + (isLoading ? index : '') }
            item={ item }
            direction={ direction }
            isLoading={ isLoading }
          />
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default ArbitrumL2MessagesTable;
