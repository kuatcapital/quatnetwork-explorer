// Modified by Quat Capital, 2026-10-26: marketplace, rewards or token info localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { Fields } from '../types';

import type { FieldProps } from 'toolkit/chakra/field';
import { FormFieldText } from 'toolkit/components/forms/fields/FormFieldText';
import { emailValidator } from 'toolkit/components/forms/validators/email';
import { urlValidator } from 'toolkit/components/forms/validators/url';

interface Props {
  readOnly?: boolean;
  size?: FieldProps['size'];
}

const TokenInfoFieldSupport = (props: Props) => {
  const { t: tEco } = useTranslation();
  const validate = React.useCallback((newValue: string | undefined) => {
    if (typeof newValue !== 'string') {
      return true;
    }

    const urlValidationResult = urlValidator(newValue);
    const emailValidationResult = emailValidator(newValue);

    if (urlValidationResult === true || emailValidationResult === true) {
      return true;
    }

    return tEco('tokenInfoUI.invalid_format');
  }, [ tEco ]);

  return (
    <FormFieldText<Fields, 'support'>
      name="support"
      placeholder={ tEco('tokenInfoUI.support_url_email') }
      rules={{ validate }}
      { ...props }
    />
  );
};

export default React.memo(TokenInfoFieldSupport);
