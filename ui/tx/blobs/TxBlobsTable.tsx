// Modified by Quat Capital, 2026-10-25: runtime transaction interface localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { TxBlob } from 'types/api/blobs';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';

import TxBlobsTableItem from './TxBlobsTableItem';

interface Props {
  data: Array<TxBlob>;
  top: number;
  isLoading?: boolean;
}

const TxBlobsTable = ({ data, top, isLoading }: Props) => {
  const { t: tTx } = useTranslation();

  return (
    <TableRoot>
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader width="60%">{ tTx('transactions.blob_hash') }</TableColumnHeader>
          <TableColumnHeader width="20%">{ tTx('transactions.data_type') }</TableColumnHeader>
          <TableColumnHeader width="20%">{ tTx('blocks.size_bytes') }</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { data.map((item, index) => (
          <TxBlobsTableItem key={ item.hash + (isLoading ? index : '') } data={ item } isLoading={ isLoading }/>
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default TxBlobsTable;
