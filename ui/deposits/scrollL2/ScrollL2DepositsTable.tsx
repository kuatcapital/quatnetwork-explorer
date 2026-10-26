// Modified by Quat Capital, 2026-10-26: localize validators, epochs and transfers. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { ScrollL2MessageItem } from 'types/api/scrollL2';

import config from 'configs/app';
import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import { layerLabels } from 'lib/rollups/utils';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import TimeFormatToggle from 'ui/shared/time/TimeFormatToggle';

import ScrollL2DepositsTableItem from './ScrollL2DepositsTableItem';

type Props = {
  items: Array<ScrollL2MessageItem>;
  top: number;
  isLoading?: boolean;
};

const ScrollL2DepositsTable = ({ items, top, isLoading }: Props) => {
  const { t } = useTranslation();
  return (
    <AddressHighlightProvider>
      <TableRoot tableLayout="auto" minW="950px">
        <TableHeaderSticky top={ top }>
          <TableRow>
            <TableColumnHeader>{ t('networkTransfers.layer_block', { layer: layerLabels.parent }) }</TableColumnHeader>
            <TableColumnHeader>{ t('networkTransfers.index') }</TableColumnHeader>
            <TableColumnHeader>{ t('networkTransfers.layer_tx_hash', { layer: layerLabels.parent }) }</TableColumnHeader>
            <TableColumnHeader>
              { t('networkTransfers.timestamp') }<TimeFormatToggle/>
            </TableColumnHeader>
            <TableColumnHeader>{ t('networkTransfers.layer_tx_hash', { layer: layerLabels.current }) }</TableColumnHeader>
            <TableColumnHeader isNumeric>{ t('networkTransfers.value') }{ config.chain.currency.symbol }</TableColumnHeader>
          </TableRow>
        </TableHeaderSticky>
        <TableBody>
          { items.map((item, index) => (
            <ScrollL2DepositsTableItem key={ String(item.id) + (isLoading ? index : '') } item={ item } isLoading={ isLoading }/>
          )) }
        </TableBody>
      </TableRoot>
    </AddressHighlightProvider>
  );
};

export default ScrollL2DepositsTable;
