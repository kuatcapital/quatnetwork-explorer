// Modified by Quat Capital, 2026-10-27: T18 reviewed literal localization. GPL-3.0.
import React from 'react';

import type { ClusterByNameResponse } from 'types/api/clusters';

import { isEvmAddress } from 'lib/address/isEvmAddress';
import { currencyUnits } from 'lib/units';
import { Skeleton } from 'toolkit/chakra/skeleton';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import DetailedInfoTimestamp from 'ui/shared/DetailedInfo/DetailedInfoTimestamp';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import ClustersEntity from 'ui/shared/entities/clusters/ClustersEntity';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';
import { useTranslation } from 'react-i18next';


interface Props {
  clusterData?: ClusterByNameResponse['result']['data'];
  clusterName: string;
  isLoading: boolean;
}

const ClusterDetails = ({ clusterData, clusterName, isLoading }: Props) => {
  const { t: tQuat } = useTranslation();

  if (!clusterData && !isLoading) {
    throw new Error('Cluster not found', { cause: { status: 404 } });
  }

  const ownerIsEvm = clusterData?.owner ? isEvmAddress(clusterData.owner) : false;
  const addressType = ownerIsEvm ? 'EVM' : 'NON-EVM';

  return (
    <DetailedInfo.Container>
      <DetailedInfo.ItemLabel
        hint={ tQuat('multiUi.cluster_unique_hint') }
        isLoading={ isLoading }
      >{ tQuat('multiUi.cluster_name') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <ClustersEntity
          clusterName={ clusterName }
          isLoading={ isLoading }
          noLink
          fontWeight={ 500 }
        />
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint={ tQuat('multiUi.cluster_owner_hint') }
        isLoading={ isLoading }
      >{ tQuat('multiUi.owner_address') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <AddressEntity
          address={{ hash: clusterData?.owner || '' }}
          isLoading={ isLoading }
          fontWeight={ 500 }
          noLink={ !ownerIsEvm }
        />
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint={ tQuat('multiUi.cluster_network_hint') }
        isLoading={ isLoading }
      >{ tQuat('common.type') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton loading={ isLoading }>
          { addressType }
        </Skeleton>
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint={ `The amount of ${ currencyUnits.ether } backing this cluster name` }
        isLoading={ isLoading }
      >{ tQuat('multiUi.backing') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <NativeCoinValue
          amount={ clusterData?.backingWei || '0' }
          loading={ isLoading }
        />
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint={ tQuat('multiUi.created_hint') }
        isLoading={ isLoading }
      >{ tQuat('multiUi.created') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        { clusterData?.createdAt ? (
          <DetailedInfoTimestamp
            timestamp={ clusterData.createdAt }
            isLoading={ isLoading }
          />
        ) : (
          <Skeleton loading={ isLoading }>N/A</Skeleton>
        ) }
      </DetailedInfo.ItemValue>
    </DetailedInfo.Container>
  );
};

export default ClusterDetails;
