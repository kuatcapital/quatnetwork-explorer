// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { FormFields } from '../types';

import { FormFieldText } from 'toolkit/components/forms/fields/FormFieldText';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

interface Props {
  isVyper?: boolean;
}

const ContractVerificationFieldCode = ({ isVyper }: Props) => {
  const { t: tQuat } = useTranslation();

  return (
    <ContractVerificationFormRow>
      <FormFieldText<FormFields>
        name="code"
        required
        placeholder={ tQuat('verification.contract_code') }
        asComponent="Textarea"
      />
      { isVyper ? null : (
        <span>{ tQuat('verification.code_dependencies_hint') }</span>
      ) }
    </ContractVerificationFormRow>
  );
};

export default React.memo(ContractVerificationFieldCode);
