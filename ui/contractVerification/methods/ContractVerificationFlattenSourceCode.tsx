// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { SmartContractVerificationConfig } from 'types/client/contract';

import ContractVerificationMethod from '../ContractVerificationMethod';
import ContractVerificationFieldAutodetectArgs from '../fields/ContractVerificationFieldAutodetectArgs';
import ContractVerificationFieldCode from '../fields/ContractVerificationFieldCode';
import ContractVerificationFieldCompiler from '../fields/ContractVerificationFieldCompiler';
import ContractVerificationFieldEvmVersion from '../fields/ContractVerificationFieldEvmVersion';
import ContractVerificationFieldIsYul from '../fields/ContractVerificationFieldIsYul';
import ContractVerificationFieldLibraries from '../fields/ContractVerificationFieldLibraries';
import ContractVerificationFieldName from '../fields/ContractVerificationFieldName';
import ContractVerificationFieldOptimization from '../fields/ContractVerificationFieldOptimization';

const ContractVerificationFlattenSourceCode = ({ config }: { config: SmartContractVerificationConfig }) => {
  const { t: tQuat } = useTranslation();

  return (
    <ContractVerificationMethod title={ tQuat('verification.flattened_title') }>
      { !config?.is_rust_verifier_microservice_enabled && <ContractVerificationFieldName/> }
      { config?.is_rust_verifier_microservice_enabled && <ContractVerificationFieldIsYul/> }
      <ContractVerificationFieldCompiler config={ config }/>
      <ContractVerificationFieldEvmVersion config={ config }/>
      <ContractVerificationFieldOptimization/>
      <ContractVerificationFieldCode/>
      { !config?.is_rust_verifier_microservice_enabled && <ContractVerificationFieldAutodetectArgs/> }
      <ContractVerificationFieldLibraries/>
    </ContractVerificationMethod>
  );
};

export default React.memo(ContractVerificationFlattenSourceCode);
