// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { VerifiedContract } from 'types/api/contracts';
import type { VerifiedContractsSortingField, VerifiedContractsSortingValue } from 'types/api/verifiedContracts';

import { useMultichainContext } from 'lib/contexts/multichain';
import { currencyUnits } from 'lib/units';
import { TableBody, TableColumnHeader, TableColumnHeaderSortable, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import getNextSortValue from 'ui/shared/sort/getNextSortValue';
import TimeFormatToggle from 'ui/shared/time/TimeFormatToggle';
import { SORT_SEQUENCE } from 'ui/verifiedContracts/utils';

import VerifiedContractsTableItem from './VerifiedContractsTableItem';

interface Props {
  data: Array<VerifiedContract>;
  sort: VerifiedContractsSortingValue;
  setSorting: ({ value }: { value: Array<string> }) => void;
  isLoading?: boolean;
}

const VerifiedContractsTable = ({ data, sort, setSorting, isLoading }: Props) => {
  const { t: tQuat } = useTranslation();

  const multichainContext = useMultichainContext();
  const chainData = multichainContext?.chain;

  const onSortToggle = React.useCallback((field: VerifiedContractsSortingField) => {
    const value = getNextSortValue<VerifiedContractsSortingField, VerifiedContractsSortingValue>(SORT_SEQUENCE, field)(sort);
    setSorting({ value: [ value ] });
  }, [ sort, setSorting ]);

  return (
    <TableRoot minW="1100px">
      <TableHeaderSticky top={ ACTION_BAR_HEIGHT_DESKTOP }>
        <TableRow>
          { chainData && <TableColumnHeader width="38px"/> }
          <TableColumnHeader width="50%">{ tQuat('common.contract') }</TableColumnHeader>
          <TableColumnHeaderSortable
            width="130px"
            isNumeric
            sortField="balance"
            sortValue={ sort }
            onSortToggle={ onSortToggle }
            disabled={ isLoading }
          >{ tQuat('verification.balance_currency', { currency: currencyUnits.ether }) }
          </TableColumnHeaderSortable>
          <TableColumnHeaderSortable
            width="130px"
            isNumeric
            sortField="transactions_count"
            sortValue={ sort }
            onSortToggle={ onSortToggle }
            disabled={ isLoading }
          >{ tQuat('verification.txs') }</TableColumnHeaderSortable>
          <TableColumnHeader width="50%">{ tQuat('verification.language_compiler') }</TableColumnHeader>
          <TableColumnHeader width="80px">{ tQuat('common.settings') }</TableColumnHeader>
          <TableColumnHeader width="200px">
            { tQuat('verification.verified') }
            <TimeFormatToggle/>
          </TableColumnHeader>
          <TableColumnHeader width="130px">{ tQuat('verification.license') }</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { data.map((item, index) => (
          <VerifiedContractsTableItem
            key={ item.address.hash + (isLoading ? index : '') }
            data={ item }
            isLoading={ isLoading }
            chainData={ chainData }
          />
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default React.memo(VerifiedContractsTable);
