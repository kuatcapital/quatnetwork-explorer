// Modified by Quat Capital, 2026-10-25: localized block-list error (T18, GPL-3.0).
import { Box, Flex, VStack } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import FallbackBox from 'ui/shared/fallbacks/FallbackBox';
import IconSvg from 'ui/shared/IconSvg';

const LatestBlocksFallback = () => {
  const { t } = useTranslation();
  return (
    <Box>
      <Box color="text.secondary" textStyle="sm">{ t('home.load_failed') }</Box>
      <VStack rowGap={ 3 } mt={ 3 }>
        { Array.from({ length: 2 }).map((_, index) => (
          <Box key={ index } width="100%" p={ 3 } borderRadius="md" border="1px solid" borderColor="border.divider">
            <Flex alignItems="center" w="100%">
              <IconSvg name="block" boxSize={ 5 } color={{ _light: 'gray.300', _dark: 'whiteAlpha.300' }}/>
              <FallbackBox w="100px" bgColor={{ _light: 'blue.50', _dark: 'blue.800' }} ml={ 2 }/>
              <FallbackBox w="50px" ml="auto"/>
            </Flex>
            <FallbackBox w="100%" mt={ 2 }/>
            <FallbackBox w="100%" mt={ 1 }/>
          </Box>
        )) }
      </VStack>
    </Box>
  );
};

export default React.memo(LatestBlocksFallback);
