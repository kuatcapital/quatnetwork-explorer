// Modified by Quat Capital, 2026-10-26: runtime locale for block and statistics UI. GPL-3.0.
import { Text } from '@chakra-ui/react';
import React from 'react';
import { Trans } from 'react-i18next';

import { Alert } from 'toolkit/chakra/alert';
import { Link } from 'toolkit/chakra/link';

function ChartsLoadingErrorAlert() {
  return (
    <Alert status="warning" mb={ 4 } closable>
      <Text mr={ 2 }>
        <Trans i18nKey="statistics.loading_error" components={{ reload: <Link href={ window.document.location.href }/> }}/>
      </Text>
    </Alert>
  );
}

export default ChartsLoadingErrorAlert;
