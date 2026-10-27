// Modified by Quat Capital, 2026-10-27: T18 reviewed literal localization. GPL-3.0.
import { Box, chakra, Flex, Grid, Text } from '@chakra-ui/react';
import { clamp } from 'es-toolkit';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type * as multichain from '@blockscout/multichain-aggregator-types';

import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { Button } from 'toolkit/chakra/button';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from 'toolkit/chakra/popover';
import { Tooltip } from 'toolkit/chakra/tooltip';
import { ContentLoader } from 'toolkit/components/loaders/ContentLoader';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import EnsEntity from 'ui/shared/entities/ens/EnsEntity';
import IconSvg from 'ui/shared/IconSvg';
import useLazyLoadedList from 'ui/shared/pagination/useLazyLoadedList';

const DomainsGrid = ({ data }: { data: Array<multichain.Domain> }) => {
  return (
    <Grid
      templateColumns={{ base: `repeat(${ clamp(data.length, 1, 2) }, 1fr)`, lg: `repeat(${ clamp(data.length, 1, 3) }, 1fr)` }}
      columnGap={ 3 }
      rowGap="14px"
      mt={ 2 }
    >
      { data.map((domain) => <EnsEntity key={ domain.name } domain={ domain.name } protocol={ domain.protocol } noLink/>) }
    </Grid>
  );
};

interface Props {
  isLoading: boolean;
  mainDomain: multichain.BasicDomainInfo | undefined;
  hash: string;
}

const MultichainAddressEnsDomains = ({ mainDomain, isLoading, hash }: Props) => {
  const { t: tQuat } = useTranslation();
  const { locale } = useLocale();

  const rootRef = React.useRef<HTMLDivElement>(null);

  const popover = useDisclosure();

  const { cutRef, query: { data, isFetching, isError } } = useLazyLoadedList({
    rootRef,
    resourceName: 'multichainAggregator:address_domains',
    pathParams: { hash },
    queryOptions: {
      refetchOnMount: false,
    },
  });

  const items = data?.pages.map((page) => page.items).flat();

  if (!isLoading && (!items || items.length === 0)) {
    return null;
  }

  const totalRecords = data?.pages[0]?.items.length ?? 0;
  const totalRecordsPostfix = data?.pages[0]?.next_page_params ? '+' : '';
  const ownedDomains = (items ?? []).filter((domain) => domain.name !== mainDomain?.name);

  return (
    <PopoverRoot open={ popover.open } onOpenChange={ popover.onOpenChange }>
      <Tooltip content={ tQuat('multiUi.domains_hint') } disabled={ popover.open } disableOnMobile closeOnClick>
        <div>
          <PopoverTrigger>
            <Button
              size="sm"
              variant="dropdown"
              aria-label={ tQuat('addresses.domains') }
              fontWeight={ 500 }
              flexShrink={ 0 }
              columnGap={ 1 }
              loadingSkeleton={ isLoading }
            >
              <IconSvg name="ENS" boxSize={ 5 }/>
              <chakra.span hideBelow="xl">{ tQuat('sectionCounts.domains', {
                count: totalRecords,
                value: `${ formatNumber(totalRecords, locale) }${ totalRecordsPostfix }`,
              }) }</chakra.span>
              <chakra.span hideFrom="xl">{ totalRecords }{ totalRecordsPostfix }</chakra.span>
            </Button>
          </PopoverTrigger>
        </div>
      </Tooltip>
      <PopoverContent w={{ lg: '500px' }} maxH="400px" overflowY="auto" ref={ rootRef }>
        <PopoverBody textStyle="sm" display="flex" flexDir="column" rowGap={ 5 } alignItems="flex-start">
          { mainDomain && (
            <Box w="100%">
              <chakra.span color="text.secondary" textStyle="xs">{ tQuat('addresses.primary_domain') }</chakra.span>
              <Flex alignItems="center" textStyle="md" mt={ 2 }>
                <EnsEntity
                  domain={ mainDomain.name }
                  protocol={ mainDomain.protocol }
                  fontWeight={ 600 }
                  noCopy
                  noLink
                />
              </Flex>
            </Box>
          ) }
          { ownedDomains.length > 0 && (
            <div>
              <chakra.span color="text.secondary" textStyle="xs">{ tQuat('addresses.owned_by_address') }</chakra.span>
              <DomainsGrid data={ ownedDomains }/>
            </div>
          ) }

          { isFetching && <ContentLoader maxW="200px" mt={ 3 }/> }

          { isError && <Text color="text.error" mt={ 3 }>{ tQuat('multiUi.next_page_error') }</Text> }

          <Box h="0" w="100px" ref={ cutRef }/>

          { mainDomain && (
            <chakra.span textStyle="xs" mt={ -1 }>{ tQuat('addresses.domain_disclaimer') }</chakra.span>
          ) }
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default React.memo(MultichainAddressEnsDomains);
