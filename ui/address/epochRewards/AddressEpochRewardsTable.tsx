// Modified by Quat Capital, 2026-10-27: complete reward value label localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { AddressEpochRewardsItem } from 'types/api/address';

import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import TimeFormatToggle from 'ui/shared/time/TimeFormatToggle';

import AddressEpochRewardsTableItem from './AddressEpochRewardsTableItem';

type Props = {
  items: Array<AddressEpochRewardsItem>;
  isLoading?: boolean;
  top: number;
};

const AddressEpochRewardsTable = ({ items, isLoading, top }: Props) => {
  const { t: tQuat } = useTranslation();

  return (
    <AddressHighlightProvider>
      <TableRoot minW="1000px" style={{ tableLayout: 'auto' }}>
        <TableHeaderSticky top={ top }>
          <TableRow>
            <TableColumnHeader>{ tQuat('addresses.epoch') }<TimeFormatToggle/>
            </TableColumnHeader>
            <TableColumnHeader>{ tQuat('addresses.reward_type') }</TableColumnHeader>
            <TableColumnHeader>{ tQuat('addresses.associated_address') }</TableColumnHeader>
            <TableColumnHeader isNumeric>{ tQuat('addresses.reward_value') }</TableColumnHeader>
          </TableRow>
        </TableHeaderSticky>
        <TableBody>
          { items.map((item, index) => {
            return (
              <AddressEpochRewardsTableItem
                key={ item.epoch_number + item.type + item.account.hash + item.associated_account.hash + (isLoading ? String(index) : '') }
                item={ item }
                isLoading={ isLoading }
              />
            );
          }) }
        </TableBody>
      </TableRoot>
    </AddressHighlightProvider>
  );
};

export default AddressEpochRewardsTable;
