// Modified by Quat Capital, 2026-10-25: localized labels with stable contract selection across language changes. GPL-3.0.
import { Grid } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import type { Channel } from 'phoenix';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { Address } from 'types/api/address';
import type { AddressImplementation } from 'types/api/addressParams';
import type { SmartContract } from 'types/api/contract';

import type { ResourceError } from 'lib/api/resources';
import useApiQuery from 'lib/api/useApiQuery';
import { useMultichainContext } from 'lib/contexts/multichain';
import getQueryParamString from 'lib/router/getQueryParamString';
import * as stubs from 'stubs/contract';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

import ContractDetailsAlerts from './alerts/ContractDetailsAlerts';
import ContractSourceAddressSelector from './ContractSourceAddressSelector';
import ContractDetailsInfo from './info/ContractDetailsInfo';
import ContractDetailsInfoCreator from './info/ContractDetailsInfoCreator';
import ContractDetailsInfoImplementations from './info/ContractDetailsInfoImplementations';
import type { SourceSelection } from './sourceSelection';
import { resolveSourceSelection } from './sourceSelection';
import useContractDetailsTabs from './useContractDetailsTabs';

const TAB_LIST_PROPS = { flexWrap: 'wrap', rowGap: 2 };
const LEFT_SLOT_PROPS = { w: { base: '100%', lg: 'auto' } };

type Props = {
  addressData: Address;
  channel: Channel | undefined;
  mainContractQuery: UseQueryResult<SmartContract, ResourceError>;
};

const ContractDetails = ({ addressData, channel, mainContractQuery }: Props) => {
  const { t: tQuat } = useTranslation();

  const router = useRouter();
  const sourceAddress = getQueryParamString(router.query.source_address);
  const multichainContext = useMultichainContext();

  const sourceItems: Array<AddressImplementation> = React.useMemo(() => {
    const currentAddressDefaultName = tQuat(addressData?.proxy_type === 'eip7702' ? 'contracts.current_address' : 'contracts.current_contract');
    const currentAddressItem = { address_hash: addressData.hash, name: addressData?.name || currentAddressDefaultName };
    if (!addressData || !addressData.implementations || addressData.implementations.length === 0) {
      return [ currentAddressItem ];
    }

    return [
      currentAddressItem,
      ...(addressData?.implementations.filter((item) => item.address_hash !== addressData.hash && item.name) || []),
    ];
  }, [ addressData, tQuat ]);

  const [ sourceSelection, setSourceSelection ] = React.useState<SourceSelection | undefined>(undefined);
  const selectedItem = sourceItems.find(item => item.address_hash === sourceSelection?.selectedHash);

  React.useEffect(() => {
    if (!mainContractQuery.isPlaceholderData) {
      setSourceSelection(previous => resolveSourceSelection(previous, {
        availableHashes: sourceItems.map(item => item.address_hash),
        addressHash: addressData.hash,
        requestedHash: sourceAddress,
      }));
    }
  }, [ mainContractQuery.isPlaceholderData, sourceAddress, sourceItems, addressData.hash ]);

  const handleSourceSelect = React.useCallback((item: AddressImplementation) => {
    setSourceSelection({ selectedHash: item.address_hash, addressHash: addressData.hash, requestedHash: sourceAddress });
  }, [ addressData.hash, sourceAddress ]);

  const contractQuery = useApiQuery('general:contract', {
    pathParams: { hash: selectedItem?.address_hash },
    queryOptions: {
      enabled: Boolean(selectedItem?.address_hash && !mainContractQuery.isPlaceholderData && selectedItem.address_hash !== addressData.hash),
      refetchOnMount: false,
      placeholderData: addressData?.is_verified ? stubs.CONTRACT_CODE_VERIFIED : stubs.CONTRACT_CODE_UNVERIFIED,
    },
  });
  const { data, isPlaceholderData, isError } = selectedItem?.address_hash !== addressData.hash ? contractQuery : mainContractQuery;

  const tabs = useContractDetailsTabs({ data, isLoading: isPlaceholderData, addressData, sourceAddress: selectedItem?.address_hash });

  if (isError) {
    return <DataFetchAlert/>;
  }

  const addressSelector = sourceItems.length > 1 && selectedItem ? (
    <ContractSourceAddressSelector
      isLoading={ mainContractQuery.isPlaceholderData }
      label={ tQuat('common.source_code') }
      items={ sourceItems }
      selectedItem={ selectedItem }
      onItemSelect={ handleSourceSelect }
      mr={{ lg: 8 }}
    />
  ) : null;

  return (
    <>
      <ContractDetailsAlerts
        data={ mainContractQuery.data }
        isLoading={ mainContractQuery.isPlaceholderData }
        addressData={ addressData }
        channel={ channel }
      />
      { mainContractQuery.data?.is_verified && (
        <ContractDetailsInfo
          data={ mainContractQuery.data }
          isLoading={ mainContractQuery.isPlaceholderData }
          addressData={ addressData }
        />
      ) }
      { !mainContractQuery.data?.is_verified && multichainContext && (
        <Grid templateColumns={{ base: 'auto 1fr', lg: 'auto 1fr auto 1fr' }} rowGap={ 4 } columnGap={ 3 } mb={ 8 } _empty={{ display: 'none' }}>
          { addressData.creator_address_hash && addressData.creation_transaction_hash && (
            <ContractDetailsInfoCreator
              addressHash={ addressData.creator_address_hash }
              txHash={ addressData.creation_transaction_hash }
              creationStatus={ addressData.creation_status }
              isLoading={ mainContractQuery.isPlaceholderData }
            />
          ) }
          { addressData.implementations && addressData.implementations.length > 0 && !mainContractQuery.isPlaceholderData && (
            <ContractDetailsInfoImplementations
              implementations={ addressData.implementations }
              proxyType={ addressData.proxy_type }
            />
          ) }
        </Grid>
      ) }
      <RoutedTabs
        tabs={ tabs }
        isLoading={ isPlaceholderData }
        variant="segmented"
        size="sm"
        leftSlot={ addressSelector }
        listProps={ TAB_LIST_PROPS }
        leftSlotProps={ LEFT_SLOT_PROPS }
      />
    </>
  );
};

export default ContractDetails;
