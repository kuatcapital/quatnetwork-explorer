// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { SmartContractVerificationConfig } from 'types/client/contract';

import ContractVerificationMethod from '../ContractVerificationMethod';
import ContractVerificationFieldCompiler from '../fields/ContractVerificationFieldCompiler';
import ContractVerificationFieldSources from '../fields/ContractVerificationFieldSources';

const FILE_TYPES = [ '.json' as const ];

const ContractVerificationVyperStandardInput = ({ config }: { config: SmartContractVerificationConfig }) => {
  const { t: tQuat } = useTranslation();

  return (
    <ContractVerificationMethod title={ tQuat('verification.vyper_json_title') }>
      <ContractVerificationFieldCompiler config={ config } isVyper/>
      <ContractVerificationFieldSources
        fileTypes={ FILE_TYPES }
        title={ tQuat('verification.standard_json') }
        hint={ tQuat('verification.standard_json_hint') }
        required
      />
    </ContractVerificationMethod>
  );
};

export default React.memo(ContractVerificationVyperStandardInput);
