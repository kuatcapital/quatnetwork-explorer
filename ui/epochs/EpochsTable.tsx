// Modified by Quat Capital, 2026-10-26: localize validators, epochs and transfers. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { CeloEpochListItem } from 'types/api/epochs';

import config from 'configs/app';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import TimeFormatToggle from 'ui/shared/time/TimeFormatToggle';

import EpochsTableItem from './EpochsTableItem';

interface Props {
  items: Array<CeloEpochListItem>;
  isLoading?: boolean;
  top: number;
};

const EpochsTable = ({ items, isLoading, top }: Props) => {
  const { t } = useTranslation();
  return (
    <TableRoot minW="1100px">
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader w="280px">
            { t('networkTransfers.epoch') }<TimeFormatToggle/>
          </TableColumnHeader>
          <TableColumnHeader w="120px">{ t('networkTransfers.status') }</TableColumnHeader>
          <TableColumnHeader w="25%">{ t('networkTransfers.block_range') }</TableColumnHeader>
          <TableColumnHeader w="25%" isNumeric>{ t('networkTransfers.community') }{ config.chain.currency.symbol }</TableColumnHeader>
          <TableColumnHeader w="25%" isNumeric>{ t('networkTransfers.carbon') }{ config.chain.currency.symbol }</TableColumnHeader>
          <TableColumnHeader w="25%" isNumeric>{ t('networkTransfers.total') }{ config.chain.currency.symbol }</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items.map((item, index) => {
          return (
            <EpochsTableItem
              key={ item.number + (isLoading ? String(index) : '') }
              item={ item }
              isLoading={ isLoading }
            />
          );
        }) }
      </TableBody>
    </TableRoot>
  );
};

export default EpochsTable;
