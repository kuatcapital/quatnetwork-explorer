// Modified by Quat Capital, 2026-10-26: account interface localization. GPL-3.0.
import { chakra, Box, Text } from '@chakra-ui/react';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import type { Screen } from '../types';
import type { UserInfo } from 'types/api/account';

import config from 'configs/app';
import { Button } from 'toolkit/chakra/button';

interface Props {
  email: string;
  onConnectWallet: (screen: Screen) => void;
  onClose: () => void;
  isAuth?: boolean;
  profile: UserInfo | undefined;
}

const AuthModalScreenSuccessEmail = ({ email, onConnectWallet, onClose, isAuth, profile }: Props) => {
  const { t: tAcct } = useTranslation();
  const handleConnectWalletClick = React.useCallback(() => {
    onConnectWallet({ type: 'connect_wallet', isAuth: true, loginToRewards: true });
  }, [ onConnectWallet ]);

  if (isAuth) {
    return (
      <Box>
        <Text>
          <Trans i18nKey="accountUI.email_linked" values={{ email }} components={{ strong: <chakra.span fontWeight="700"/> }}/>
        </Text>
        <Button
          mt={ 6 }
          variant="outline"
          onClick={ onClose }
        >
          { tAcct('accountUI.got_it') }</Button>
      </Box>
    );
  }

  return (
    <Box>
      <Text>
        <Trans i18nKey="accountUI.email_logged_in" values={{ email }} components={{ strong: <chakra.span fontWeight="700"/> }}/>
      </Text>
      { !profile?.address_hash && config.features.blockchainInteraction.isEnabled ? (
        <>
          <Text mt={ 6 }>{ tAcct('accountUI.web3_invitation') }</Text>
          <Button mt={ 6 } onClick={ handleConnectWalletClick }>{ tAcct('accountUI.connect_wallet') }</Button>
        </>
      ) : (
        <Button
          variant="outline"
          mt={ 6 }
          onClick={ onClose }
        >
          { tAcct('accountUI.got_it') }</Button>
      ) }
    </Box>
  );
};

export default React.memo(AuthModalScreenSuccessEmail);
