// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import type { FormFields } from '../types';

import { Link } from 'toolkit/chakra/link';
import { FormFieldText } from 'toolkit/components/forms/fields/FormFieldText';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

const ContractVerificationFieldConstructorArgs = () => {
  const { t: tQuat } = useTranslation();

  return (
    <ContractVerificationFormRow>
      <FormFieldText<FormFields>
        name="constructor_args"
        required
        rules={{ maxLength: 255 }}
        placeholder={ tQuat('verification.constructor_args') }
        asComponent="Textarea"
      />
      <Trans
        i18nKey="verification.constructor_hint"
        components={{
          abi: <Link href="https://solidity.readthedocs.io/en/develop/abi-spec.html" external noIcon/>,
          parser: <Link href="https://abi.hashex.org/" external noIcon/>,
        }}
      />
    </ContractVerificationFormRow>
  );
};

export default React.memo(ContractVerificationFieldConstructorArgs);
