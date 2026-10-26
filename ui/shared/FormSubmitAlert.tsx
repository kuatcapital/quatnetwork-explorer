// Modified by Quat Capital, 2026-10-26: localize shared controls, details and data feedback. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Alert } from 'toolkit/chakra/alert';

const FormSubmitAlert = () => {
  const { t } = useTranslation();
  return (
    <Alert status="error">
      { t('sharedUi.submit_error') }
    </Alert>
  );
};

export default FormSubmitAlert;
