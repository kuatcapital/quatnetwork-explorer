// Modified by Quat Capital, 2026-10-26: runtime default form labels. GPL-3.0.
import React from 'react';
import type { FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { FormFieldPropsBase } from './types';
import type { PartialBy } from 'types/utils';

import { addressValidator } from '../validators/address';
import { FormFieldText } from './FormFieldText';

const FormFieldAddressContent = <FormFields extends FieldValues>(
  props: PartialBy<FormFieldPropsBase<FormFields>, 'placeholder'>,
) => {
  const { t } = useTranslation();
  const rules = React.useMemo(
    () => ({
      ...props.rules,
      validate: {
        ...props.rules?.validate,
        address: addressValidator,
      },
    }),
    [ props.rules ],
  );

  return (
    <FormFieldText
      { ...props }
      placeholder={ props.placeholder || t('toolkit.address') }
      rules={ rules }
    />
  );
};

export const FormFieldAddress = React.memo(FormFieldAddressContent) as typeof FormFieldAddressContent;
