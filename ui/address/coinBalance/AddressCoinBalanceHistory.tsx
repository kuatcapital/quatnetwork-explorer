// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import { Box } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { AddressCoinBalanceHistoryResponse } from 'types/api/address';
import type { PaginationParams } from 'ui/shared/pagination/types';

import type { ResourceError } from 'lib/api/resources';
import { useMultichainContext } from 'lib/contexts/multichain';
import { currencyUnits } from 'lib/units';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/pagination/Pagination';
import TimeFormatToggle from 'ui/shared/time/TimeFormatToggle';

import AddressCoinBalanceListItem from './AddressCoinBalanceListItem';
import AddressCoinBalanceTableItem from './AddressCoinBalanceTableItem';

interface Props {
  query: UseQueryResult<AddressCoinBalanceHistoryResponse, ResourceError<unknown>> & {
    pagination: PaginationParams;
  };
}

const AddressCoinBalanceHistory = ({ query }: Props) => {
  const { t: tQuat } = useTranslation();

  const multichainContext = useMultichainContext();
  const chainData = multichainContext?.chain;

  const content = query.data?.items ? (
    <>
      <Box hideBelow="lg">
        <TableRoot>
          <TableHeaderSticky top={ query.pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }>
            <TableRow>
              { chainData && <TableColumnHeader width="38px"/> }
              <TableColumnHeader width="20%">{ tQuat('common.block') }</TableColumnHeader>
              <TableColumnHeader width="20%">{ tQuat('home.txn') }</TableColumnHeader>
              <TableColumnHeader width="20%">{ tQuat('common.timestamp') }<TimeFormatToggle/>
              </TableColumnHeader>
              <TableColumnHeader width="20%" isNumeric pr={ 1 }>{ tQuat('common.balance') }{ ' ' }{ currencyUnits.ether }</TableColumnHeader>
              <TableColumnHeader width="20%" isNumeric>{ tQuat('addresses.delta') }</TableColumnHeader>
            </TableRow>
          </TableHeaderSticky>
          <TableBody>
            { query.data.items.map((item, index) => (
              <AddressCoinBalanceTableItem
                key={ item.block_number + (query.isPlaceholderData ? String(index) : '') }
                { ...item }
                page={ query.pagination.page }
                isLoading={ query.isPlaceholderData }
                chainData={ chainData }
              />
            )) }
          </TableBody>
        </TableRoot>
      </Box>
      <Box hideFrom="lg">
        { query.data.items.map((item, index) => (
          <AddressCoinBalanceListItem
            key={ item.block_number + (query.isPlaceholderData ? String(index) : '') }
            { ...item }
            page={ query.pagination.page }
            isLoading={ query.isPlaceholderData }
            chainData={ chainData }
          />
        )) }
      </Box>
    </>
  ) : null;

  const actionBar = query.pagination.isVisible ? (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...query.pagination }/>
    </ActionBar>
  ) : null;

  return (
    <DataListDisplay
      mt={ 8 }
      isError={ query.isError }
      itemsNum={ query.data?.items.length }
      emptyText={ tQuat('addresses.no_balance_history') }
      actionBar={ actionBar }
    >
      { content }
    </DataListDisplay>
  );
};

export default React.memo(AddressCoinBalanceHistory);
