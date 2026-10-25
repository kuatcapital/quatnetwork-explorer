// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import { Box } from '@chakra-ui/react';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import type { Address } from 'types/api/address';
import type { SmartContract } from 'types/api/contract';

import { Alert } from 'toolkit/chakra/alert';
import { Link } from 'toolkit/chakra/link';

import ContractDetailsVerificationButton from '../ContractDetailsVerificationButton';

interface Props {
  data: SmartContract | undefined;
  isLoading: boolean;
  addressData: Address;
}

const ContractDetailsAlertVerificationStatus = ({ data, isLoading, addressData }: Props) => {
  const { t: tQuat } = useTranslation();

  if (!data || !data.is_verified) {
    return null;
  }

  const sourceElement = (() => {
    if (data?.is_verified_via_eth_bytecode_db) {
      return (
        <Trans
          t={ tQuat }
          i18nKey={ data.is_partially_verified ? 'contracts.verified_db_partial' : 'contracts.verified_db' }
          components={{ source: <Link href="https://docs.blockscout.com/devs/verification/ethereum-bytecode-database-microservice" external/> }}
        />
      );
    }

    if (data?.is_verified_via_sourcify) {
      return (
        <>
          <span>{ tQuat(data.is_partially_verified ? 'contracts.verified_sourcify_partial' : 'contracts.verified_sourcify') }</span>
          { data.sourcify_repo_url && <Link href={ data.sourcify_repo_url } textStyle="md" external>{ tQuat('contracts.view_sourcify') }</Link> }
        </>
      );
    }

    return null;
  })();

  if (!data.is_partially_verified) {
    return (
      <Alert status="success" loading={ isLoading } descriptionProps={{ whiteSpace: 'pre-wrap' }}>
        <span>{ tQuat('contracts.verified_exact') }{ sourceElement ? '. ' : '' }</span>
        { sourceElement }
      </Alert>
    );
  }

  return (
    <Alert status="success" loading={ isLoading } descriptionProps={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 2, columnGap: 3 }}>
      <span>{ tQuat(data.is_partially_verified ? 'contracts.verified_partial' : 'contracts.verified_exact') }{ sourceElement ? '.' : '' }</span>
      <ContractDetailsVerificationButton
        isLoading={ isLoading }
        addressHash={ addressData.hash }
      />
      { sourceElement && <Box w="100%">{ sourceElement }</Box> }
    </Alert>
  );
};

export default React.memo(ContractDetailsAlertVerificationStatus);
