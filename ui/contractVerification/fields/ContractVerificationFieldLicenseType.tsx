// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import { createListCollection } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { FormFields } from '../types';

import { CONTRACT_LICENSES } from 'lib/contracts/licenses';
import type { SelectOption } from 'toolkit/chakra/select';
import { FormFieldSelect } from 'toolkit/components/forms/fields/FormFieldSelect';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

const ContractVerificationFieldLicenseType = () => {
  const { t: tQuat } = useTranslation();
  const collection = React.useMemo(() => createListCollection<SelectOption>({
    items: CONTRACT_LICENSES.map(({ label, title, type }) => ({
      label: type === 'none' ? tQuat('verification.no_license') : `${ title } (${ label })`,
      value: type,
    })),
  }), [ tQuat ]);

  return (
    <ContractVerificationFormRow>
      <FormFieldSelect<FormFields, 'license_type'>
        name="license_type"
        placeholder={ tQuat('verification.contract_license') }
        collection={ collection }
      />
      <span>{ tQuat('verification.license_hint') }</span>
    </ContractVerificationFormRow>
  );
};

export default React.memo(ContractVerificationFieldLicenseType);
