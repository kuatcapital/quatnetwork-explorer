// Modified by Quat Capital, 2026-10-25: runtime transaction interface localization. GPL-3.0.
import { Spinner } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Alert } from 'toolkit/chakra/alert';

const TxPendingAlert = () => {
  const { t: tTx } = useTranslation();
  return (
    <Alert startElement={ <Spinner size="sm" my={ 1 }/> }>
      { tTx('transactions.pending_confirmation') }</Alert>
  );
};

export default TxPendingAlert;
