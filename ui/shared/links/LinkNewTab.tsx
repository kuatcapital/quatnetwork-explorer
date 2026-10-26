// Modified by Quat Capital, 2026-10-26: localize shared controls, details and data feedback. GPL-3.0.
import { chakra } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { IconButton } from 'toolkit/chakra/icon-button';
import { Link } from 'toolkit/chakra/link';
import { Tooltip } from 'toolkit/chakra/tooltip';

import IconSvg from '../IconSvg';

interface Props {
  className?: string;
  label?: string;
  href: string;
}

const LinkNewTab = ({ className, label, href }: Props) => {
  const { t } = useTranslation();

  return (
    <Tooltip content={ label }>
      <IconButton
        asChild
        aria-label={ label ?? t('sharedUi.open_link') }
        variant="icon_secondary"
        boxSize={ 5 }
        className={ className }
        borderRadius={ 0 }
      >
        <Link href={ href } external noIcon>
          <IconSvg name="open-link"/>
        </Link>
      </IconButton>
    </Tooltip>
  );
};

export default React.memo(chakra(LinkNewTab));
