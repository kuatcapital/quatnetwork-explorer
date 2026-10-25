// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import { createListCollection } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { FormFields } from '../types';
import type { SmartContractVerificationConfig } from 'types/client/contract';

import { Link } from 'toolkit/chakra/link';
import { FormFieldSelect } from 'toolkit/components/forms/fields/FormFieldSelect';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

interface Props {
  isVyper?: boolean;
  config: SmartContractVerificationConfig;
}

const ContractVerificationFieldEvmVersion = ({ isVyper, config }: Props) => {
  const { t: tQuat } = useTranslation();

  const collection = React.useMemo(() => {
    const items = (isVyper ? config?.vyper_evm_versions : config?.solidity_evm_versions)?.map((option) => ({
      label: option === 'default' ? tQuat('verification.sort_default') : option,
      value: option,
    })) || [];

    return createListCollection({ items });
  }, [ config?.solidity_evm_versions, config?.vyper_evm_versions, isVyper, tQuat ]);

  return (
    <ContractVerificationFormRow>
      <FormFieldSelect<FormFields, 'evm_version'>
        name="evm_version"
        placeholder={ tQuat('verification.evm_version') }
        collection={ collection }
        required
      />
      <>
        <span>{ tQuat('verification.evm_version_hint') }{ ' ' }</span>
        <Link
          href={ isVyper ?
            'https://docs.vyperlang.org/en/stable/compiling-a-contract.html#target-options' :
            'https://docs.soliditylang.org/en/latest/using-the-compiler.html#target-options'
          }
          external
          noIcon
        >{ tQuat('verification.evm_details') }</Link>
      </>
    </ContractVerificationFormRow>
  );
};

export default React.memo(ContractVerificationFieldEvmVersion);
