// Modified by Quat Capital, 2026-10-25: runtime transaction interface localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { InternalTransaction } from 'types/api/internalTransaction';

import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import { useMultichainContext } from 'lib/contexts/multichain';
import { currencyUnits } from 'lib/units';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import TimeFormatToggle from 'ui/shared/time/TimeFormatToggle';

import InternalTxsTableItem from './InternalTxsTableItem';

interface Props {
  data: Array<InternalTransaction>;
  currentAddress?: string;
  isLoading?: boolean;
  top?: number;
  showBlockInfo?: boolean;
}

const InternalTxsTable = ({ data, currentAddress, isLoading, top, showBlockInfo = true }: Props) => {
  const { t: tTx } = useTranslation();
  const multichainContext = useMultichainContext();
  const chainData = multichainContext?.chain;

  return (
    <AddressHighlightProvider>
      <TableRoot minW="900px">
        <TableHeaderSticky top={ top ?? 68 }>
          <TableRow>
            { chainData && <TableColumnHeader width="38px"></TableColumnHeader> }
            <TableColumnHeader width="280px">
              { tTx('transactions.parent_hash') }<TimeFormatToggle/>
            </TableColumnHeader>
            <TableColumnHeader width="15%">{ tTx('common.type') }</TableColumnHeader>
            { showBlockInfo && <TableColumnHeader width="15%">{ tTx('common.block') }</TableColumnHeader> }
            <TableColumnHeader width="50%">{ tTx('transactions.from_to') }</TableColumnHeader>
            <TableColumnHeader width="20%" isNumeric>
              { tTx('transactions.value_amount') }{ currencyUnits.ether }
            </TableColumnHeader>
          </TableRow>
        </TableHeaderSticky>
        <TableBody>
          { data.map((item, index) => (
            <InternalTxsTableItem
              key={ item.transaction_hash + '_' + index }
              { ...item }
              currentAddress={ currentAddress }
              isLoading={ isLoading }
              showBlockInfo={ showBlockInfo }
              chainData={ chainData }
            />
          )) }
        </TableBody>
      </TableRoot>
    </AddressHighlightProvider>

  );
};

export default InternalTxsTable;
