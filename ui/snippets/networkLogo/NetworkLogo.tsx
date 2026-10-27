// Modified by Quat Capital, 2026-10-27: complete runtime shell localization. GPL-3.0.
import { chakra } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import { useColorModeValue } from 'toolkit/chakra/color-mode';
import { Image } from 'toolkit/chakra/image';
import IconSvg from 'ui/shared/IconSvg';

import { INVERT_FILTER } from './consts';

const LogoFallback = () => {
  const { t: tShell } = useTranslation();
  return (
    <IconSvg
      name="networks/logo-placeholder"
      width="120px"
      height="24px"
      color={{ base: 'blue.600', _dark: 'white' }}
      aria-label={ tShell('shellUi.network_logo_placeholder') }
    />
  );
};

type Props = {
  className?: string;
};

const NetworkLogo = ({ className }: Props) => {
  const { t: tShell } = useTranslation();

  const logoSrc = useColorModeValue(config.UI.navigation.logo.default, config.UI.navigation.logo.dark || config.UI.navigation.logo.default);

  return (
    <chakra.a
      className={ className }
      href={ route({ pathname: '/' }) }
      aria-label={ tShell('shellUi.main_page_link') }
    >
      <Image
        h="24px"
        skeletonWidth="120px"
        src={ logoSrc }
        alt={ tShell('shellUi.network_logo', { name: config.chain.name }) }
        fallback={ <LogoFallback/> }
        filter={{ _dark: !config.UI.navigation.logo.dark ? INVERT_FILTER : undefined }}
        objectFit="contain"
        objectPosition="left"
      />
    </chakra.a>
  );
};

export default React.memo(chakra(NetworkLogo));
