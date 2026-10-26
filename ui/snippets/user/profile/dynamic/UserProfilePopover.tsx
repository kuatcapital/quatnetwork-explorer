// Modified by Quat Capital, 2026-10-26: account interface localization. GPL-3.0.
import { DynamicConnectButton, useAuthenticateConnectedUser } from '@dynamic-labs/sdk-react-core';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from 'toolkit/chakra/button';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from 'toolkit/chakra/popover';

import UserWalletAutoConnectAlert from '../../UserWalletAutoConnectAlert';
import UserProfileContentWallet from '../common/UserProfileContentWallet';

interface Props {
  children: React.ReactNode;
  isAutoConnectDisabled: boolean;
}

const UserProfilePopover = ({ children, isAutoConnectDisabled }: Props) => {
  const { t: tAcct } = useTranslation();

  const { authenticateUser } = useAuthenticateConnectedUser();

  return (
    <PopoverRoot positioning={{ placement: 'bottom-end' }}>
      <PopoverTrigger>
        { children }
      </PopoverTrigger>
      <PopoverContent w="280px">
        <PopoverBody
          css={{
            '& .dynamic-login-button': {
              width: '100%',
            },
          }}
        >
          { isAutoConnectDisabled && <UserWalletAutoConnectAlert/> }
          <UserProfileContentWallet/>
          <DynamicConnectButton buttonClassName="dynamic-login-button">
            <Button as="div" mt={ 3 } onClick={ authenticateUser } size="sm" w="100%" >{ tAcct('accountUI.log_in') }</Button>
          </DynamicConnectButton>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default React.memo(UserProfilePopover);
