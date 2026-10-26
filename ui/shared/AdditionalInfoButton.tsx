// Modified by Quat Capital, 2026-10-26: localize shared controls, details and data feedback. GPL-3.0.
import { chakra } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { IconButton } from 'toolkit/chakra/icon-button';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  loading?: boolean;
  className?: string;
}

const AdditionalInfoButton = (props: Props, ref: React.ForwardedRef<HTMLButtonElement>) => {
  const { t } = useTranslation();
  const { loading, ...rest } = props;

  return (
    <IconButton
      ref={ ref }
      variant="icon_secondary"
      _open={{
        bgColor: 'selected.control.bg',
        color: 'selected.control.text',
      }}
      borderRadius="base"
      aria-label={ t('sharedUi.transaction_info') }
      boxSize={ 6 }
      loadingSkeleton={ loading }
      { ...rest }
    >
      <IconSvg name="info" boxSize={ 5 }/>
    </IconButton>
  );
};

export default chakra(React.forwardRef(AdditionalInfoButton));
