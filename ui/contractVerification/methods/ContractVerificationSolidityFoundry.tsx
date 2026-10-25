// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import { Box, Flex } from '@chakra-ui/react';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';

import type { FormFields } from '../types';

import config from 'configs/app';
import { Link } from 'toolkit/chakra/link';

import ContractVerificationFormCodeSnippet from '../ContractVerificationFormCodeSnippet';
import ContractVerificationFormRow from '../ContractVerificationFormRow';
import ContractVerificationMethod from '../ContractVerificationMethod';

const ContractVerificationSolidityFoundry = () => {
  const { t: tQuat } = useTranslation();

  const { watch } = useFormContext<FormFields>();
  const address = watch('address');
  const generalApiEndpoint = config.apis.general ?
    `${ config.apis.general.endpoint }${ config.apis.general.basePath ?? '' }` : '';

  const codeSnippet = `forge verify-contract \\
  --rpc-url ${ config.chain.rpcUrls[0] || (generalApiEndpoint ? `${ generalApiEndpoint }/api/eth-rpc` : '') } \\
  --verifier blockscout \\
  --verifier-url '${ generalApiEndpoint ? `${ generalApiEndpoint }/api/` : '' }' \\
  ${ address || '<address>' } \\
  [contractFile]:[contractName]`;

  return (
    <ContractVerificationMethod title={ tQuat('verification.foundry_title') }>
      <ContractVerificationFormRow>
        <Flex flexDir="column">
          <ContractVerificationFormCodeSnippet code={ codeSnippet }/>
        </Flex>
        <Box whiteSpace="pre-wrap">
          <Trans
            i18nKey="verification.foundry_tutorial"
            components={{ docs: <Link href="https://docs.blockscout.com/devs/verification/foundry-verification" external/> }}
          />
        </Box>
      </ContractVerificationFormRow>
    </ContractVerificationMethod>
  );
};

export default React.memo(ContractVerificationSolidityFoundry);
