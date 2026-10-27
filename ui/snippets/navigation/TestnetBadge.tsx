// Modified by Quat Capital, 2026-10-27: visible testnet labels follow runtime locale, EN artwork preserved. GPL-3.0.
import { Box, chakra } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import config from 'configs/app';
import { useLocale } from 'lib/i18n/provider';
import { Image } from 'toolkit/chakra/image';

interface Props {
  className?: string;
}

const TestnetBadge = ({ className }: Props) => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  if (!config.chain.isTestnet) {
    return null;
  }

  if (locale === 'en') {
    return <Image className={ className } src="/static/labels/testnet.svg" h="14px" w="37px" color="red.400"/>;
  }

  return (
    <Box
      as="span"
      className={ className }
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      h="14px"
      minW="37px"
      px="2px"
      color="red.400"
      borderWidth="0.4px"
      borderColor="red.400"
      borderRadius="4px"
      fontSize="8px"
      lineHeight="12px"
      fontWeight={ 500 }
      whiteSpace="nowrap"
    >
      { t('shellUi.testnet_label') }
    </Box>
  );
};

export default React.memo(chakra(TestnetBadge));
