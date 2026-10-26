// Modified by Quat Capital, 2026-10-26: runtime default form labels. GPL-3.0.
import React from 'react';
import type { FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { FormFieldPropsBase } from './types';
import type { PartialBy } from 'types/utils';

import { EMAIL_REGEXP } from '../validators/email';
import { FormFieldText } from './FormFieldText';

const FormFieldEmailContent = <FormFields extends FieldValues>(
  props: PartialBy<FormFieldPropsBase<FormFields>, 'placeholder'>,
) => {
  const { t } = useTranslation();
  const rules = React.useMemo(
    () => ({
      ...props.rules,
      pattern: EMAIL_REGEXP,
    }),
    [ props.rules ],
  );

  return (
    <FormFieldText
      { ...props }
      placeholder={ props.placeholder || t('toolkit.email') }
      rules={ rules }
    />
  );
};

export const FormFieldEmail = React.memo(FormFieldEmailContent) as typeof FormFieldEmailContent;
