// Modified by Quat Capital, 2026-10-26: account interface localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { TokenInfoApplication, VerifiedAddress } from 'types/api/account';

import { TableBody, TableColumnHeader, TableHeader, TableRoot, TableRow } from 'toolkit/chakra/table';

import VerifiedAddressesTableItem from './VerifiedAddressesTableItem';

interface Props {
  data: Array<VerifiedAddress>;
  applications: Array<TokenInfoApplication> | undefined;
  onItemAdd: (address: string) => void;
  onItemEdit: (address: string) => void;
  isLoading: boolean;
}

const VerifiedAddressesTable = ({ data, applications, onItemEdit, onItemAdd, isLoading }: Props) => {
  const { t: tAcct } = useTranslation();
  return (
    <TableRoot>
      <TableHeader>
        <TableRow>
          <TableColumnHeader>{ tAcct('accountUI.address') }</TableColumnHeader>
          <TableColumnHeader w="168px" pr={ 1 }>{ tAcct('accountUI.token_info') }</TableColumnHeader>
          <TableColumnHeader w="36px" pl="0"></TableColumnHeader>
          <TableColumnHeader w="160px">{ tAcct('accountUI.request_status') }</TableColumnHeader>
          <TableColumnHeader w="150px">{ tAcct('accountUI.date') }</TableColumnHeader>
        </TableRow>
      </TableHeader>
      <TableBody>
        { data.map((item, index) => (
          <VerifiedAddressesTableItem
            key={ item.contractAddress + (isLoading ? index : '') }
            item={ item }
            application={ applications?.find(({ tokenAddress }) => tokenAddress.toLowerCase() === item.contractAddress.toLowerCase()) }
            onAdd={ onItemAdd }
            onEdit={ onItemEdit }
            isLoading={ isLoading }
          />
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default React.memo(VerifiedAddressesTable);
