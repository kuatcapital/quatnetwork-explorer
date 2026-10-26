// Modified by Quat Capital, 2026-10-26: account interface localization. GPL-3.0.
import { Box, Text } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { UserInfo } from 'types/api/account';

import config from 'configs/app';
import { Button } from 'toolkit/chakra/button';
import { Heading } from 'toolkit/chakra/heading';
import { Link } from 'toolkit/chakra/link';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';

interface Props {
  profileQuery: UseQueryResult<UserInfo, unknown>;
  onAddWallet: () => void;
}

const MyProfileWallet = ({ profileQuery, onAddWallet }: Props) => {
  const { t: tAcct } = useTranslation();

  return (
    <section>
      <Heading level="2" mb={ 3 }>{ tAcct('accountUI.linked_wallet') }</Heading>
      <Text mb={ 3 } >
        { tAcct(config.features.rewards.isEnabled ? 'accountUI.wallet_login_rewards' : 'accountUI.wallet_login') }{ ' ' }
        { config.features.rewards.isEnabled && (
          <Link external href="https://docs.blockscout.com/using-blockscout/merits" ml={ 1 }>
            { tAcct('accountUI.learn_more') }</Link>
        ) }
      </Text>
      { profileQuery.data?.address_hash ? (
        <Box px={ 3 } py="18px" bgColor={{ _light: 'blackAlpha.50', _dark: 'whiteAlpha.50' }} borderRadius="base">
          <AddressEntity
            address={{ hash: profileQuery.data.address_hash }}
            fontWeight="500"
            noAltHash
          />
        </Box>
      ) : <Button size="sm" onClick={ onAddWallet }>{ tAcct('accountUI.link_wallet') }</Button> }
    </section>
  );
};

export default React.memo(MyProfileWallet);
