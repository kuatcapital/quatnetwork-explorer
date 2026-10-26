// Modified by Quat Capital, 2026-10-26: localize shared controls, details and data feedback. GPL-3.0.
import { chakra } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { EntityTag } from './types';

import { Image } from 'toolkit/chakra/image';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  data: EntityTag;
  noColors?: boolean;
}

const EntityTagIcon = ({ data, noColors }: Props) => {
  const { t } = useTranslation();

  const iconColor = (!noColors && data.meta?.textColor) || 'icon.secondary';

  if (data.meta?.tagIcon && !noColors) {
    return <Image boxSize={ 3 } src={ data.meta.tagIcon } alt={ t('common.icon', { name: data.name }) }/>;
  }

  if (data.tagType === 'name') {
    return <IconSvg name="publictags" boxSize={ 3 } color={ iconColor }/>;
  }

  if (data.tagType === 'protocol' || data.tagType === 'generic') {
    return <chakra.span color={ iconColor }>#</chakra.span>;
  }

  return null;
};

export default React.memo(EntityTagIcon);
