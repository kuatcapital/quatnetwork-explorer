// Modified by Quat Capital, 2026-10-27: complete runtime contract-interface localization. GPL-3.0.
import { Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { AddressImplementation } from 'types/api/addressParams';
import type { SmartContractConflictingImplementation, SmartContractProxyType } from 'types/api/contract';

import useApiQuery from 'lib/api/useApiQuery';
import getQueryParamString from 'lib/router/getQueryParamString';

import ContractSourceAddressSelector from '../ContractSourceAddressSelector';
import ContractAbi from './ContractAbi';
import ContractMethodsAlerts from './ContractMethodsAlerts';
import ContractMethodsContainer from './ContractMethodsContainer';
import ContractMethodsFilters from './ContractMethodsFilters';
import useMethodsFilters from './useMethodsFilters';
import { formatAbi } from './utils';

interface Props {
  implementations: Array<AddressImplementation>;
  isLoading?: boolean;
  proxyType?: SmartContractProxyType;
  conflictingImplementations?: Array<SmartContractConflictingImplementation>;
}

const ContractMethodsProxy = ({ implementations, isLoading: isInitialLoading, proxyType, conflictingImplementations }: Props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const sourceAddress = getQueryParamString(router.query.source_address);
  const tab = getQueryParamString(router.query.tab);
  const addressHash = getQueryParamString(router.query.hash);

  const [ selectedItem, setSelectedItem ] = React.useState(implementations.find((item) => item.address_hash === sourceAddress) || implementations[0]);

  const contractQuery = useApiQuery('general:contract', {
    pathParams: { hash: selectedItem.address_hash },
    queryOptions: {
      enabled: Boolean(selectedItem.address_hash),
      refetchOnMount: false,
    },
  });

  const abi = React.useMemo(() => formatAbi(contractQuery.data?.abi || []), [ contractQuery.data?.abi ]);
  const filters = useMethodsFilters({ abi });

  return (
    <Flex flexDir="column" rowGap={ 6 }>
      <ContractMethodsAlerts isLoading={ isInitialLoading } proxyType={ proxyType } conflictingImplementations={ conflictingImplementations }/>
      <div>
        <ContractSourceAddressSelector
          items={ implementations }
          selectedItem={ selectedItem }
          onItemSelect={ setSelectedItem }
          isLoading={ isInitialLoading }
          label={ proxyType === 'eip7702' ? t('contracts.delegate_address') : t('contracts.implementation_address') }
          mb={ 3 }
        />
        <ContractMethodsFilters
          defaultMethodType={ filters.methodType }
          defaultSearchTerm={ filters.searchTerm }
          onChange={ filters.onChange }
          isLoading={ isInitialLoading }
        />
      </div>
      <ContractMethodsContainer
        key={ selectedItem.address_hash }
        isLoading={ isInitialLoading || contractQuery.isPending }
        isEmpty={ abi.length === 0 }
        type={ filters.methodType }
        isError={ contractQuery.isError }
      >
        <ContractAbi
          abi={ abi }
          tab={ tab }
          addressHash={ addressHash }
          visibleItems={ filters.visibleItems }
          sourceAddress={ selectedItem.address_hash }
        />
      </ContractMethodsContainer>
    </Flex>
  );
};

export default React.memo(ContractMethodsProxy);
