// Modified by Quat Capital, 2026-10-26: account interface localization. GPL-3.0.
import { Flex } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { Screen } from 'ui/snippets/auth/types';

import config from 'configs/app';
import { ContentLoader } from 'toolkit/components/loaders/ContentLoader';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import MyProfileEmail from 'ui/myProfile/MyProfileEmail';
import MyProfileWallet from 'ui/myProfile/MyProfileWallet';
import AccountPageDescription from 'ui/shared/AccountPageDescription';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import PageTitle from 'ui/shared/Page/PageTitle';
import AuthModal from 'ui/snippets/auth/AuthModal';
import useProfileQuery from 'ui/snippets/auth/useProfileQuery';
import useRedirectForInvalidAuthToken from 'ui/snippets/auth/useRedirectForInvalidAuthToken';

const MIXPANEL_CONFIG = {
  wallet_connect: {
    source: 'Profile' as const,
  },
  account_link_info: {
    source: 'Profile' as const,
  },
};

const MyProfile = () => {
  const { t: tAcct } = useTranslation();
  const [ authInitialScreen, setAuthInitialScreen ] = React.useState<Screen>();
  const authModal = useDisclosure();

  const profileQuery = useProfileQuery();
  useRedirectForInvalidAuthToken();

  const handleAddWalletClick = React.useCallback(() => {
    setAuthInitialScreen({ type: 'connect_wallet', isAuth: true, loginToRewards: true });
    authModal.onOpen();
  }, [ authModal ]);

  const content = (() => {
    if (profileQuery.isPending) {
      return <ContentLoader/>;
    }

    if (profileQuery.isError) {
      return <DataFetchAlert/>;
    }

    return (
      <>
        <AccountPageDescription>
          { tAcct('accountUI.profile_description') }
        </AccountPageDescription>
        <Flex maxW="480px" mt={ 8 } flexDir="column" rowGap={ 12 }>
          <MyProfileEmail profileQuery={ profileQuery }/>
          { config.features.blockchainInteraction.isEnabled &&
            <MyProfileWallet profileQuery={ profileQuery } onAddWallet={ handleAddWalletClick }/> }
        </Flex>
        { authModal.open && authInitialScreen &&
          <AuthModal initialScreen={ authInitialScreen } onClose={ authModal.onClose } mixpanelConfig={ MIXPANEL_CONFIG }/> }
      </>
    );
  })();

  return (
    <>
      <PageTitle title={ tAcct('accountUI.my_profile') }/>
      { content }
    </>
  );
};

export default MyProfile;
