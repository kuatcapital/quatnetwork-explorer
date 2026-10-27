// Modified by Quat Capital, 2026-10-27: complete runtime shell localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from 'toolkit/chakra/button';
import { PopoverRoot, PopoverTrigger } from 'toolkit/chakra/popover';
import IconSvg from 'ui/shared/IconSvg';
import NetworkMenuContent from 'ui/snippets/networkMenu/NetworkMenuContent';
import useNetworkMenu from 'ui/snippets/networkMenu/useNetworkMenu';

const NetworkMenu = () => {
  const { t: tShell } = useTranslation();
  const menu = useNetworkMenu();

  const handlePopoverOpenChange = React.useCallback(({ open }: { open: boolean }) => {
    menu.onOpenChange({ open });
  }, [ menu ]);

  return (
    <PopoverRoot
      positioning={{ placement: 'bottom-start', offset: { mainAxis: 6 } }}
      lazyMount
      open={ menu.open }
      onOpenChange={ handlePopoverOpenChange }
    >
      <PopoverTrigger>
        <Button
          variant="link"
          aria-label={ tShell('shellUi.network_menu') }
          onClick={ menu.onToggle }
          size="2xs"
          fontWeight={ 500 }
        >
          <IconSvg name="networks" boxSize="14px"/>
          <span>{ tShell('shellUi.chains') }</span>
          <IconSvg name="arrows/east-mini" boxSize={ 4 } transform="rotate(-90deg)"/>
        </Button>
      </PopoverTrigger>
      <NetworkMenuContent items={ menu.data } tabs={ menu.availableTabs }/>
    </PopoverRoot>
  );
};

export default React.memo(NetworkMenu);
