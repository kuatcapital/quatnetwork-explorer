// Modified by Quat Capital, 2026-10-25: localize transaction-not-found guidance with rich text. GPL-3.0.

import { Box, Flex, List, chakra } from '@chakra-ui/react';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { route } from 'nextjs-routes';

import { Button } from 'toolkit/chakra/button';
import { Link } from 'toolkit/chakra/link';
import Puzzle15 from 'ui/games/Puzzle15';
import IconSvg from 'ui/shared/IconSvg';

import AppErrorTitle from '../AppErrorTitle';
const AppErrorTxNotFound = () => {
  const { t } = useTranslation();
  const snippet = {
    borderColor: { _light: 'blackAlpha.300', _dark: 'whiteAlpha.300' },
    iconBg: { _light: 'blackAlpha.800', _dark: 'whiteAlpha.800' },
    iconColor: { _light: 'white', _dark: 'black' },
  };

  const [ isPuzzleOpen, setIsPuzzleOpen ] = React.useState(false);

  const showPuzzle = React.useCallback(() => {
    setIsPuzzleOpen(true);
  }, []);

  return (
    <>
      <Box p={ 4 } borderColor={ snippet.borderColor } borderRadius="md" w="230px" borderWidth="1px">
        <Flex alignItems="center" pb={ 4 } borderBottomWidth="1px" borderColor={ snippet.borderColor }>
          { /* FIXME use non-navigation icon */ }
          <IconSvg name="navigation/transactions" boxSize={ 8 } color={ snippet.iconColor } bgColor={ snippet.iconBg } p={ 1 } borderRadius="md"/>
          <Box ml={ 2 }>
            <Box w="125px" h="8px" borderRadius="full" bgColor={ snippet.iconBg }/>
            <Box w="30px" h="8px" borderRadius="full" bgColor={ snippet.borderColor } mt={ 1.5 }/>
          </Box>
        </Flex>
        <Flex justifyContent="space-between" alignItems="center" mt={ 3 }>
          <Flex alignItems="center">
            <Box boxSize={ 5 } borderRadius="full" bgColor={ snippet.borderColor }/>
            <Box w="65px" h="8px" borderRadius="full" bgColor={ snippet.borderColor } ml={ 1.5 }/>
          </Flex>
          <Flex alignItems="center">
            <Box boxSize={ 5 } borderRadius="full" bgColor={ snippet.borderColor }/>
            <Box w="65px" h="8px" borderRadius="full" bgColor={ snippet.borderColor } ml={ 1.5 }/>
          </Flex>
        </Flex>
      </Box>
      <AppErrorTitle title={ t('errors.transaction_not_found') }/>
      <List.Root mt={ 3 } gap={ 3 } as="ol" pl={ 5 }>
        <List.Item>
          { t('errors.tx_wait') }
        </List.Item>
        <List.Item>
          { t('errors.tx_pool') }
        </List.Item>
        <List.Item>
          { t('errors.tx_busy_network') }
        </List.Item>
        <List.Item>
          <Trans t={ t } i18nKey="errors.tx_contact_provider" components={{ provider: <chakra.span fontWeight={ 600 }/> }}/>
        </List.Item>
        <List.Item>
          <span><Trans t={ t } i18nKey="errors.tx_puzzle" components={{ puzzle: <Link onClick={ showPuzzle }/> }}/></span>
        </List.Item>
      </List.Root>
      { isPuzzleOpen && <Puzzle15/> }
      <Link href={ route({ pathname: '/' }) } asChild>
        <Button
          mt={ 8 }
          variant="outline"
        >
          { t('errors.back_home') }
        </Button>
      </Link>
    </>
  );
};

export default AppErrorTxNotFound;
