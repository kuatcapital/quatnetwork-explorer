// Modified by Quat Capital, 2026-10-26: T18 reviewed literal localization. GPL-3.0.
// Modified by Quat Capital, 2026-10-26: T18 reviewed literal localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { UserOpsItem } from 'types/api/userOps';

import config from 'configs/app';
import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import { useMultichainContext } from 'lib/contexts/multichain';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import TimeFormatToggle from 'ui/shared/time/TimeFormatToggle';

import UserOpsTableItem from './UserOpsTableItem';

type Props = {
  items: Array<UserOpsItem>;
  isLoading?: boolean;
  top: number;
  showTx: boolean;
  showSender: boolean;
};

const UserOpsTable = ({ items, isLoading, top, showTx, showSender }: Props) => {
  const { t: tQuat } = useTranslation();

  const multichainContext = useMultichainContext();
  const chainData = multichainContext?.chain;
  const chainConfig = (multichainContext?.chain.app_config || config);

  return (
    <AddressHighlightProvider>
      <TableRoot minW="1000px">
        <TableHeaderSticky top={ top }>
          <TableRow>
            { chainData && <TableColumnHeader width="38px"></TableColumnHeader> }
            <TableColumnHeader w="60%">{ tQuat('operationsUi.short_hash') }</TableColumnHeader>
            <TableColumnHeader w="180px">{ tQuat('common.timestamp') }<TimeFormatToggle/>
            </TableColumnHeader>
            <TableColumnHeader w="140px">{ tQuat('common.status') }</TableColumnHeader>
            { showSender && <TableColumnHeader w="160px">{ tQuat('transactions.sender') }</TableColumnHeader> }
            { showTx && <TableColumnHeader w="160px">{ tQuat('operationsUi.tx_hash') }</TableColumnHeader> }
            <TableColumnHeader w="40%">{ tQuat('common.block') }</TableColumnHeader>
            { !chainConfig.UI.views.tx.hiddenFields?.tx_fee &&
          <TableColumnHeader w="120px" isNumeric>{ tQuat('operationsUi.fee_currency', { currency: chainConfig.chain.currency.symbol }) }</TableColumnHeader> }
          </TableRow>
        </TableHeaderSticky>
        <TableBody>
          { items.map((item, index) => {
            return (
              <UserOpsTableItem
                key={ item.hash + (isLoading ? String(index) : '') }
                item={ item }
                isLoading={ isLoading }
                showSender={ showSender }
                showTx={ showTx }
                chainData={ chainData }
              />
            );
          }) }
        </TableBody>
      </TableRoot>
    </AddressHighlightProvider>
  );
};

export default UserOpsTable;
