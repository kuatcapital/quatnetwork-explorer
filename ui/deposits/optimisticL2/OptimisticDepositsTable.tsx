// Modified by Quat Capital, 2026-10-26: localize validators, epochs and transfers. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { OptimisticL2DepositsItem } from 'types/api/optimisticL2';

import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import { layerLabels } from 'lib/rollups/utils';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import TimeFormatToggle from 'ui/shared/time/TimeFormatToggle';

import OptimisticDepositsTableItem from './OptimisticDepositsTableItem';

type Props = {
  items: Array<OptimisticL2DepositsItem>;
  top: number;
  isLoading?: boolean;
};

const OptimisticDepositsTable = ({ items, top, isLoading }: Props) => {
  const { t } = useTranslation();
  return (
    <AddressHighlightProvider>
      <TableRoot tableLayout="auto" minW="950px">
        <TableHeaderSticky top={ top }>
          <TableRow>
            <TableColumnHeader>{ t('networkTransfers.layer_block_no', { layer: layerLabels.parent }) }</TableColumnHeader>
            <TableColumnHeader>{ t('networkTransfers.layer_tx_hash', { layer: layerLabels.current }) }</TableColumnHeader>
            <TableColumnHeader>
              { t('networkTransfers.timestamp') }<TimeFormatToggle/>
            </TableColumnHeader>
            <TableColumnHeader>{ t('networkTransfers.layer_tx_hash', { layer: layerLabels.parent }) }</TableColumnHeader>
            <TableColumnHeader>{ t('networkTransfers.layer_tx_origin', { layer: layerLabels.parent }) }</TableColumnHeader>
            <TableColumnHeader isNumeric>{ t('networkTransfers.gas_limit') }</TableColumnHeader>
          </TableRow>
        </TableHeaderSticky>
        <TableBody>
          { items.map((item, index) => (
            <OptimisticDepositsTableItem key={ item.l2_transaction_hash + (isLoading ? index : '') } item={ item } isLoading={ isLoading }/>
          )) }
        </TableBody>
      </TableRoot>
    </AddressHighlightProvider>
  );
};

export default OptimisticDepositsTable;
