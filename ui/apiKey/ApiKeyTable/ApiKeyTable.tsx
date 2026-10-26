// Modified by Quat Capital, 2026-10-26: account interface localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { ApiKeys, ApiKey } from 'types/api/account';

import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { TableBody, TableColumnHeader, TableHeader, TableRoot, TableRow } from 'toolkit/chakra/table';

import ApiKeyTableItem from './ApiKeyTableItem';

interface Props {
  data?: ApiKeys;
  isLoading?: boolean;
  onEditClick: (item: ApiKey) => void;
  onDeleteClick: (item: ApiKey) => void;
  limit: number;
}

const ApiKeyTable = ({ data, isLoading, onDeleteClick, onEditClick, limit }: Props) => {
  const { t: tAcct } = useTranslation();
  const { locale } = useLocale();
  return (
    <TableRoot minWidth="600px">
      <TableHeader>
        <TableRow>
          <TableColumnHeader>{ tAcct('accountUI.api_key_table_header', { limit: formatNumber(limit, locale) }) }</TableColumnHeader>
          <TableColumnHeader width="108px"></TableColumnHeader>
        </TableRow>
      </TableHeader>
      <TableBody>
        { data?.map((item, index) => (
          <ApiKeyTableItem
            key={ item.api_key + (isLoading ? index : '') }
            item={ item }
            isLoading={ isLoading }
            onDeleteClick={ onDeleteClick }
            onEditClick={ onEditClick }
          />
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default ApiKeyTable;
