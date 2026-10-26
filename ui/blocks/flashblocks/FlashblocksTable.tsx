// Modified by Quat Capital, 2026-10-26: localize block, gas and statistics UI. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { FlashblockItem } from 'types/client/flashblocks';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import * as SocketNewItemsNotice from 'ui/shared/SocketNewItemsNotice';

import FlashblocksTableItem from './FlashblocksTableItem';

interface Props {
  items: Array<FlashblockItem>;
  newItemsNum: number | undefined;
  showAlertError?: boolean;
  onAlertLinkClick?: () => void;
}

const FlashblocksTable = ({ items, newItemsNum, showAlertError, onAlertLinkClick }: Props) => {
  const { t } = useTranslation();
  return (
    <TableRoot>
      <TableHeaderSticky top={ 0 }>
        <TableRow>
          <TableColumnHeader width="50%">
            { t('flashblocks.block') } </TableColumnHeader>
          <TableColumnHeader width="20%" isNumeric>
            { t('flashblocks.txn') } </TableColumnHeader>
          <TableColumnHeader width="30%" isNumeric>
            { t('blockDetails.gas_used') } </TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { (newItemsNum !== undefined || showAlertError) && (
          <SocketNewItemsNotice.Desktop
            type="flashblock"
            num={ newItemsNum }
            showErrorAlert={ showAlertError }
            onLinkClick={ onAlertLinkClick }
          />
        ) }
        { items.map((item) => (
          <FlashblocksTableItem
            key={ `${ item.block_number }-${ item.index }` }
            data={ item }
          />
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default React.memo(FlashblocksTable);
