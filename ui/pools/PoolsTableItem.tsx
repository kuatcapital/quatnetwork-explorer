// Modified by Quat Capital, 2026-10-27: selected-locale supplemental numeric values. GPL-3.0.
import { Flex, Box, Text } from '@chakra-ui/react';
import React from 'react';

import type { Pool } from 'types/api/pools';

import { NUMBER_LOCALES } from 'lib/format/localeNumbers';
import getItemIndex from 'lib/getItemIndex';
import { useLocale } from 'lib/i18n/provider';
import getPoolLinks from 'lib/pools/getPoolLinks';
import { Image } from 'toolkit/chakra/image';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import { Tooltip } from 'toolkit/chakra/tooltip';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import PoolEntity from 'ui/shared/entities/pool/PoolEntity';
import HashStringShorten from 'ui/shared/HashStringShorten';

type Props = {
  item: Pool;
  index: number;
  page: number;
  isLoading?: boolean;
};

const PoolsTableItem = ({
  item,
  page,
  index,
  isLoading,
}: Props) => {
  const { locale } = useLocale();
  const externalLinks = getPoolLinks(item);

  return (
    <TableRow>
      <TableCell>
        <Flex gap={ 2 } alignItems="start">
          <Skeleton loading={ isLoading }>
            <Text px={ 2 }>{ getItemIndex(index, page).toLocaleString(NUMBER_LOCALES[locale]) }</Text>
          </Skeleton>
          <Box overflow="hidden">
            <PoolEntity pool={ item } fontWeight={ 700 } mb={ 2 } isLoading={ isLoading }/>
            { item.is_contract ? (
              <AddressEntity
                address={{ hash: item.pool_id }}
                noIcon
                isLoading={ isLoading }
                truncation="constant_long"
                link={{ variant: 'secondary' }}
              />
            ) : (
              <Flex color="text.secondary" alignItems="center">
                <HashStringShorten hash={ item.pool_id } type="long"/>
                <CopyToClipboard text={ item.pool_id }/>
              </Flex>
            ) }
          </Box>
        </Flex>
      </TableCell>
      <TableCell>
        <Skeleton loading={ isLoading }>{ item.dex.name }</Skeleton>
      </TableCell>
      <TableCell isNumeric>
        <Skeleton loading={ isLoading }>
          ${ Number(item.liquidity).toLocaleString(NUMBER_LOCALES[locale], { maximumFractionDigits: 2, notation: 'compact' }) }
        </Skeleton>
      </TableCell>
      <TableCell isNumeric>
        <Skeleton loading={ isLoading } display="flex" gap={ 2 } justifyContent="center">
          { externalLinks.map((link) => (
            <Tooltip content={ link.title } key={ link.url }>
              <Box display="inline-block">
                <Link external noIcon href={ link.url } display="inline-flex">
                  <Image src={ link.image } alt={ link.title } boxSize={ 5 }/>
                </Link>
              </Box>
            </Tooltip>
          )) }
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default PoolsTableItem;
