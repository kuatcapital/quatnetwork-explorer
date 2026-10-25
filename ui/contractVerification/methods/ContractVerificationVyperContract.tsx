// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { SmartContractVerificationConfig } from 'types/client/contract';

import ContractVerificationMethod from '../ContractVerificationMethod';
import ContractVerificationFieldCode from '../fields/ContractVerificationFieldCode';
import ContractVerificationFieldCompiler from '../fields/ContractVerificationFieldCompiler';
import ContractVerificationFieldConstructorArgs from '../fields/ContractVerificationFieldConstructorArgs';
import ContractVerificationFieldEvmVersion from '../fields/ContractVerificationFieldEvmVersion';
import ContractVerificationFieldName from '../fields/ContractVerificationFieldName';

const ContractVerificationVyperContract = ({ config }: { config: SmartContractVerificationConfig }) => {
  const { t: tQuat } = useTranslation();

  return (
    <ContractVerificationMethod title={ tQuat('verification.vyper_title') }>
      <ContractVerificationFieldName hint={ tQuat('verification.vyper_name_hint') }/>
      <ContractVerificationFieldCompiler config={ config } isVyper/>
      { config?.is_rust_verifier_microservice_enabled && <ContractVerificationFieldEvmVersion isVyper config={ config }/> }
      <ContractVerificationFieldCode isVyper/>
      { !config?.is_rust_verifier_microservice_enabled && <ContractVerificationFieldConstructorArgs/> }
    </ContractVerificationMethod>
  );
};

export default React.memo(ContractVerificationVyperContract);
