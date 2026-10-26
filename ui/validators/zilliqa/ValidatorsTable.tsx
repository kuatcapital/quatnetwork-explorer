// Modified by Quat Capital, 2026-10-26: localize validators, epochs and transfers. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { ValidatorsZilliqaItem } from 'types/api/validators';

import config from 'configs/app';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';

import ValidatorsTableItem from './ValidatorsTableItem';

interface Props {
  data: Array<ValidatorsZilliqaItem>;
  isLoading?: boolean;
  top?: number;
}

const ValidatorsTable = ({ data, isLoading, top }: Props) => {
  const { t } = useTranslation();
  return (
    <TableRoot>
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader width="50%">{ t('networkTransfers.bls_key') }</TableColumnHeader>
          <TableColumnHeader width="15%">{ t('networkTransfers.index') }</TableColumnHeader>
          <TableColumnHeader width="35%" isNumeric>
            { t('networkTransfers.staked') }{ config.chain.currency.symbol }
          </TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { data.map((item, index) => (
          <ValidatorsTableItem
            key={ item.bls_public_key + (isLoading ? index : '') }
            data={ item }
            isLoading={ isLoading }/>
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default React.memo(ValidatorsTable);
