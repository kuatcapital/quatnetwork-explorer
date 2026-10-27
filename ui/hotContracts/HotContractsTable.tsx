// Modified by Quat Capital, 2026-10-27: T18 reviewed literal localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { HotContract, HotContractsSortingField, HotContractsSortingValue } from 'types/api/contracts';

import { currencyUnits } from 'lib/units';
import { TableBody, TableColumnHeader, TableColumnHeaderSortable, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import getNextSortValue from 'ui/shared/sort/getNextSortValue';

import HotContractsTableItem from './HotContractsTableItem';
import { SORT_SEQUENCE } from './utils';

interface Props {
  items: Array<HotContract> | undefined;
  isLoading?: boolean;
  sort: HotContractsSortingValue;
  setSorting: ({ value }: { value: Array<string> }) => void;
  exchangeRate: string | null;
};

const HotContractsTable = ({ items, isLoading, sort, setSorting, exchangeRate }: Props) => {
  const { t: tQuat } = useTranslation();

  const onSortToggle = React.useCallback((field: HotContractsSortingField) => {
    const value = getNextSortValue<HotContractsSortingField, HotContractsSortingValue>(SORT_SEQUENCE, field)(sort);
    setSorting({ value: [ value ] });
  }, [ sort, setSorting ]);

  return (
    <TableRoot minWidth="900px">
      <TableHeaderSticky top={ ACTION_BAR_HEIGHT_DESKTOP }>
        <TableRow>
          <TableColumnHeader width="25%">{ tQuat('suppUi.contract') }</TableColumnHeader>
          <TableColumnHeaderSortable
            width="25%"
            isNumeric
            sortField="transactions_count"
            sortValue={ sort }
            onSortToggle={ onSortToggle }
            disabled={ isLoading }
          >{ tQuat('suppUi.txn_count') }</TableColumnHeaderSortable>
          <TableColumnHeaderSortable
            width="25%"
            isNumeric
            sortField="total_gas_used"
            sortValue={ sort }
            onSortToggle={ onSortToggle }
            disabled={ isLoading }
          >{ tQuat('suppUi.gas_used') }</TableColumnHeaderSortable>
          <TableColumnHeader width="25%" isNumeric>{ tQuat('suppUi.balance_currency', { currency: currencyUnits.ether }) }</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items?.map((item, index) => (
          <HotContractsTableItem key={ index } isLoading={ isLoading } data={ item } exchangeRate={ exchangeRate }/>
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default HotContractsTable;
