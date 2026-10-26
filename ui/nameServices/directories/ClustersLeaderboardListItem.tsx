// Modified by Quat Capital, 2026-10-26: T18 reviewed literal localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { ClustersLeaderboardObject } from 'types/api/clusters';

import { Skeleton } from 'toolkit/chakra/skeleton';
import ClustersEntity from 'ui/shared/entities/clusters/ClustersEntity';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';

interface Props {
  item: ClustersLeaderboardObject;
  isLoading?: boolean;
}

const ClustersLeaderboardListItem = ({ item, isLoading }: Props) => {
  const { t: tQuat } = useTranslation();

  return (
    <ListItemMobileGrid.Container>
      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('addresses.rank') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton loading={ isLoading }>
          #{ item.rank }
        </Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>
        Cluster name
      </ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <ClustersEntity clusterName={ item.name } isLoading={ isLoading } fontWeight={ 500 }/>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('search.categories.names') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton loading={ isLoading }>
          { item.nameCount }
        </Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>
        Backing
      </ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton loading={ isLoading }>
          { (parseFloat(item.totalWeiAmount) / 1e18).toFixed(2) } ETH
        </Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>
        Network presence
      </ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton loading={ isLoading }>
          { item.chainIds.length } { item.chainIds.length === 1 ? 'chain' : 'chains' }
        </Skeleton>
      </ListItemMobileGrid.Value>
    </ListItemMobileGrid.Container>
  );
};

export default React.memo(ClustersLeaderboardListItem);
