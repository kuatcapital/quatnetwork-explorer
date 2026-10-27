// Modified by Quat Capital, 2026-10-27: complete runtime shell localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import { DrawerBody, DrawerContent, DrawerRoot, DrawerTrigger } from 'toolkit/chakra/drawer';
import { IconButton } from 'toolkit/chakra/icon-button';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import IconSvg from 'ui/shared/IconSvg';
import NavigationMobile from 'ui/snippets/navigation/mobile/NavigationMobile';
import RollupStageBadge from 'ui/snippets/navigation/RollupStageBadge';
import TestnetBadge from 'ui/snippets/navigation/TestnetBadge';
import NetworkLogo from 'ui/snippets/networkLogo/NetworkLogo';

interface Props {
  isMarketplaceAppPage?: boolean;
}

const Burger = ({ isMarketplaceAppPage }: Props) => {
  const { t: tShell } = useTranslation();
  const { open, onOpen, onClose, onOpenChange } = useDisclosure();

  return (
    <DrawerRoot
      open={ open }
      onOpenChange={ onOpenChange }
      placement="start"
      lazyMount={ false }
    >
      <DrawerTrigger>
        <IconButton onClick={ onOpen } p={ 2 } aria-label={ tShell('shellUi.menu_button') }>
          <IconSvg
            name="burger"
            boxSize={ 6 }
            display="block"
            color={{ _light: 'gray.600', _dark: 'white' }}
          />
        </IconButton>
      </DrawerTrigger>
      <DrawerContent >
        <DrawerBody display="flex" flexDirection="column" overflowX="hidden" overflowY="auto">
          <TestnetBadge alignSelf="flex-start" mb={ 2 }/>
          <RollupStageBadge alignSelf="flex-start" mb={ 2 }/>
          <NetworkLogo/>
          <NavigationMobile onNavLinkClick={ onClose } isMarketplaceAppPage={ isMarketplaceAppPage }/>
        </DrawerBody>
      </DrawerContent>
    </DrawerRoot>
  );
};

export default Burger;
