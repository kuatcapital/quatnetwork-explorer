// Modified by Quat Capital, 2026-10-25: localize contract verification interface. GPL-3.0.
import { chakra, Code } from '@chakra-ui/react';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import type { FormFields } from '../types';

import { FormFieldText } from 'toolkit/components/forms/fields/FormFieldText';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

interface Props {
  hint?: string;
}

const ContractVerificationFieldName = ({ hint }: Props) => {
  const { t: tQuat } = useTranslation();
  return (
    <ContractVerificationFormRow>
      <FormFieldText<FormFields>
        name="name"
        required
        placeholder={ tQuat('verification.contract_name') }
        rules={{ maxLength: 255 }}
      />
      { hint ? <span>{ hint }</span> : (
        <Trans
          i18nKey="verification.name_hint"
          components={{ code: <Code color="text.secondary"/>, name: <chakra.span fontWeight={ 600 }/> }}
        />
      ) }
    </ContractVerificationFormRow>
  );
};

export default React.memo(ContractVerificationFieldName);
