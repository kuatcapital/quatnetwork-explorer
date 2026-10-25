// Modified by Quat Capital, 2026-10-25: runtime transaction interface localization. GPL-3.0.
import { Box } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { FheOperation } from 'types/api/fheOperations';

import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import { TableBody, TableColumnHeader, TableHeader, TableRoot, TableRow } from 'toolkit/chakra/table';
import TxFHEOperationsTableItem from 'ui/tx/fheOperations/TxFHEOperationsTableItem';

interface Props {
  data: Array<FheOperation>;
  isLoading?: boolean;
}

const TxFHEOperationsTable = ({ data, isLoading }: Props) => {
  const { t: tTx } = useTranslation();
  return (
    <AddressHighlightProvider>
      <Box maxW="100%" overflowX="auto" hideBelow="lg">
        <TableRoot tableLayout="fixed" minWidth="900px" w="100%">
          <TableHeader>
            <TableRow>
              <TableColumnHeader width="10%">{ tTx('transactions.index') }</TableColumnHeader>
              <TableColumnHeader width="15%">{ tTx('transactions.operation') }</TableColumnHeader>
              <TableColumnHeader width="12%">{ tTx('common.type') }</TableColumnHeader>
              <TableColumnHeader width="12%">{ tTx('transactions.fhe_type') }</TableColumnHeader>
              <TableColumnHeader width="12%">{ tTx('transactions.mode') }</TableColumnHeader>
              <TableColumnHeader width="12%">{ tTx('transactions.hcu_cost') }</TableColumnHeader>
              <TableColumnHeader width="12%">{ tTx('transactions.hcu_depth') }</TableColumnHeader>
              <TableColumnHeader width="24%">{ tTx('transactions.caller') }</TableColumnHeader>
            </TableRow>
          </TableHeader>
          <TableBody>
            { data.map((op) => (
              <TxFHEOperationsTableItem
                key={ op.log_index }
                { ...op }
                isLoading={ isLoading }
              />
            )) }
          </TableBody>
        </TableRoot>
      </Box>
    </AddressHighlightProvider>
  );
};

export default React.memo(TxFHEOperationsTable);
