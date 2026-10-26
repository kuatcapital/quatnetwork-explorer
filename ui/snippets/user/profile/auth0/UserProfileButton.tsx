// Modified by Quat Capital, 2026-10-26: account interface localization. GPL-3.0.
import type { ButtonProps } from '@chakra-ui/react';
import { Box, HStack } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { UserInfo } from 'types/api/account';

import { useMarketplaceContext } from 'lib/contexts/marketplace';
import useIsMobile from 'lib/hooks/useIsMobile';
import shortenString from 'lib/shortenString';
import useWeb3AccountWithDomain from 'lib/web3/useAccountWithDomain';
import { Button } from 'toolkit/chakra/button';
import { Tooltip } from 'toolkit/chakra/tooltip';
import IconSvg from 'ui/shared/IconSvg';

import UserIdenticon from '../../UserIdenticon';
import { getUserHandle } from '../common/utils';

interface Props {
  profileQuery: UseQueryResult<UserInfo, unknown>;
  size?: ButtonProps['size'];
  variant?: ButtonProps['variant'];
  onClick: () => void;
  isPending?: boolean;
}

const UserProfileButton = ({ profileQuery, size, variant, onClick, isPending, ...rest }: Props, ref: React.ForwardedRef<HTMLButtonElement>) => {
  const { t: tAcct } = useTranslation();
  const [ isFetched, setIsFetched ] = useState(false);
  const isMobile = useIsMobile();

  const { data, isLoading } = profileQuery;
  const web3AccountWithDomain = useWeb3AccountWithDomain(true);
  const { isAutoConnectDisabled } = useMarketplaceContext();

  React.useEffect(() => {
    if (!isLoading) {
      setIsFetched(true);
    }
  }, [ isLoading ]);

  const handleFocus = useCallback((e: React.FocusEvent<HTMLButtonElement>) => {
    e.preventDefault();
  }, []);

  const isButtonLoading = isPending || !isFetched || web3AccountWithDomain.isLoading;
  const dataExists = !isButtonLoading && (Boolean(data) || Boolean(web3AccountWithDomain.address));

  const content = (() => {
    if (web3AccountWithDomain.address && !isButtonLoading) {
      return (
        <HStack gap={ 2 }>
          <UserIdenticon address={ web3AccountWithDomain.address } isAutoConnectDisabled={ isAutoConnectDisabled }/>
          <Box display={{ base: 'none', md: 'block' }} maxW="200px" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
            { web3AccountWithDomain.domain || shortenString(web3AccountWithDomain.address) }
          </Box>
        </HStack>
      );
    }

    if (!data || isButtonLoading) {
      return tAcct('accountUI.log_in');
    }

    return (
      <HStack gap={ 2 }>
        <IconSvg name="profile" boxSize={ 5 }/>
        <Box display={{ base: 'none', md: 'block' }}>{ data.email ? getUserHandle(data.email) : tAcct('accountUI.my_profile') }</Box>
      </HStack>
    );
  })();

  return (
    <Tooltip
      content={ tAcct('accountUI.profile_login_hint') }
      disabled={ isMobile || isLoading || Boolean(data) }
      openDelay={ 500 }
      disableOnMobile
    >
      <span>
        <Button
          ref={ ref }
          size={ size }
          variant={ variant }
          onClick={ onClick }
          onFocus={ handleFocus }
          selected={ dataExists }
          highlighted={ isAutoConnectDisabled }
          px={{ base: 2.5, lg: 3 }}
          fontWeight={ dataExists ? 700 : 600 }
          loading={ isButtonLoading }
          { ...rest }
        >
          { content }
        </Button>
      </span>
    </Tooltip>
  );
};

export default React.forwardRef(UserProfileButton);
