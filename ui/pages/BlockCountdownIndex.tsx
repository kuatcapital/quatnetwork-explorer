// Modified by Quat Capital, 2026-10-26: localize block, gas and statistics UI. GPL-3.0.
import { chakra, Box, Center } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { routeParams } from 'nextjs/routes';

import { useMultichainContext } from 'lib/contexts/multichain';
import { Heading } from 'toolkit/chakra/heading';
import { FilterInput } from 'toolkit/components/filters/FilterInput';
import ChainIcon from 'ui/shared/externalChains/ChainIcon';
import IconSvg from 'ui/shared/IconSvg';

const BlockCountdownIndex = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const multichainContext = useMultichainContext();

  const handleFormSubmit = React.useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const searchTerm = formData.get('search_term');
    if (typeof searchTerm === 'string' && searchTerm) {
      const url = routeParams({ pathname: '/block/countdown/[height]', query: { height: searchTerm } }, multichainContext);
      router.push(url, undefined, { shallow: true });
    }
  }, [ router, multichainContext ]);

  return (
    <Center h="100%" justifyContent={{ base: 'flex-start', lg: 'center' }} flexDir="column" textAlign="center" pt={{ base: 8, lg: 0 }}>
      <Box position="relative">
        <IconSvg
          name="block_countdown"
          color={{ _light: 'gray.300', _dark: 'gray.600' }}
          w={{ base: '160px', lg: '240px' }}
          h={{ base: '123px', lg: '184px' }}
        />
        { multichainContext?.chain && (
          <ChainIcon
            data={ multichainContext.chain }
            position="absolute"
            bottom={{ base: '15px', lg: '22px' }}
            left={{ base: '105px', lg: '150px' }}
            boxSize={{ lg: '60px' }}
            bgColor="bg.primary"
            borderRadius="full"
          />
        ) }
      </Box>
      <Heading
        level="1"
        mt={{ base: 3, lg: 6 }}
      >
        { t('blockCountdown.title') } </Heading>
      <Box mt={ 2 }>
        { t('blockCountdown.description') } </Box>
      <chakra.form
        noValidate
        onSubmit={ handleFormSubmit }
        w={{ base: '100%', lg: '360px' }}
        mt={{ base: 3, lg: 6 }}
      >
        <FilterInput
          placeholder={ t('blockCountdown.search') }
          size="sm"
          type="number"
          name="search_term"
        />
      </chakra.form>
    </Center>
  );
};

export default React.memo(BlockCountdownIndex);
