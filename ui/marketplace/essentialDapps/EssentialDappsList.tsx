// Modified by Quat Capital, 2026-10-26: runtime marketplace labels. GPL-3.0.
import { Flex } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import type { EssentialDappsConfig } from 'types/client/marketplace';

import config from 'configs/app';

import EssentialDappCard from './EssentialDappCard';

const feature = config.features.marketplace;
const essentialDappsConfig = feature.isEnabled ? feature.essentialDapps : undefined;

const essentialDapps = [
  {
    id: 'swap',
    titleKey: 'marketplaceUI.swap',
    descriptionKey: 'marketplaceUI.swap_description',
    buttonKey: 'marketplaceUI.swap_tokens',
    imageUrl: '/static/marketplace/swap.png',
    darkImageUrl: '/static/marketplace/swap-dark.png',
  },
  {
    id: 'revoke',
    titleKey: 'marketplaceUI.revoke',
    descriptionKey: 'marketplaceUI.revoke_description',
    buttonKey: 'marketplaceUI.get_started',
    imageUrl: '/static/marketplace/revoke.png',
    darkImageUrl: '/static/marketplace/revoke-dark.png',
  },
  {
    id: 'multisend',
    titleKey: 'marketplaceUI.multisend',
    descriptionKey: 'marketplaceUI.multisend_description',
    buttonKey: 'marketplaceUI.send_tokens',
    imageUrl: '/static/marketplace/multisend.png',
    darkImageUrl: '/static/marketplace/multisend-dark.png',
  },
].filter((dapp) =>
  feature.isEnabled && Boolean(essentialDappsConfig?.[dapp.id as keyof EssentialDappsConfig]),
);

const EssentialDappsList = () => {
  const { t: tEco } = useTranslation();
  return (
    <Flex
      gap={{ base: 2, md: 3 }}
      mb={ 8 }
      w="full"
      overflowX={{ base: 'auto', md: 'initial' }}
      css={{
        // hide scrollbar
        '&::-webkit-scrollbar': { /* Chromiums */
          display: 'none',
        },
        '-ms-overflow-style': 'none', /* IE and Edge */
        scrollbarWidth: 'none', /* Firefox */
      }}
    >
      { essentialDapps.map((dapp) => (
        <EssentialDappCard
          key={ dapp.id }
          id={ dapp.id }
          title={ tEco(dapp.titleKey) }
          description={ tEco(dapp.descriptionKey) }
          buttonText={ tEco(dapp.buttonKey) }
          imageUrl={ dapp.imageUrl }
          darkImageUrl={ dapp.darkImageUrl }
        />
      )) }
    </Flex>
  );
};

export default EssentialDappsList;
