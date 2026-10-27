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

const IconFallback = () => {
  const { t: tShell } = useTranslation();
  return (
    <IconSvg
      name="networks/icon-placeholder"
      w="30px"
      h="30px"
      color={{ base: 'blue.600', _dark: 'white' }}
      aria-label={ tShell('shellUi.network_icon_placeholder') }
    />
  );
};

type Props = {
  className?: string;
};

const NetworkIcon = ({ className }: Props) => {
  const { t: tShell } = useTranslation();

  const iconSrc = useColorModeValue(config.UI.navigation.icon.default, config.UI.navigation.icon.dark || config.UI.navigation.icon.default);

  return (
    <chakra.a
      className={ className }
      href={ route({ pathname: '/' }) }
      aria-label={ tShell('shellUi.main_page_link') }
    >
      <Image
        w="30px"
        h="30px"
        src={ iconSrc }
        alt={ tShell('shellUi.network_icon', { name: config.chain.name }) }
        fallback={ <IconFallback/> }
        filter={{ _dark: !config.UI.navigation.icon.dark ? INVERT_FILTER : undefined }}
        objectFit="contain"
        objectPosition="left"
      />
    </chakra.a>
  );
};

export default React.memo(chakra(NetworkIcon));
