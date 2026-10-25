// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { FormFields } from '../types';
import type { SmartContractVerificationConfig } from 'types/client/contract';

import { FormFieldText } from 'toolkit/components/forms/fields/FormFieldText';

import ContractVerificationFormRow from '../ContractVerificationFormRow';
import ContractVerificationMethod from '../ContractVerificationMethod';
import ContractVerificationFieldCommit from '../fields/ContractVerificationFieldCommit';
import ContractVerificationFieldCompiler from '../fields/ContractVerificationFieldCompiler';
import ContractVerificationFieldGitHubRepo from '../fields/ContractVerificationFieldGitHubRepo';

const ContractVerificationStylusGitHubRepo = ({ config }: { config: SmartContractVerificationConfig }) => {
  const { t: tQuat } = useTranslation();

  const [ latestCommitHash, setLatestCommitHash ] = React.useState<string | undefined>(undefined);

  return (
    <ContractVerificationMethod title={ tQuat('verification.stylus_title') }>
      <ContractVerificationFieldCompiler config={ config } isStylus/>
      <ContractVerificationFieldGitHubRepo onCommitHashChange={ setLatestCommitHash }/>
      <ContractVerificationFieldCommit latestCommitHash={ latestCommitHash }/>

      <ContractVerificationFormRow>
        <FormFieldText<FormFields>
          name="path_prefix"
          placeholder={ tQuat('verification.path_prefix') }
        />
        <span>{ tQuat('verification.crate_hint') }</span>
      </ContractVerificationFormRow>
    </ContractVerificationMethod>
  );
};

export default React.memo(ContractVerificationStylusGitHubRepo);
