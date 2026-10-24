// Modified by Quat Capital (ИП «QUAT CAPITAL»), 2026-10-25, for Quat Network Testnet.
// Original: blockscout/frontend v2.7.2, ui/snippets/footer/Footer.tsx, GPL-3.0.
// Changes: removed the "Blockscout" links column, the project description and version lines;
// kept the "Made with Blockscout" link and the copyright notice; custom link groups from NEXT_PUBLIC_FOOTER_LINKS.
// Distributed under GPL-3.0 (see LICENSE in the original repository).
import type { GridProps, HTMLChakraProps } from '@chakra-ui/react';
import { Box, Grid, Flex, Text, VStack } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { CustomLinksGroup } from 'types/footerLinks';

import config from 'configs/app';
import type { ResourceError } from 'lib/api/resources';
import useFetch from 'lib/hooks/useFetch';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { copy } from 'toolkit/utils/htmlEntities';
import IconSvg from 'ui/shared/IconSvg';
import { CONTENT_MAX_WIDTH } from 'ui/shared/layout/utils';
import NetworkAddToWallet from 'ui/shared/NetworkAddToWallet';

import FooterLinkItem from './FooterLinkItem';
import IntTxsIndexingStatus from './IntTxsIndexingStatus';

const MAX_LINKS_COLUMNS = 4;

const Footer = () => {
  const fetch = useFetch();

  const { isPlaceholderData, data: linksData } = useQuery<unknown, ResourceError<unknown>, Array<CustomLinksGroup>>({
    queryKey: [ 'footer-links' ],
    queryFn: async() => fetch(config.UI.footer.links || '', undefined, { resource: 'footer-links' }),
    enabled: Boolean(config.UI.footer.links),
    staleTime: Infinity,
    placeholderData: [],
  });

  const groups = (linksData || []).slice(0, MAX_LINKS_COLUMNS);
  const colNum = Math.max(groups.length, 1);

  const logoColor = { base: 'blue.600', _dark: 'white' };

  const containerProps: HTMLChakraProps<'div'> = {
    as: 'footer',
    borderTopWidth: '1px',
    borderTopColor: 'border.divider',
  };

  const contentProps: GridProps = {
    px: { base: 4, lg: config.UI.navigation.layout === 'horizontal' ? 6 : 12, '2xl': 6 },
    py: { base: 4, lg: 8 },
    gridTemplateColumns: { base: '1fr', lg: 'minmax(auto, 470px) 1fr' },
    columnGap: { lg: '32px', xl: '100px' },
    maxW: `${ CONTENT_MAX_WIDTH }px`,
    m: '0 auto',
  };

  return (
    <Box { ...containerProps }>
      <Grid { ...contentProps }>
        <div>
          <Flex
            alignItems="center"
            flexWrap="wrap"
            justifyContent="flex-start"
            columnGap={ 3 }
            rowGap={ 2 }
            mb={{ base: 5, lg: 10 }}
            _empty={{ display: 'none' }}
          >
            { !config.UI.indexingAlert.intTxs.isHidden && <IntTxsIndexingStatus/> }
            { !config.features.multichain.isEnabled && <NetworkAddToWallet source="Footer"/> }
          </Flex>
          <Flex columnGap={ 2 } textStyle="xs" alignItems="center">
            <span>Made with</span>
            <Link href="https://www.blockscout.com" external noIcon display="inline-flex" color={ logoColor } _hover={{ color: logoColor }}>
              <IconSvg name="networks/logo-placeholder" width="80px" height={ 4 }/>
            </Link>
          </Flex>
          <Text mt={ 3 } textStyle="xs">
            Copyright { copy } Blockscout Limited 2023-{ (new Date()).getFullYear() }
          </Text>
        </div>

        { groups.length > 0 && (
          <Grid
            gap={{ base: 6, lg: 8, xl: 12 }}
            gridTemplateColumns={{
              base: 'repeat(auto-fill, 160px)',
              lg: `repeat(${ colNum }, 135px)`,
              xl: `repeat(${ colNum }, 160px)`,
            }}
            justifyContent={{ lg: 'flex-end' }}
            mt={{ base: 8, lg: 0 }}
          >
            { groups.map(linkGroup => (
              <Box key={ linkGroup.title }>
                <Skeleton fontWeight={ 500 } mb={ 3 } display="inline-block" loading={ isPlaceholderData }>{ linkGroup.title }</Skeleton>
                <VStack gap={ 1 } alignItems="start">
                  { linkGroup.links.map(link => <FooterLinkItem { ...link } key={ link.text } isLoading={ isPlaceholderData }/>) }
                </VStack>
              </Box>
            )) }
          </Grid>
        ) }
      </Grid>
    </Box>
  );
};

export default React.memo(Footer);
