// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { SmartContractVerificationConfig } from 'types/client/contract';

import config from 'configs/app';

import ContractVerificationMethod from '../ContractVerificationMethod';
import ContractVerificationFieldAutodetectArgs from '../fields/ContractVerificationFieldAutodetectArgs';
import ContractVerificationFieldCompiler from '../fields/ContractVerificationFieldCompiler';
import ContractVerificationFieldName from '../fields/ContractVerificationFieldName';
import ContractVerificationFieldSources from '../fields/ContractVerificationFieldSources';
import ContractVerificationFieldZkCompiler from '../fields/ContractVerificationFieldZkCompiler';

const FILE_TYPES = [ '.json' as const ];
const rollupFeature = config.features.rollup;

const ContractVerificationStandardInput = ({ config }: { config: SmartContractVerificationConfig }) => {
  const { t: tQuat } = useTranslation();

  return (
    <ContractVerificationMethod title={ tQuat('verification.solidity_json_title') } disableScroll={ config.verification_options.length === 1 }>
      { !config?.is_rust_verifier_microservice_enabled && <ContractVerificationFieldName/> }
      <ContractVerificationFieldCompiler config={ config }/>
      { rollupFeature.isEnabled && rollupFeature.type === 'zkSync' && <ContractVerificationFieldZkCompiler config={ config }/> }
      <ContractVerificationFieldSources
        fileTypes={ FILE_TYPES }
        title={ tQuat('verification.standard_json') }
        hint={ tQuat('verification.standard_json_hint') }
        required
      />
      { !config?.is_rust_verifier_microservice_enabled && <ContractVerificationFieldAutodetectArgs/> }
    </ContractVerificationMethod>
  );
};

export default React.memo(ContractVerificationStandardInput);
