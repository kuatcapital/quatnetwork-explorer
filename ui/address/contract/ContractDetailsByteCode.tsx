// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import { Flex } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { Address } from 'types/api/address';
import type { SmartContract } from 'types/api/contract';

import { Alert } from 'toolkit/chakra/alert';
import RawDataSnippet from 'ui/shared/RawDataSnippet';

import ContractDetailsDeployedByteCode from './ContractDetailsDeployedByteCode';
import ContractDetailsVerificationButton from './ContractDetailsVerificationButton';

interface Props {
  data: SmartContract;
  isLoading: boolean;
  addressData: Address;
}

const ContractDetailsByteCode = ({ data, isLoading, addressData }: Props) => {
  const { t: tQuat } = useTranslation();

  const canBeVerified = ![ 'selfdestructed', 'failed' ].includes(data.creation_status || '') && !data?.is_verified && addressData.proxy_type !== 'eip7702';

  const creationStatusText = (() => {
    switch (data.creation_status) {
      case 'selfdestructed':
        return tQuat('contracts.selfdestructed_bytecode');
      case 'failed':
        return tQuat('contracts.creation_failed_bytecode');
      default:
        return null;
    }
  })();

  return (
    <Flex flexDir="column" rowGap={ 6 }>
      { data?.creation_bytecode && (
        <RawDataSnippet
          data={ data.creation_bytecode }
          title={ tQuat('contracts.creation_code') }
          rightSlot={ canBeVerified ? (
            <ContractDetailsVerificationButton
              isLoading={ isLoading }
              addressHash={ addressData.hash }
              ml="auto"
              mr={ 3 }
            />
          ) : null }
          beforeSlot={ creationStatusText ? (
            <Alert status="info" whiteSpace="pre-wrap" showIcon mb={ 3 }>
              { creationStatusText }
            </Alert>
          ) : null }
          textareaMaxHeight="300px"
          isLoading={ isLoading }
        />
      ) }
      { data?.deployed_bytecode && (
        <ContractDetailsDeployedByteCode
          bytecode={ data.deployed_bytecode }
          isLoading={ isLoading }
          addressData={ addressData }
          showVerificationButton={ !data?.creation_bytecode && canBeVerified }
        />
      ) }
    </Flex>
  );
};

export default React.memo(ContractDetailsByteCode);
