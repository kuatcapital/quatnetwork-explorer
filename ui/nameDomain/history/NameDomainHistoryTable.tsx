// Modified by Quat Capital, 2026-10-26: T18 reviewed literal localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type * as bens from '@blockscout/bens-types';

import { TableBody, TableColumnHeader, TableColumnHeaderSortable, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import TimeFormatToggle from 'ui/shared/time/TimeFormatToggle';

import NameDomainHistoryTableItem from './NameDomainHistoryTableItem';
import type { SortField, Sort } from './utils';
import { sortFn } from './utils';

interface Props {
  history: bens.ListDomainEventsResponse | undefined;
  domain: bens.DetailedDomain | undefined;
  isLoading?: boolean;
  sort: Sort;
  onSortToggle: (field: SortField) => void;
}

const NameDomainHistoryTable = ({ history, domain, isLoading, sort, onSortToggle }: Props) => {
  const { t: tQuat } = useTranslation();

  return (
    <TableRoot>
      <TableHeaderSticky top={ 0 }>
        <TableRow>
          <TableColumnHeader width="25%">{ tQuat('common.txn_hash') }</TableColumnHeader>
          <TableColumnHeaderSortable
            width="25%"
            pl={ 9 }
            sortField="timestamp"
            sortValue={ sort }
            onSortToggle={ onSortToggle }
            contentAfter={ <TimeFormatToggle/> }
          >{ tQuat('common.timestamp') }</TableColumnHeaderSortable>
          <TableColumnHeader width="25%">From</TableColumnHeader>
          <TableColumnHeader width="25%">{ tQuat('common.method') }</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        {
          history?.items
            .slice()
            .sort(sortFn(sort))
            .map((item, index) => <NameDomainHistoryTableItem key={ index } event={ item } domain={ domain } isLoading={ isLoading }/>)
        }
      </TableBody>
    </TableRoot>
  );
};

export default React.memo(NameDomainHistoryTable);
