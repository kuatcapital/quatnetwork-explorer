// Modified by Quat Capital, 2026-10-27: complete runtime contract-interface localization. GPL-3.0.
// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import { chakra, Box, Flex } from '@chakra-ui/react';
import type { Channel } from 'phoenix';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import type { SocketMessage } from 'lib/socket/types';
import type { Address } from 'types/api/address';
import type { SmartContract } from 'types/api/contract';

import { route } from 'nextjs-routes';

import useSocketMessage from 'lib/socket/useSocketMessage';
import { Alert } from 'toolkit/chakra/alert';
import { Link } from 'toolkit/chakra/link';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';

import ContractDetailsAlertProxyPattern from './ContractDetailsAlertProxyPattern';
import ContractDetailsAlertVerificationStatus from './ContractDetailsAlertVerificationStatus';

export interface Props {
  data: SmartContract | undefined;
  isLoading: boolean;
  addressData: Address;
  channel?: Channel;
}

const ContractDetailsAlerts = ({ data, isLoading, addressData, channel }: Props) => {
  const { t: tQuat } = useTranslation();

  const [ isChangedBytecodeSocket, setIsChangedBytecodeSocket ] = React.useState<boolean>();

  const handleChangedBytecodeMessage: SocketMessage.AddressChangedBytecode['handler'] = React.useCallback(() => {
    setIsChangedBytecodeSocket(true);
  }, [ ]);

  useSocketMessage({
    channel,
    event: 'changed_bytecode',
    handler: handleChangedBytecodeMessage,
  });

  return (
    <Flex flexDir="column" rowGap={ 1 } mb={ 6 } _empty={{ display: 'none' }}>
      { data?.is_blueprint && (
        <Box>
          <Trans
            t={ tQuat }
            i18nKey="contracts.blueprint"
            components={{ standard: <Link external href="https://eips.ethereum.org/EIPS/eip-5202"/> }}
          />
        </Box>
      ) }
      <ContractDetailsAlertVerificationStatus data={ data } isLoading={ isLoading } addressData={ addressData }/>
      { addressData.proxy_type && (
        <ContractDetailsAlertProxyPattern
          type={ addressData.proxy_type }
          isLoading={ isLoading }
          conflictingImplementations={ data?.conflicting_implementations ?? undefined }
        />
      ) }
      { (data?.is_changed_bytecode || isChangedBytecodeSocket) && (
        <Alert status="warning">{ tQuat('contracts.changed_bytecode_warning') }</Alert>
      ) }
      { !data?.is_verified && data?.verified_twin_address_hash && (!addressData.proxy_type || addressData.proxy_type === 'unknown') && (
        <Alert status="warning" whiteSpace="pre-wrap">
          <Trans
            t={ tQuat }
            i18nKey="contracts.unverified_twin"
            components={{
              address: <AddressEntity
                address={{ hash: data.verified_twin_address_hash, filecoin: { robust: data.verified_twin_filecoin_robust_address }, is_contract: true }}
                truncation="constant"
                fontSize="sm"
                fontWeight="500"
              />,
            }}
          />
          <chakra.span mt={ 1 }>
            <Trans
              t={ tQuat }
              i18nKey="contracts.unverified_twin_abi"
              components={{ verify: <Link href={ route({ pathname: '/address/[hash]/contract-verification', query: { hash: addressData.hash } }) }/> }}
            />
          </chakra.span>
        </Alert>
      ) }
    </Flex>
  );
};

export default React.memo(ContractDetailsAlerts);
