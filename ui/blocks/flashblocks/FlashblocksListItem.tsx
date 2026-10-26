// Modified by Quat Capital, 2026-10-26: runtime translation and locale formatting. GPL-3.0.
import { Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { FlashblockItem } from 'types/client/flashblocks';

import { route } from 'nextjs-routes';

import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { Link } from 'toolkit/chakra/link';
import FlashblockEntity from 'ui/shared/entities/flashblock/FlashblockEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import Time from 'ui/shared/time/Time';

interface Props {
  data: FlashblockItem;
}

const FlashblocksListItem = ({ data }: Props) => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  return (
    <ListItemMobile rowGap={ 3 }>
      <Flex justifyContent="space-between" w="100%">
        { data.block_number ? (
          <FlashblockEntity
            number={ data.block_number }
            index={ data.index }
            fontWeight={ 600 }
          />
        ) : <Text color="text.secondary">{ t('flashblocks.unavailable') }</Text> }
      </Flex>
      { data.timestamp && (
        <Flex columnGap={ 2 }>
          <Text fontWeight={ 500 }>{ t('blockDetails.timestamp') }</Text>
          <Time color="text.secondary" timestamp={ data.timestamp } format="DD MMM, HH:mm:ss.SSS"/>
        </Flex>
      ) }
      <Flex columnGap={ 2 }>
        <Text fontWeight={ 500 }>{ t('flashblocks.txn') }</Text>
        { data.transactions_count > 0 ? (
          <Link href={ route({
            pathname: '/block/[height_or_hash]',
            query: { height_or_hash: String(data.block_number), tab: 'txs' },
          }) }>
            { formatNumber(data.transactions_count, locale) }
          </Link>
        ) :
          <Text color="text.secondary">{ formatNumber(data.transactions_count, locale) }</Text>
        }
      </Flex>
      <Flex columnGap={ 2 }>
        <Text fontWeight={ 500 }>{ t('blockDetails.gas_used') }</Text>
        <Text color="text.secondary">{ formatNumber(data.gas_used, locale) }</Text>
      </Flex>
    </ListItemMobile>
  );
};

export default FlashblocksListItem;
