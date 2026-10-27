// Modified by Quat Capital, 2026-10-27: translated API explanations. GPL-3.0.
import { Box, Text } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Link } from 'toolkit/chakra/link';

const RpcApi = () => {
  const { t } = useTranslation();
  return (
    <Box>
      <Text>
        { t('pageUi.rpc_description') }
      </Text>
      <Link href="https://docs.blockscout.com/devs/apis/rpc" external mt={ 6 }>{ t('pageUi.view_modules') }</Link>
    </Box>
  );
};

export default React.memo(RpcApi);
