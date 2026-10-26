// Modified by Quat Capital, 2026-10-26: localize validators, epochs and transfers. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { OptimisticL2WithdrawalsItem } from 'types/api/optimisticL2';

import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import { layerLabels } from 'lib/rollups/utils';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import TimeFormatToggle from 'ui/shared/time/TimeFormatToggle';

import OptimisticL2WithdrawalsTableItem from './OptimisticL2WithdrawalsTableItem';

type Props = {
  items: Array<OptimisticL2WithdrawalsItem>;
  top: number;
  isLoading?: boolean;
};

const OptimisticL2WithdrawalsTable = ({ items, top, isLoading }: Props) => {
  const { t } = useTranslation();
  return (
    <AddressHighlightProvider>
      <TableRoot tableLayout="auto" minW="950px">
        <TableHeaderSticky top={ top }>
          <TableRow>
            <TableColumnHeader>{ t('networkTransfers.msg_nonce') }</TableColumnHeader>
            <TableColumnHeader>{ t('networkTransfers.from') }</TableColumnHeader>
            <TableColumnHeader>{ t('networkTransfers.layer_tx_hash', { layer: layerLabels.current }) }</TableColumnHeader>
            <TableColumnHeader>
              { t('networkTransfers.timestamp') }<TimeFormatToggle/>
            </TableColumnHeader>
            <TableColumnHeader>{ t('networkTransfers.status') }</TableColumnHeader>
            <TableColumnHeader>{ t('networkTransfers.layer_tx_hash', { layer: layerLabels.parent }) }</TableColumnHeader>
            <TableColumnHeader>{ t('networkTransfers.time_left') }</TableColumnHeader>
          </TableRow>
        </TableHeaderSticky>
        <TableBody>
          { items.map((item, index) => (
            <OptimisticL2WithdrawalsTableItem
              key={ String(item.msg_nonce_version) + item.msg_nonce + (isLoading ? index : '') }
              item={ item }
              isLoading={ isLoading }
            />
          )) }
        </TableBody>
      </TableRoot>
    </AddressHighlightProvider>
  );
};

export default OptimisticL2WithdrawalsTable;
