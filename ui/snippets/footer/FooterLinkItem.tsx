// Modified by Quat Capital, 2026-10-25: localized known Quat links and icon labels (T18, GPL-3.0).
import { Center } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useColorModeValue } from 'toolkit/chakra/color-mode';
import { Image } from 'toolkit/chakra/image';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import type { IconName } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';

type Props = {
  icon?: IconName;
  iconSize?: string;
  iconUrl?: Array<string>;
  text: string;
  url: string;
  isLoading?: boolean;
};

const QUAT_LINK_KEYS: Readonly<Record<string, string>> = {
  'О сети': 'quat.about',
  'Запросить демо': 'quat.demo',
  'Исходный код эксплорера (GPL-3.0)': 'quat.source',
  'Чат тестнета (Telegram)': 'quat.testnet_chat',
  'Блог основателя (Telegram)': 'quat.founder_blog',
};

const FooterLinkItemIconExternal = ({ iconUrl, text }: { iconUrl: Array<string>; text: string }) => {
  const { t } = useTranslation();
  const [ lightIconUrl, darkIconUrl ] = iconUrl;

  const imageSrc = useColorModeValue(lightIconUrl, darkIconUrl || lightIconUrl);

  return (
    <Image
      src={ imageSrc }
      alt={ t('common.icon', { name: text }) }
      boxSize={ 5 }
      objectFit="contain"
    />
  );
};

const FooterLinkItem = ({ icon, iconSize, iconUrl, text, url, isLoading }: Props) => {
  const { t } = useTranslation();
  const translationKey = QUAT_LINK_KEYS[text];
  const label = translationKey ? t(translationKey) : text;
  if (isLoading) {
    return <Skeleton loading my="3px">{ label }</Skeleton>;
  }

  const iconElement = (() => {
    if (iconUrl && Array.isArray(iconUrl)) {
      const [ lightIconUrl, darkIconUrl ] = iconUrl;

      if (typeof lightIconUrl === 'string' && (typeof darkIconUrl === 'string' || !darkIconUrl)) {
        return <FooterLinkItemIconExternal iconUrl={ iconUrl } text={ label }/>;
      }
    }

    if (icon) {
      return (
        <Center minW={ 6 }>
          <IconSvg boxSize={ iconSize || 5 } name={ icon }/>
        </Center>
      );
    }

    return null;
  })();

  return (
    <Link href={ url } display="flex" alignItems="center" h="30px" variant="subtle" external noIcon textStyle="xs" columnGap={ 2 }>
      { iconElement }
      { label }
    </Link>
  );
};

export default FooterLinkItem;
