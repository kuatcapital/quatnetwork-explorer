// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { FormFields } from '../types';

import { FormFieldCheckbox } from 'toolkit/components/forms/fields/FormFieldCheckbox';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

const ContractVerificationFieldIsYul = () => {
  const { t: tQuat } = useTranslation();

  return (
    <ContractVerificationFormRow>
      <FormFieldCheckbox<FormFields, 'is_yul'>
        name="is_yul"
        label={ tQuat('verification.is_yul') }
      />
    </ContractVerificationFormRow>
  );
};

export default React.memo(ContractVerificationFieldIsYul);
