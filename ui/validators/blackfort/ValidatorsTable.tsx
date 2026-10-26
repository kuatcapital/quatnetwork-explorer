// Modified by Quat Capital, 2026-10-26: localize validators, epochs and transfers. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type {
  ValidatorBlackfort,
  ValidatorsBlackfortSortingField,
  ValidatorsBlackfortSortingValue,
} from 'types/api/validators';

import { currencyUnits } from 'lib/units';
import { TableBody, TableColumnHeader, TableColumnHeaderSortable, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import getNextSortValue from 'ui/shared/sort/getNextSortValue';

import { VALIDATORS_BLACKFORT_SORT_SEQUENCE } from './utils';
import ValidatorsTableItem from './ValidatorsTableItem';

interface Props {
  data: Array<ValidatorBlackfort>;
  sort: ValidatorsBlackfortSortingValue;
  setSorting: ({ value }: { value: Array<string> }) => void;
  isLoading?: boolean;
  top: number;
}

const ValidatorsTable = ({ data, sort, setSorting, isLoading, top }: Props) => {
  const { t } = useTranslation();

  const onSortToggle = React.useCallback((field: ValidatorsBlackfortSortingField) => {
    const value = getNextSortValue<ValidatorsBlackfortSortingField, ValidatorsBlackfortSortingValue>(VALIDATORS_BLACKFORT_SORT_SEQUENCE, field)(sort);
    setSorting({ value: [ value ] });
  }, [ sort, setSorting ]);

  return (
    <TableRoot>
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeaderSortable
            sortField="address_hash"
            sortValue={ sort }
            onSortToggle={ onSortToggle }
            indicatorPosition="right"
          >
            { t('networkTransfers.validator_address') }</TableColumnHeaderSortable>
          <TableColumnHeader>{ t('networkTransfers.name') }</TableColumnHeader>
          <TableColumnHeader isNumeric>{ t('networkTransfers.commission') }</TableColumnHeader>
          <TableColumnHeader isNumeric>{ t('networkTransfers.self_bonded_currency', { symbol: currencyUnits.ether }) }</TableColumnHeader>
          <TableColumnHeader isNumeric>{ t('networkTransfers.delegated_currency', { symbol: currencyUnits.ether }) }</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { data.map((item, index) => (
          <ValidatorsTableItem
            key={ item.address.hash + (isLoading ? index : '') }
            data={ item }
            isLoading={ isLoading }/>
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default React.memo(ValidatorsTable);
