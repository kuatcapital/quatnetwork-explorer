// Modified by Quat Capital, 2026-10-26: account interface localization. GPL-3.0.
import { chakra, Box, Text, Flex } from '@chakra-ui/react';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import type { Screen } from '../types';
import type { UserInfo } from 'types/api/account';

import config from 'configs/app';
import shortenString from 'lib/shortenString';
import { Button } from 'toolkit/chakra/button';

interface Props {
  address: string;
  onAddEmail: (screen: Screen) => void;
  onClose: () => void;
  isAuth?: boolean;
  profile: UserInfo | undefined;
  rewardsToken?: string;
}

const AuthModalScreenSuccessWallet = ({ address, onAddEmail, onClose, isAuth, profile, rewardsToken }: Props) => {
  const { t: tAcct } = useTranslation();
  const handleAddEmailClick = React.useCallback(() => {
    onAddEmail({ type: 'email', isAuth: true });
  }, [ onAddEmail ]);

  if (isAuth) {
    return (
      <Box>
        <Text>
          <Trans
            i18nKey="accountUI.wallet_linked"
            values={{ address: shortenString(address) }}
            components={{ strong: <chakra.span fontWeight="700"/> }}
          />
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
        <Trans
          i18nKey={ rewardsToken ? 'accountUI.wallet_rewards_logged_in' : 'accountUI.wallet_logged_in' }
          values={{ address: shortenString(address) }}
          components={{ strong: <chakra.span fontWeight="700"/> }}
        />
      </Text>
      { !profile?.email ? (
        <>
          <Text mt={ 6 }>
            { tAcct(config.features.rewards.isEnabled ? 'accountUI.email_rewards_invitation' : 'accountUI.email_invitation') }
          </Text>
          <Flex mt={ 6 } gap={ 6 }>
            <Button onClick={ handleAddEmailClick }>{ tAcct('accountUI.add_email') }</Button>
            <Button variant="link" onClick={ onClose }>{ tAcct('accountUI.later') }</Button>
          </Flex>
        </>
      ) : (
        <Button
          mt={ 6 }
          variant="outline"
          onClick={ onClose }
        >
          { tAcct('accountUI.got_it') }</Button>
      ) }
    </Box>
  );
};

export default React.memo(AuthModalScreenSuccessWallet);
