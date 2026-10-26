// Modified by Quat Capital, 2026-10-26: localize shared controls, details and data feedback. GPL-3.0.
import { chakra } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Alert } from 'toolkit/chakra/alert';

const DataFetchAlert = ({ className }: { className?: string }) => {
  const { t } = useTranslation();
  return (
    <Alert status="warning" width="fit-content" className={ className }>
      { t('sharedUi.fetch_error') }
    </Alert>
  );
};

export default chakra(DataFetchAlert);
