// Modified by Quat Capital, 2026-10-26: account interface localization. GPL-3.0.
import { Text, Flex } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import IconSvg from 'ui/shared/IconSvg';

const UserWalletAutoConnectAlert = () => {
  const { t: tAcct } = useTranslation();
  return (
    <Flex
      borderRadius="base"
      p={ 3 }
      mb={ 3 }
      alignItems="center"
      bgColor={{ _light: 'orange.100', _dark: 'orange.900' }}
    >
      <IconSvg
        name="integration/partial"
        color="text.primary"
        boxSize={ 5 }
        flexShrink={ 0 }
        mr={ 2 }
      />
      <Text fontSize="xs" lineHeight="16px">
        { tAcct('accountUI.connect_app_wallet') }</Text>
    </Flex>
  );
};

export default React.memo(UserWalletAutoConnectAlert);
