// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import { Grid, chakra } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { ClustersByAddressResponse } from 'types/api/clusters';

import { route } from 'nextjs-routes';

import type { ResourceError } from 'lib/api/resources';
import {
  filterOwnedClusters,
  getTotalRecordsDisplay,
  getClusterLabel,
  getClustersToShow,
  getGridRows,
  hasMoreClusters,
} from 'lib/clusters/clustersUtils';
import { Button } from 'toolkit/chakra/button';
import { Link } from 'toolkit/chakra/link';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from 'toolkit/chakra/popover';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import ClustersEntity from 'ui/shared/entities/clusters/ClustersEntity';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  query: UseQueryResult<ClustersByAddressResponse, ResourceError<unknown>>;
  addressHash: string;
}

interface ClustersGridProps {
  data: ClustersByAddressResponse['result']['data'];
}

const ClustersGrid = ({ data }: ClustersGridProps) => {
  const itemsToShow = getClustersToShow(data, 10);
  const numberOfRows = getGridRows(itemsToShow.length, 5);

  return (
    <Grid templateRows={ `repeat(${ numberOfRows }, auto)` } autoFlow="column" gap={ 4 } mt={ 2 }>
      { itemsToShow.map((cluster) => (
        <ClustersEntity key={ cluster.name } clusterName={ cluster.name } fontWeight={ 600 } noCopy/>
      )) }
    </Grid>
  );
};

const AddressClusters = ({ query, addressHash }: Props) => {
  const { t: tQuat } = useTranslation();

  const { data, isPending, isError } = query;

  const popover = useDisclosure();

  if (isError) {
    return null;
  }

  if (isPending) {
    return <Skeleton loading h={ 8 } w={{ base: '50px', xl: '120px' }} borderRadius="base"/>;
  }

  if (!data?.result?.data || data.result.data.length === 0) {
    return null;
  }

  const ownedClusters = filterOwnedClusters(data.result.data, addressHash);

  if (ownedClusters.length === 0) {
    return null;
  }

  const totalRecords = getTotalRecordsDisplay(ownedClusters.length);
  const clusterLabel = getClusterLabel(ownedClusters.length);
  const showMoreLink = hasMoreClusters(ownedClusters.length, 10);

  return (
    <PopoverRoot open={ popover.open } onOpenChange={ popover.onOpenChange }>
      <Tooltip content={ tQuat('addresses.clusters_hint') } disabled={ popover.open } disableOnMobile closeOnClick>
        <div>
          <PopoverTrigger>
            <Button
              size="sm"
              variant="dropdown"
              aria-label={ tQuat('addresses.clusters') }
              fontWeight={ 500 }
              flexShrink={ 0 }
              columnGap={ 1 }
              role="group"
            >
              <IconSvg name="clusters" boxSize={ 5 } fill="currentColor"/>
              <chakra.span hideBelow="xl">{ totalRecords } { clusterLabel }</chakra.span>
              <chakra.span hideFrom="xl">{ totalRecords }</chakra.span>
            </Button>
          </PopoverTrigger>
        </div>
      </Tooltip>
      <PopoverContent w={{ lg: '500px' }}>
        <PopoverBody textStyle="sm" display="flex" flexDir="column" rowGap={ 5 } alignItems="flex-start">
          <div>
            <chakra.span color="text.secondary" textStyle="xs">{ tQuat('addresses.attached_to_address') }</chakra.span>
            <ClustersGrid data={ ownedClusters }/>
          </div>
          { showMoreLink && (
            <Link
              href={ route({ pathname: '/name-services', query: { q: addressHash, tab: 'directories' } }) }
            >
              <span>{ tQuat('addresses.more_results') }</span>
              <chakra.span color="text.secondary"> ({ totalRecords })</chakra.span>
            </Link>
          ) }
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default AddressClusters;
