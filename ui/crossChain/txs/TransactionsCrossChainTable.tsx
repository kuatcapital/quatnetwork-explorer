// Modified by Quat Capital, 2026-10-27: complete runtime multichain localization. GPL-3.0.
import { Flex } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { InterchainMessage } from '@blockscout/interchain-indexer-types';

import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import { TableBody, TableColumnHeader, TableHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import TimeFormatToggle from 'ui/shared/time/TimeFormatToggle';

import TransactionsCrossChainTableItem from './TransactionsCrossChainTableItem';

interface Props {
  data: Array<InterchainMessage>;
  isLoading?: boolean;
  top?: number;
  stickyHeader?: boolean;
  currentAddress?: string;
}

const TransactionsCrossChainTable = ({ data, isLoading, top, stickyHeader, currentAddress }: Props) => {
  const { t: tQuat } = useTranslation();

  const TableHeaderComponent = stickyHeader ? TableHeaderSticky : TableHeader;

  return (
    <AddressHighlightProvider>
      <TableRoot tableLayout="auto">
        <TableHeaderComponent top={ stickyHeader ? top : undefined }>
          <TableRow>
            <TableColumnHeader w="42px"/>
            { currentAddress && <TableColumnHeader w="44px"/> }
            <TableColumnHeader>{ tQuat('multiUi.message') }</TableColumnHeader>
            <TableColumnHeader>
              <Flex alignItems="center" flexWrap="nowrap">{ tQuat('common.timestamp') }<TimeFormatToggle/>
              </Flex>
            </TableColumnHeader>
            <TableColumnHeader>{ tQuat('multiUi.message_sender') }</TableColumnHeader>
            <TableColumnHeader>{ tQuat('transactions.source_tx') }</TableColumnHeader>
            <TableColumnHeader>{ tQuat('multiUi.destination_tx_short') }</TableColumnHeader>
            <TableColumnHeader>{ tQuat('multiUi.transfers_short') }</TableColumnHeader>
            <TableColumnHeader>{ tQuat('transactions.sender') }</TableColumnHeader>
            <TableColumnHeader/>
            <TableColumnHeader>{ tQuat('multiUi.recipient') }</TableColumnHeader>
            <TableColumnHeader>{ tQuat('multiUi.protocol') }</TableColumnHeader>
          </TableRow>
        </TableHeaderComponent>
        <TableBody>
          { data.map((item, index) => (
            <TransactionsCrossChainTableItem
              key={ item.message_id + (isLoading ? String(index) : '') }
              data={ item }
              isLoading={ isLoading }
              currentAddress={ currentAddress }
            />
          )) }
        </TableBody>
      </TableRoot>
    </AddressHighlightProvider>
  );
};

export default React.memo(TransactionsCrossChainTable);
