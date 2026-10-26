// Modified by Quat Capital, 2026-10-26: localize validators, epochs and transfers. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { DepositsItem } from 'types/api/deposits';

import config from 'configs/app';
import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import useLazyRenderedList from 'lib/hooks/useLazyRenderedList';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import TimeFormatToggle from 'ui/shared/time/TimeFormatToggle';

import BeaconChainDepositsTableItem from './BeaconChainDepositsTableItem';

const feature = config.features.beaconChain;

type Props = {
  top: number;
  isLoading?: boolean;
  items: Array<DepositsItem>;
  view: 'list' | 'address' | 'block';
};

const BeaconChainDepositsTable = ({ items, isLoading, top, view }: Props) => {
  const { t } = useTranslation();
  const { cutRef, renderedItemsNum } = useLazyRenderedList(items, !isLoading);

  if (!feature.isEnabled || feature.withdrawalsOnly) {
    return null;
  }

  return (
    <AddressHighlightProvider>
      <TableRoot minW="1100px">
        <TableHeaderSticky top={ top }>
          <TableRow>
            <TableColumnHeader w="190px">{ t('networkTransfers.tx_hash') }</TableColumnHeader>
            { view !== 'block' && <TableColumnHeader>{ t('networkTransfers.block') }</TableColumnHeader> }
            { view !== 'block' && <TableColumnHeader w="180px">{ t('networkTransfers.timestamp') }<TimeFormatToggle/></TableColumnHeader> }
            <TableColumnHeader>{ t('networkTransfers.value_currency', { symbol: feature.currency.symbol }) }</TableColumnHeader>
            { view !== 'address' && <TableColumnHeader w="200px">{ t('networkTransfers.from') }</TableColumnHeader> }
            <TableColumnHeader>{ t('networkTransfers.pubkey') }</TableColumnHeader>
            <TableColumnHeader>{ t('networkTransfers.signature') }</TableColumnHeader>
            <TableColumnHeader>{ t('networkTransfers.status') }</TableColumnHeader>
          </TableRow>
        </TableHeaderSticky>
        <TableBody>
          { items.slice(0, renderedItemsNum).map((item, index) => (
            <BeaconChainDepositsTableItem key={ item.index + (isLoading ? String(index) : '') } item={ item } view={ view } isLoading={ isLoading }/>
          )) }
          <TableRow ref={ cutRef }/>
        </TableBody>
      </TableRoot>
    </AddressHighlightProvider>
  );
};

export default BeaconChainDepositsTable;
