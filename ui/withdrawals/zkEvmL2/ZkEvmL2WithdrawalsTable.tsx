// Modified by Quat Capital, 2026-10-26: localize validators, epochs and transfers. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { ZkEvmL2WithdrawalsItem } from 'types/api/zkEvmL2';

import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import { layerLabels } from 'lib/rollups/utils';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import TimeFormatToggle from 'ui/shared/time/TimeFormatToggle';

import ZkEvmL2WithdrawalsTableItem from './ZkEvmL2WithdrawalsTableItem';

type Props = {
  items: Array<ZkEvmL2WithdrawalsItem>;
  top: number;
  isLoading?: boolean;
};

const ZkEvmL2WithdrawalsTable = ({ items, top, isLoading }: Props) => {
  const { t } = useTranslation();
  return (
    <AddressHighlightProvider>
      <TableRoot tableLayout="auto" minW="950px">
        <TableHeaderSticky top={ top }>
          <TableRow>
            <TableColumnHeader>{ t('networkTransfers.block') }</TableColumnHeader>
            <TableColumnHeader>{ t('networkTransfers.index') }</TableColumnHeader>
            <TableColumnHeader>{ t('networkTransfers.layer_tx_hash', { layer: layerLabels.current }) }</TableColumnHeader>
            <TableColumnHeader>
              { t('networkTransfers.timestamp') }<TimeFormatToggle/>
            </TableColumnHeader>
            <TableColumnHeader>{ t('networkTransfers.layer_tx_hash', { layer: layerLabels.parent }) }</TableColumnHeader>
            <TableColumnHeader isNumeric>{ t('networkTransfers.value') }</TableColumnHeader>
            <TableColumnHeader>{ t('networkTransfers.token') }</TableColumnHeader>
          </TableRow>
        </TableHeaderSticky>
        <TableBody>
          { items.map((item, index) => (
            <ZkEvmL2WithdrawalsTableItem key={ String(item.index) + (isLoading ? index : '') } item={ item } isLoading={ isLoading }/>
          )) }
        </TableBody>
      </TableRoot>
    </AddressHighlightProvider>
  );
};

export default ZkEvmL2WithdrawalsTable;
