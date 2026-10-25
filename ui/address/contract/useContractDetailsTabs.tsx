// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import { Flex } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { Address } from 'types/api/address';
import type { SmartContract } from 'types/api/contract';

import CodeViewSnippet from 'ui/shared/CodeViewSnippet';

import ContractDetailsByteCode from './ContractDetailsByteCode';
import ContractDetailsConstructorArgs from './ContractDetailsConstructorArgs';
import ContractSourceCode from './ContractSourceCode';
import type { CONTRACT_DETAILS_TAB_IDS } from './utils';

interface Tab {
  id: typeof CONTRACT_DETAILS_TAB_IDS[number];
  title: string;
  component: React.ReactNode;
}

interface Props {
  data: SmartContract | undefined;
  isLoading: boolean;
  addressData: Address;
  sourceAddress: string | undefined;
}

export default function useContractDetailsTabs({ data, isLoading, addressData, sourceAddress }: Props): Array<Tab> {
  const { t: tQuat } = useTranslation();

  return React.useMemo(() => {

    if (!sourceAddress) {
      return [];
    }

    return [
      (data?.constructor_args || data?.source_code) ? {
        id: 'contract_source_code' as const,
        title: tQuat('contracts.code_title'),
        component: (
          <Flex flexDir="column" rowGap={ 6 }>
            <ContractDetailsConstructorArgs data={ data } isLoading={ isLoading }/>
            { data?.source_code && (
              <ContractSourceCode
                data={ data }
                isLoading={ isLoading }
                sourceAddress={ sourceAddress }
              />
            ) }
          </Flex>
        ),
      } : undefined,

      data?.compiler_settings ? {
        id: 'contract_compiler' as const,
        title: tQuat('contracts.compiler_title'),
        component: (
          <CodeViewSnippet
            data={ JSON.stringify(data.compiler_settings, undefined, 2) }
            language="json"
            title={ tQuat('contracts.compiler_settings') }
            copyData={ JSON.stringify(data.compiler_settings) }
            isLoading={ isLoading }
          />
        ),
      } : undefined,

      data?.abi ? {
        id: 'contract_abi' as const,
        title: 'ABI',
        component: (
          <CodeViewSnippet
            data={ JSON.stringify(data.abi, undefined, 2) }
            language="json"
            title={ tQuat('contracts.abi_title') }
            copyData={ JSON.stringify(data.abi) }
            isLoading={ isLoading }
          />
        ),
      } : undefined,

      (data?.creation_bytecode || data?.deployed_bytecode) ? {
        id: 'contract_bytecode' as const,
        title: tQuat('contracts.bytecode_title'),
        component: <ContractDetailsByteCode data={ data } isLoading={ isLoading } addressData={ addressData }/>,
      } : undefined,
    ].filter(Boolean);
  }, [ isLoading, addressData, data, sourceAddress, tQuat ]);
}
