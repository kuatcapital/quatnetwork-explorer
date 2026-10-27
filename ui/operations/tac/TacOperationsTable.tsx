// Modified by Quat Capital, 2026-10-27: continue runtime RU/KK/EN localization. GPL-3.0.
// Modified by Quat Capital, 2026-10-26: T18 reviewed literal localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type * as tac from '@blockscout/tac-operation-lifecycle-types';

import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import TimeFormatToggle from 'ui/shared/time/TimeFormatToggle';

import TacOperationsTableItem from './TacOperationsTableItem';

type Props = {
  items: Array<tac.OperationBriefDetails>;
  isLoading?: boolean;
};

const TacOperationsTable = ({ items, isLoading }: Props) => {
  const { t: tQuat } = useTranslation();

  return (
    <AddressHighlightProvider>
      <TableRoot minW="950px">
        <TableHeaderSticky top={ 68 }>
          <TableRow>
            <TableColumnHeader w="200px">{ tQuat('l2Ui.status') }</TableColumnHeader>
            <TableColumnHeader w="100%">{ tQuat('l2Ui.operation') }</TableColumnHeader>
            <TableColumnHeader w="200px">{ tQuat('l2Ui.timestamp') }<TimeFormatToggle/>
            </TableColumnHeader>
            <TableColumnHeader w="250px">{ tQuat('l2Ui.sender') }</TableColumnHeader>
          </TableRow>
        </TableHeaderSticky>
        <TableBody>
          { items.map((item, index) => (
            <TacOperationsTableItem key={ String(item.operation_id) + (isLoading ? index : '') } item={ item } isLoading={ isLoading }/>
          )) }
        </TableBody>
      </TableRoot>
    </AddressHighlightProvider>
  );
};

export default TacOperationsTable;
