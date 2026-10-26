// Modified by Quat Capital, 2026-10-26: runtime toolkit labels for RU/KK/EN. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { IconButtonProps } from 'toolkit/chakra/icon-button';
import { IconButton } from 'toolkit/chakra/icon-button';
import IconSvg from 'ui/shared/IconSvg';

interface Props extends IconButtonProps {}

const RemoveButton = (props: Props) => {
  const { t } = useTranslation();
  return (
    <IconButton
      aria-label={ t('toolkit.remove_item') }
      variant="icon_secondary"
      size="md"
      { ...props }
    >
      <IconSvg name="minus"/>
    </IconButton>
  );
};

export default React.memo(RemoveButton);
