// Modified by Quat Capital, 2026-10-26: account interface localization. GPL-3.0.
import type { ButtonProps } from '@chakra-ui/react';
import { Box, HStack } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import useIsMobile from 'lib/hooks/useIsMobile';
import shortenString from 'lib/shortenString';
import { Button } from 'toolkit/chakra/button';
import { Tooltip } from 'toolkit/chakra/tooltip';

import UserIdenticon from '../UserIdenticon';

interface Props {
  size?: ButtonProps['size'];
  variant?: ButtonProps['variant'];
  isPending?: boolean;
  isAutoConnectDisabled?: boolean;
  address?: string;
  domain?: string;
}

const UserWalletButton = ({ size, variant, isPending, isAutoConnectDisabled, address, domain, ...rest }: Props, ref: React.ForwardedRef<HTMLButtonElement>) => {
  const { t: tAcct } = useTranslation();

  const isMobile = useIsMobile();

  const content = (() => {
    if (!address) {
      return tAcct('accountUI.connect');
    }

    const text = domain || shortenString(address);

    return (
      <HStack gap={ 2 }>
        <UserIdenticon address={ address } isAutoConnectDisabled={ isAutoConnectDisabled }/>
        <Box display={{ base: 'none', md: 'block' }}>{ text }</Box>
      </HStack>
    );
  })();

  return (
    <Tooltip
      content={ tAcct('accountUI.connect_wallet_hint') }
      disabled={ isMobile || Boolean(address) }
      openDelay={ 500 }
      disableOnMobile
    >
      <span>
        <Button
          ref={ ref }
          size={ size }
          variant={ variant }
          selected={ Boolean(address) }
          highlighted={ isAutoConnectDisabled }
          px={{ base: 2.5, lg: 3 }}
          fontWeight={ address ? 700 : 600 }
          loading={ isPending }
          loadingText={ isMobile ? undefined : tAcct('accountUI.connecting') }
          { ...rest }
        >
          { content }
        </Button>
      </span>
    </Tooltip>
  );
};

export default React.memo(React.forwardRef(UserWalletButton));
