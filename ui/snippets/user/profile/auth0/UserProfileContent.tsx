// Modified by Quat Capital, 2026-10-26: account interface localization. GPL-3.0.
import { Box, Separator, Flex, VStack } from '@chakra-ui/react';
import type { TFunction } from 'i18next';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { NavLink } from './types';
import type { UserInfo } from 'types/api/account';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import { useMarketplaceContext } from 'lib/contexts/marketplace';
import shortenString from 'lib/shortenString';
import { Button } from 'toolkit/chakra/button';
import { Link } from 'toolkit/chakra/link';
import { Hint } from 'toolkit/components/Hint/Hint';
import { TruncatedText } from 'toolkit/components/truncation/TruncatedText';
import useLogout from 'ui/snippets/auth/useLogout';

import UserWalletAutoConnectAlert from '../../UserWalletAutoConnectAlert';
import UserProfileContentWallet from '../common/UserProfileContentWallet';
import UserProfileContentNavLink from './UserProfileContentNavLink';

const getNavLinks = (tAcct: TFunction): Array<NavLink> => [
  {
    text: tAcct('accountUI.my_profile'),
    href: route({ pathname: '/auth/profile' }),
    icon: 'profile' as const,
  },
  {
    text: tAcct('accountUI.watchlist'),
    href: route({ pathname: '/account/watchlist' }),
    icon: 'star_outline' as const,
  },
  {
    text: tAcct('accountUI.private_tags'),
    href: route({ pathname: '/account/tag-address' }),
    icon: 'private_tags' as const,
  },
  {
    text: tAcct('accountUI.api_keys'),
    href: route({ pathname: '/account/api-key' }),
    icon: 'API' as const,
  },
  {
    text: tAcct('accountUI.custom_abi'),
    href: route({ pathname: '/account/custom-abi' }),
    icon: 'ABI' as const,
  },
  config.features.addressVerification.isEnabled && {
    text: tAcct('accountUI.verified_addresses_short'),
    href: route({ pathname: '/account/verified-addresses' }),
    icon: 'verified' as const,
  },
].filter(Boolean);

interface Props {
  data: UserInfo | undefined;
  onClose: () => void;
  onLogin: () => void;
  onAddEmail: () => void;
  onAddAddress: () => void;
}

const UserProfileContent = ({ data, onClose, onLogin, onAddEmail, onAddAddress }: Props) => {
  const { t: tAcct } = useTranslation();
  const navLinks = React.useMemo(() => getNavLinks(tAcct), [ tAcct ]);
  const { isAutoConnectDisabled } = useMarketplaceContext();
  const logout = useLogout();

  const handleLogoutClick = React.useCallback(() => {
    logout();
    onClose();
  }, [ logout, onClose ]);

  if (!data) {
    return (
      <Box>
        { isAutoConnectDisabled && <UserWalletAutoConnectAlert/> }
        { config.features.blockchainInteraction.isEnabled && <UserProfileContentWallet onClose={ onClose }/> }
        <Button mt={ 3 } onClick={ onLogin } size="sm" w="100%">{ tAcct('accountUI.log_in') }</Button>
      </Box>
    );
  }

  return (
    <Box>
      { isAutoConnectDisabled && <UserWalletAutoConnectAlert/> }

      <Box textStyle="xs" fontWeight="500" px={ 1 } mb="1">{ tAcct('accountUI.account') }</Box>
      <Box
        textStyle="xs"
        fontWeight="500"
        borderColor="border.divider"
        borderWidth="1px"
        borderRadius="base"
        color="text.secondary"
      >
        { config.features.blockchainInteraction.isEnabled && (
          <Flex p={ 2 } borderColor="border.divider" borderBottomWidth="1px">
            <Box>{ tAcct('accountUI.address') }</Box>
            <Hint
              label={ tAcct(config.features.rewards.isEnabled ? 'accountUI.linked_wallet_rewards_hint' : 'accountUI.linked_wallet_hint') }
              boxSize={ 4 }
              ml={ 1 }
            />
            { data?.address_hash ?
              <Box ml="auto">{ shortenString(data?.address_hash) }</Box> : <Link ml="auto" onClick={ onAddAddress }>{ tAcct('accountUI.add_address') }</Link> }
          </Flex>
        ) }
        <Flex p={ 2 } columnGap={ 4 }>
          <Box mr="auto">{ tAcct('accountUI.email') }</Box>
          { data?.email ?
            <TruncatedText text={ data.email }/> : <Link onClick={ onAddEmail }>{ tAcct('accountUI.add_email') }</Link> }
        </Flex>
      </Box>

      { config.features.blockchainInteraction.isEnabled && <UserProfileContentWallet onClose={ onClose } mt={ 3 }/> }

      <VStack as="ul" gap="0" alignItems="flex-start" overflow="hidden" mt={ 4 }>
        { navLinks.map((item) => (
          <UserProfileContentNavLink
            key={ item.href }
            { ...item }
            onClick={ onClose }
          />
        )) }
      </VStack>

      <Separator my={ 1 }/>

      <UserProfileContentNavLink
        text={ tAcct('accountUI.sign_out') }
        icon="sign_out"
        onClick={ handleLogoutClick }
      />
    </Box>
  );
};

export default React.memo(UserProfileContent);
