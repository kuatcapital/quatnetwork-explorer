// Modified by Quat Capital, 2026-10-25: runtime transaction interface localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Alert } from 'toolkit/chakra/alert';
import { Link } from 'toolkit/chakra/link';
interface Props {
  status: 'error' | 'close';
}

const TxSocketAlert = ({ status }: Props) => {
  const { t: tTx } = useTranslation();
  const text = status === 'close' ?
    tTx('transactions.socket_closed') :
    tTx('transactions.socket_error');
  const handleReload = React.useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.location.reload();
  }, []);

  return (
    <Link href="#" onClick={ handleReload } asChild>
      <Alert status="warning">{ text }</Alert>
    </Link>
  );
};

export default React.memo(TxSocketAlert);
