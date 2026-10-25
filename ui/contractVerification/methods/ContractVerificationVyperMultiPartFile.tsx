// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import type { SmartContractVerificationConfig } from 'types/client/contract';

import { Link } from 'toolkit/chakra/link';

import ContractVerificationMethod from '../ContractVerificationMethod';
import ContractVerificationFieldCompiler from '../fields/ContractVerificationFieldCompiler';
import ContractVerificationFieldEvmVersion from '../fields/ContractVerificationFieldEvmVersion';
import ContractVerificationFieldSources from '../fields/ContractVerificationFieldSources';

const MAIN_SOURCES_TYPES = [ '.vy' as const ];
const INTERFACE_TYPES = [ '.vy' as const, '.json' as const ];

const ContractVerificationVyperMultiPartFile = ({ config }: { config: SmartContractVerificationConfig }) => {
  const { t: tQuat } = useTranslation();

  const interfacesHint = (
    <Trans
      i18nKey="verification.vyper_interfaces_hint"
      components={{ docs: <Link href="https://docs.vyperlang.org/en/stable/interfaces.html" external noIcon/> }}
    />
  );

  return (
    <ContractVerificationMethod title={ tQuat('verification.vyper_multi_title') }>
      <ContractVerificationFieldCompiler config={ config } isVyper/>
      <ContractVerificationFieldEvmVersion isVyper config={ config }/>
      <ContractVerificationFieldSources
        name="sources"
        fileTypes={ MAIN_SOURCES_TYPES }
        title={ tQuat('verification.upload_vyper') }
        hint={ tQuat('verification.vyper_primary_hint') }
        required
      />
      <ContractVerificationFieldSources
        name="interfaces"
        fileTypes={ INTERFACE_TYPES }
        multiple
        fullFilePath
        title={ tQuat('verification.vyper_interfaces') }
        hint={ interfacesHint }
      />
    </ContractVerificationMethod>
  );
};

export default React.memo(ContractVerificationVyperMultiPartFile);
