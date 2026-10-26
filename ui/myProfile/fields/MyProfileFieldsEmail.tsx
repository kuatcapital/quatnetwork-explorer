// Modified by Quat Capital, 2026-10-26: account interface localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { FormFields } from '../types';

import { FormFieldEmail } from 'toolkit/components/forms/fields/FormFieldEmail';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  isReadOnly?: boolean;
  defaultValue: string | undefined;
}

const MyProfileFieldsEmail = ({ isReadOnly, defaultValue }: Props) => {
  const { t: tAcct } = useTranslation();

  return (
    <FormFieldEmail<FormFields>
      name="email"
      placeholder={ tAcct('accountUI.email') }
      required
      readOnly={ isReadOnly }
      helperText={ tAcct('accountUI.email_placeholder') }
      group={{
        endElement: ({ field }) => {
          const isVerified = defaultValue && field.value === defaultValue;
          return isVerified ? <IconSvg name="certified" boxSize={ 5 } color="green.500" mx={ 5 }/> : null;
        },
      }}
    />
  );
};

export default React.memo(MyProfileFieldsEmail);
