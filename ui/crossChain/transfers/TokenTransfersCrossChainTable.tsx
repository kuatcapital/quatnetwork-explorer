// Modified by Quat Capital, 2026-10-26: T18 reviewed literal localization. GPL-3.0.
import { Flex } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { InterchainTransfer } from '@blockscout/interchain-indexer-types';

import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import TimeFormatToggle from 'ui/shared/time/TimeFormatToggle';

import TokenTransfersCrossChainTableItem from './TokenTransfersCrossChainTableItem';
import { getItemKey } from './utils';

interface Props {
  data: Array<InterchainTransfer>;
  isLoading?: boolean;
  top?: number;
  currentAddress?: string;
}

const TokenTransfersCrossChainTable = ({ data, isLoading, top, currentAddress }: Props) => {
  const { t: tQuat } = useTranslation();

  return (
    <AddressHighlightProvider>
      <TableRoot tableLayout="auto">
        <TableHeaderSticky top={ top }>
          <TableRow>
            <TableColumnHeader w="42px"/>
            { currentAddress && <TableColumnHeader w="44px"/> }
            <TableColumnHeader>Source token</TableColumnHeader>
            <TableColumnHeader/>
            <TableColumnHeader>Target token</TableColumnHeader>
            <TableColumnHeader>{ tQuat('transactions.source_tx') }</TableColumnHeader>
            <TableColumnHeader>Dest tx</TableColumnHeader>
            <TableColumnHeader>Protocol</TableColumnHeader>
            <TableColumnHeader>Message</TableColumnHeader>
            <TableColumnHeader>
              <Flex alignItems="center" flexWrap="nowrap">{ tQuat('common.timestamp') }<TimeFormatToggle/>
              </Flex>
            </TableColumnHeader>
          </TableRow>
        </TableHeaderSticky>
        <TableBody>
          { data.map((item, index) => (
            <TokenTransfersCrossChainTableItem
              key={ getItemKey(item, isLoading ? index : undefined) }
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

export default React.memo(TokenTransfersCrossChainTable);
