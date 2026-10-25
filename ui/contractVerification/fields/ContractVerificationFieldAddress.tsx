// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { FormFields } from '../types';

import { Heading } from 'toolkit/chakra/heading';
import { FormFieldAddress } from 'toolkit/components/forms/fields/FormFieldAddress';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

interface Props {
  readOnly?: boolean;
}

const ContractVerificationFieldAddress = ({ readOnly }: Props) => {
  const { t: tQuat } = useTranslation();

  return (
    <>
      <ContractVerificationFormRow>
        <Heading level="2">{ tQuat('verification.address_heading') }</Heading>
      </ContractVerificationFormRow>
      <ContractVerificationFormRow>
        <FormFieldAddress<FormFields>
          name="address"
          required
          placeholder={ tQuat('verification.address_placeholder') }
          readOnly={ readOnly }
        />
      </ContractVerificationFormRow>
    </>
  );
};

export default React.memo(ContractVerificationFieldAddress);
