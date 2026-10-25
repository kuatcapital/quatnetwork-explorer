// Modified by Quat Capital, 2026-10-25: runtime transaction interface localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { TxStateChange } from 'types/api/txStateChanges';

import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import TxStateTableItem from 'ui/tx/state/TxStateTableItem';

interface Props {
  data: Array<TxStateChange>;
  isLoading?: boolean;
  top: number;
}

const TxStateTable = ({ data, isLoading, top }: Props) => {
  const { t: tTx } = useTranslation();
  return (
    <AddressHighlightProvider>
      <TableRoot minWidth="1000px" w="100%">
        <TableHeaderSticky top={ top }>
          <TableRow>
            <TableColumnHeader width="140px">{ tTx('common.type') }</TableColumnHeader>
            <TableColumnHeader width="160px">{ tTx('common.address') }</TableColumnHeader>
            <TableColumnHeader width="33%" isNumeric>{ tTx('transactions.before') }</TableColumnHeader>
            <TableColumnHeader width="33%" isNumeric>{ tTx('transactions.after') }</TableColumnHeader>
            <TableColumnHeader width="33%" isNumeric>{ tTx('transactions.change') }</TableColumnHeader>
            <TableColumnHeader width="150px" minW="80px" maxW="150px">{ tTx('transactions.token_id') }</TableColumnHeader>
          </TableRow>
        </TableHeaderSticky>
        <TableBody>
          { data.map((item, index) => <TxStateTableItem data={ item } key={ index } isLoading={ isLoading }/>) }
        </TableBody>
      </TableRoot>
    </AddressHighlightProvider>
  );
};

export default React.memo(TxStateTable);
