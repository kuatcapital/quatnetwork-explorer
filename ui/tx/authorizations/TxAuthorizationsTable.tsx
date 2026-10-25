// Modified by Quat Capital, 2026-10-25: runtime transaction interface localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { TxAuthorization } from 'types/api/transaction';

import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';

import TxAuthorizationsTableItem from './TxAuthorizationsTableItem';

interface Props {
  data: Array<TxAuthorization> | undefined;
  isLoading?: boolean;
}

const TxAuthorizationsTable = ({ data, isLoading }: Props) => {
  const { t: tTx } = useTranslation();
  return (
    <AddressHighlightProvider>
      <TableRoot>
        <TableHeaderSticky>
          <TableRow>
            <TableColumnHeader width="50%">{ tTx('transactions.authority') }</TableColumnHeader>
            <TableColumnHeader width="50%">{ tTx('transactions.delegated_address') }</TableColumnHeader>
            <TableColumnHeader width="120px">{ tTx('transactions.chain') }</TableColumnHeader>
            <TableColumnHeader width="120px">{ tTx('transactions.nonce') }</TableColumnHeader>
            <TableColumnHeader width="200px">{ tTx('common.status') }</TableColumnHeader>
          </TableRow>
        </TableHeaderSticky>
        <TableBody>
          { data?.map((item, index) => (
            <TxAuthorizationsTableItem key={ item.nonce.toString() + (isLoading ? index : '') } { ...item } isLoading={ isLoading }/>
          )) }
        </TableBody>
      </TableRoot>
    </AddressHighlightProvider>
  );
};

export default TxAuthorizationsTable;
