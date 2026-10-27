// Modified by Quat Capital, 2026-10-27: continue runtime RU/KK/EN localization. GPL-3.0.
// Modified by Quat Capital, 2026-10-26: T18 reviewed literal localization. GPL-3.0.
import React from 'react';

import type { InteropMessage } from 'types/api/interop';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import TimeFormatToggle from 'ui/shared/time/TimeFormatToggle';

import InteropMessagesTableItem from './InteropMessagesTableItem';
import { useTranslation } from 'react-i18next';


interface Props {
  items?: Array<InteropMessage>;
  top: number;
  isLoading?: boolean;
}

const InteropMessagesTable = ({ items, top, isLoading }: Props) => {
  const { t: tQuat } = useTranslation();

  return (
    <TableRoot tableLayout="auto">
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader/>
          <TableColumnHeader>{ tQuat('l2Ui.message') }</TableColumnHeader>
          <TableColumnHeader>{ tQuat('l2Ui.timestamp') }<TimeFormatToggle/>
          </TableColumnHeader>
          <TableColumnHeader>{ tQuat('l2Ui.status') }</TableColumnHeader>
          <TableColumnHeader>{ tQuat('l2Ui.source_tx') }</TableColumnHeader>
          <TableColumnHeader>{ tQuat('l2Ui.destination_tx') }</TableColumnHeader>
          <TableColumnHeader>{ tQuat('l2Ui.sender') }</TableColumnHeader>
          <TableColumnHeader>In/Out</TableColumnHeader>
          <TableColumnHeader>{ tQuat('l2Ui.target') }</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items?.map((item, index) => (
          <InteropMessagesTableItem
            key={ item.init_transaction_hash + '_' + index }
            item={ item }
            isLoading={ isLoading }
          />
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default React.memo(InteropMessagesTable);
