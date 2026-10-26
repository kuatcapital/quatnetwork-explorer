// Modified by Quat Capital, 2026-10-26: marketplace, rewards or token info localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Tooltip } from 'toolkit/chakra/tooltip';
import type { IconName } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';

type Props = {
  internalWallet: boolean | undefined;
  external: boolean | undefined;
};

const MarketplaceAppIntegrationIcon = ({ external, internalWallet }: Props) => {
  const { t: tEco } = useTranslation();
  const [ icon, iconColor, text, boxSize ] = React.useMemo(() => {
    let icon: IconName = 'integration/partial';
    let color = 'icon.secondary';
    let text = tEco('marketplaceUI.app_external_wallet');
    let boxSize = 5;

    if (external) {
      icon = 'link_external';
      color = 'icon.secondary';
      text = tEco('marketplaceUI.app_new_tab');
      boxSize = 4;
    } else if (internalWallet) {
      icon = 'integration/full';
      color = 'green.500';
      text = tEco('marketplaceUI.app_autoconnect');
    }

    return [ icon, color, text, boxSize ];
  }, [ external, internalWallet, tEco ]);

  return (
    <Tooltip
      content={ text }
      openDelay={ 300 }
      contentProps={{ maxW: { base: 'calc(100vw - 8px)', lg: '400px' } }}
    >
      <IconSvg
        name={ icon }
        boxSize={ boxSize }
        color={ iconColor }
        position="relative"
        cursor="pointer"
        verticalAlign="middle"
      />
    </Tooltip>
  );
};

export default MarketplaceAppIntegrationIcon;
