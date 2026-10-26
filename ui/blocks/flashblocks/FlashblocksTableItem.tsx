// Modified by Quat Capital, 2026-10-26: runtime translation and locale formatting. GPL-3.0.
import { HStack, Text } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { FlashblockItem } from 'types/client/flashblocks';

import { route } from 'nextjs-routes';

import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { Link } from 'toolkit/chakra/link';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import FlashblockEntity from 'ui/shared/entities/flashblock/FlashblockEntity';
import Time from 'ui/shared/time/Time';

interface Props {
  data: FlashblockItem;
}

const FlashblocksTableItem = ({ data }: Props) => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  return (
    <TableRow>
      <TableCell>
        <HStack alignItems="center" gap={ 3 }>
          { data.block_number ? (
            <FlashblockEntity
              number={ data.block_number }
              index={ data.index }
              noIcon
            />
          ) : (
            <Text color="text.secondary">{ t('flashblocks.unavailable') }</Text>
          ) }
          { data.timestamp && <Time color="text.secondary" timestamp={ data.timestamp } format="DD MMM, HH:mm:ss.SSS"/> }
        </HStack>
      </TableCell>
      <TableCell isNumeric>
        { data.transactions_count > 0 ? (
          <Link href={ route({
            pathname: '/block/[height_or_hash]',
            query: { height_or_hash: String(data.block_number), tab: 'txs' },
          }) }>
            { formatNumber(data.transactions_count, locale) }
          </Link>
        ) : (
          <Text color="text.secondary">{ formatNumber(data.transactions_count, locale) }</Text>
        ) }
      </TableCell>
      <TableCell isNumeric>
        { formatNumber(data.gas_used, locale) }
      </TableCell>
    </TableRow>
  );
};

export default React.memo(FlashblocksTableItem);
