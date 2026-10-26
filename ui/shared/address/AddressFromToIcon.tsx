// Modified by Quat Capital, 2026-10-26: localize shared controls, details and data feedback. GPL-3.0.
import { chakra } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Tooltip } from 'toolkit/chakra/tooltip';
import IconSvg from 'ui/shared/IconSvg';

import type { TxCourseType } from './utils';

interface Props {
  isLoading?: boolean;
  type: TxCourseType;
  className?: string;
}

const AddressFromToIcon = ({ isLoading, type, className }: Props) => {
  const { t } = useTranslation();
  const styles = {
    'in': {
      color: { _light: 'green.500', _dark: 'green.200' },
      bgColor: { _light: 'green.50', _dark: 'green.800' },
    },
    out: {
      color: { _light: 'yellow.600', _dark: 'yellow.500' },
      bgColor: { _light: 'orange.50', _dark: 'yellow.900' },
    },
    self: {
      color: { _light: 'blackAlpha.400', _dark: 'whiteAlpha.400' },
      bgColor: { _light: 'blackAlpha.50', _dark: 'whiteAlpha.50' },
    },
    unspecified: {
      color: 'icon.primary',
      bgColor: 'transparent',
    },
  };
  const labels = {
    'in': t('sharedUi.incoming_transaction'),
    out: t('sharedUi.outgoing_transaction'),
    self: t('sharedUi.self_transaction'),
  };

  const icon = (
    <IconSvg
      name="arrows/east"
      { ...(styles[type]) }
      className={ className }
      isLoading={ isLoading }
      boxSize={ 5 }
      flexShrink={ 0 }
      borderRadius="sm"
    />
  );

  if (type === 'unspecified') {
    return icon;
  }

  return (
    <Tooltip content={ labels[type] }>
      { icon }
    </Tooltip>
  );
};

export default React.memo(chakra(AddressFromToIcon));
