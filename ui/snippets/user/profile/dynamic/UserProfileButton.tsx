// Modified by Quat Capital, 2026-10-26: account interface localization. GPL-3.0.
import { Box, HStack } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useMarketplaceContext } from 'lib/contexts/marketplace';
import shortenString from 'lib/shortenString';
import useAccountWithDomain from 'lib/web3/useAccountWithDomain';
import { Button, type ButtonProps } from 'toolkit/chakra/button';
import IconSvg from 'ui/shared/IconSvg';

import UserIdenticon from '../../UserIdenticon';
import { getUserHandle } from '../common/utils';

interface Props extends ButtonProps {
  email?: string;
}

const UserProfileButton = ({ selected, email, ...rest }: Props) => {
  const { t: tAcct } = useTranslation();
  const { isAutoConnectDisabled } = useMarketplaceContext();
  const accountWithDomain = useAccountWithDomain(true);

  const isLoading = accountWithDomain.isLoading;

  const content = (() => {
    if (selected && !isLoading) {
      return accountWithDomain.address ? (
        <HStack gap={ 2 }>
          <UserIdenticon address={ accountWithDomain.address } isAutoConnectDisabled={ isAutoConnectDisabled }/>
          <Box display={{ base: 'none', md: 'block' }} maxW="200px" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
            { accountWithDomain.domain || shortenString(accountWithDomain.address) }
          </Box>
        </HStack>
      ) : (
        <HStack gap={ 2 }>
          <IconSvg name="profile" boxSize={ 5 }/>
          <Box display={{ base: 'none', md: 'block' }}>{ email ? getUserHandle(email) : tAcct('accountUI.my_profile') }</Box>
        </HStack>
      );
    }

    return tAcct('accountUI.log_in');
  })();

  return (
    <Button
      px={{ base: 2.5, lg: 3 }}
      selected={ selected }
      highlighted={ isAutoConnectDisabled }
      fontWeight={ selected ? 700 : undefined }
      loading={ isLoading }
      { ...rest }
    >
      { content }
    </Button>
  );
};

export default React.memo(UserProfileButton);
