// Modified by Quat Capital, 2026-10-27: T18 reviewed literal localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { ClustersLeaderboardObject } from 'types/api/clusters';

import { TableBody, TableHeaderSticky, TableRow, TableColumnHeader, TableRoot } from 'toolkit/chakra/table';

import ClustersLeaderboardTableItem from './ClustersLeaderboardTableItem';

interface Props {
  data: Array<ClustersLeaderboardObject>;
  isLoading?: boolean;
  top?: number;
}

const ClustersLeaderboardTable = ({ data, isLoading, top }: Props) => {
  const { t: tQuat } = useTranslation();

  return (
    <TableRoot>
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader width="5%">{ tQuat('addresses.rank') }</TableColumnHeader>
          <TableColumnHeader width="40%">{ tQuat('multiUi.cluster_name') }</TableColumnHeader>
          <TableColumnHeader width="10%">{ tQuat('search.categories.names') }</TableColumnHeader>
          <TableColumnHeader width="10%">{ tQuat('multiUi.total_backing') }</TableColumnHeader>
          <TableColumnHeader width="10%">{ tQuat('multiUi.active_chains') }</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { data.map((item, index) => (
          <ClustersLeaderboardTableItem
            key={ `${ item.name }-${ index }${ isLoading ? '-loading' : '' }` }
            item={ item }
            isLoading={ isLoading }
          />
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default React.memo(ClustersLeaderboardTable);
