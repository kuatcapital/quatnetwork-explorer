// Modified by Quat Capital, 2026-10-26: marketplace, rewards or token info localization. GPL-3.0.
import { Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { EssentialDappsConfig } from 'types/client/marketplace';

import config from 'configs/app';
import getQueryParamString from 'lib/router/getQueryParamString';
import Multisend from 'ui/marketplace/essentialDapps/multisend/Multisend';
import Revoke from 'ui/marketplace/essentialDapps/revoke/Revoke';
import Swap from 'ui/marketplace/essentialDapps/swap/Swap';
import useAutoConnectWallet from 'ui/marketplace/useAutoConnectWallet';
import PageTitle from 'ui/shared/Page/PageTitle';

const feature = config.features.marketplace;

const EssentialDapp = () => {
  const { t: tEco } = useTranslation();
  const router = useRouter();
  useAutoConnectWallet();

  const id = getQueryParamString(router.query.id);

  let title = null;
  let content = null;
  let isCentered = false;

  switch (id) {
    case 'swap':
      title = tEco('marketplaceUI.swap');
      content = <Swap/>;
      isCentered = true;
      break;
    case 'revoke':
      title = tEco('marketplaceUI.revoke');
      content = <Revoke/>;
      break;
    case 'multisend':
      title = tEco('marketplaceUI.multisend');
      content = <Multisend/>;
      isCentered = true;
      break;
  }

  if (!content || (feature.isEnabled && !feature.essentialDapps?.[id as keyof EssentialDappsConfig])) {
    throw new Error('Essential dapp not found', { cause: { status: 404 } });
  }

  return (
    <Flex flexDir="column" h="full" w="full">
      <PageTitle title={ title || '' } alignItems={ isCentered ? 'center' : undefined }/>
      { content }
    </Flex>
  );
};

export default EssentialDapp;
