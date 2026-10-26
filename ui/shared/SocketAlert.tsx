// Modified by Quat Capital, 2026-10-26: localize the complete connection warning. GPL-3.0.
import { chakra } from '@chakra-ui/react';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Alert } from 'toolkit/chakra/alert';
import { Link } from 'toolkit/chakra/link';

interface Props {
  className?: string;
}

const SocketAlert = ({ className }: Props) => {
  const { t } = useTranslation();
  const handleReload = React.useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.location.reload();
  }, []);
  return (
    <Alert status="warning" className={ className }>
      <Trans
        t={ t }
        i18nKey="sharedUi.connection_lost"
        components={{ reload: <Link href="" onClick={ handleReload }/> }}
      />
    </Alert>
  );
};

export default chakra(SocketAlert);
