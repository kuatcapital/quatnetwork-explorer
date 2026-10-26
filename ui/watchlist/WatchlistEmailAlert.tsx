// Modified by Quat Capital, 2026-10-26: account interface localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import config from 'configs/app';
import { Alert } from 'toolkit/chakra/alert';
import { Button } from 'toolkit/chakra/button';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import AuthModal from 'ui/snippets/auth/AuthModal';
import useLinkEmail from 'ui/snippets/auth/linkEmail/useLinkEmail';

const feature = config.features.account;

const WatchlistEmailAlert = () => {
  const { t: tAcct } = useTranslation();
  const authModal = useDisclosure();
  const linkEmail = useLinkEmail();

  const handleButtonClick = React.useCallback(() => {
    if (feature.isEnabled && feature.authProvider === 'dynamic') {
      linkEmail();
    } else {
      authModal.onOpen();
    }
  }, [ authModal, linkEmail ]);

  return (
    <>
      <Alert
        status="info"
        descriptionProps={{ alignItems: 'center', gap: 2 }}
        w="fit-content"
        mb={ 6 }
      >
        { tAcct('accountUI.notifications_email_required') }
        <Button variant="outline" size="sm" onClick={ handleButtonClick }>{ tAcct('accountUI.add_email') }</Button>
      </Alert>
      { authModal.open && <AuthModal initialScreen={{ type: 'email', isAuth: true }} onClose={ authModal.onClose }/> }
    </>
  );
};

export default React.memo(WatchlistEmailAlert);
