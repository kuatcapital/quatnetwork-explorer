// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import { Text, Flex } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { SmartContractCreationStatus } from 'types/api/contract';

import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import ContractCreationStatus from 'ui/shared/statusTag/ContractCreationStatus';

import ContractDetailsInfoItem from './ContractDetailsInfoItem';

interface Props {
  addressHash: string;
  txHash: string;
  creationStatus: SmartContractCreationStatus | null;
  isLoading: boolean;
}

const ContractDetailsInfoCreator = ({ addressHash, txHash, creationStatus, isLoading }: Props) => {
  const { t: tQuat } = useTranslation();

  return (
    <ContractDetailsInfoItem
      label={ tQuat('contracts.creator') }
      isLoading={ isLoading }
      contentProps={{ gridColumn: { lg: '2 / span 3' } }}
    >
      <Flex alignItems="center" flexWrap="wrap" columnGap={ 2 } rowGap={ 2 }>
        <AddressEntity
          address={{ hash: addressHash }}
          truncation="constant"
          noIcon
        />
        <Text whiteSpace="pre" color="text.secondary">{ tQuat('contracts.at_transaction') }</Text>
        <TxEntity hash={ txHash } truncation="constant" noIcon/>
        { creationStatus && <ContractCreationStatus status={ creationStatus }/> }
      </Flex>
    </ContractDetailsInfoItem>
  );
};

export default React.memo(ContractDetailsInfoCreator);
