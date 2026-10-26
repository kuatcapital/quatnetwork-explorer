// Modified by Quat Capital, 2026-10-26: T18 reviewed literal localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { ClustersDirectoryObject } from 'types/api/clusters';

import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import { TableBody, TableHeaderSticky, TableRow, TableColumnHeader, TableRoot } from 'toolkit/chakra/table';
import TimeFormatToggle from 'ui/shared/time/TimeFormatToggle';

import ClustersDirectoryTableItem from './ClustersDirectoryTableItem';

interface Props {
  data: Array<ClustersDirectoryObject>;
  isLoading?: boolean;
  top?: number;
  isClusterDetailsLoading?: boolean;
}

const ClustersDirectoryTable = ({ data, isLoading, top, isClusterDetailsLoading }: Props) => {
  const { t: tQuat } = useTranslation();

  return (
    <AddressHighlightProvider>
      <TableRoot>
        <TableHeaderSticky top={ top }>
          <TableRow>
            <TableColumnHeader width="40%">Cluster name</TableColumnHeader>
            <TableColumnHeader width="40%">{ tQuat('common.address') }</TableColumnHeader>
            <TableColumnHeader width="180px">
              Joined
              <TimeFormatToggle/>
            </TableColumnHeader>
            <TableColumnHeader width="20%">Active chains</TableColumnHeader>
          </TableRow>
        </TableHeaderSticky>
        <TableBody>
          { data.map((item, index) => (
            <ClustersDirectoryTableItem
              key={ `${ item.name }-${ index }${ isLoading ? '-loading' : '' }` }
              item={ item }
              isLoading={ isLoading }
              isClusterDetailsLoading={ isClusterDetailsLoading }
            />
          )) }
        </TableBody>
      </TableRoot>
    </AddressHighlightProvider>
  );
};

export default React.memo(ClustersDirectoryTable);
