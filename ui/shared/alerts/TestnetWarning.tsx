// Modified by Quat Capital, 2026-10-26: localize shared controls, details and data feedback. GPL-3.0.
import { chakra } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import config from 'configs/app';
import { Alert } from 'toolkit/chakra/alert';

interface Props {
  isLoading?: boolean;
  className?: string;
}

const TestnetWarning = ({ isLoading, className }: Props) => {
  const { t } = useTranslation();
  if (!config.chain.isTestnet) {
    return null;
  }

  return (
    <Alert status="warning" loading={ isLoading } className={ className }>{ t('sharedUi.testnet_transaction') }</Alert>
  );
};

export default React.memo(chakra(TestnetWarning));
