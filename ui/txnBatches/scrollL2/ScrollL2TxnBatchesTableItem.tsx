import { NUMBER_LOCALES } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
// Modified by Quat Capital, 2026-10-27: localized L2 and interop interface. GPL-3.0.
// Modified by Quat Capital, 2026-10-26: T18 reviewed literal localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { ScrollL2TxnBatch } from 'types/api/scrollL2';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import ScrollL2TxnBatchDA from 'ui/shared/batch/ScrollL2TxnBatchDA';
import BatchEntityL2 from 'ui/shared/entities/block/BatchEntityL2';
import BlockEntityL1 from 'ui/shared/entities/block/BlockEntityL1';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import ScrollL2TxnBatchStatus from 'ui/shared/statusTag/ScrollL2TxnBatchStatus';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';

const rollupFeature = config.features.rollup;

type Props = { item: ScrollL2TxnBatch; isLoading?: boolean };

const ScrollL2TxnBatchesTableItem = ({ item, isLoading }: Props) => {
  const { locale } = useLocale();
  const { t: tQuat } = useTranslation();

  if (!rollupFeature.isEnabled || rollupFeature.type !== 'scroll') {
    return null;
  }

  return (
    <TableRow>
      <TableCell verticalAlign="middle">
        <BatchEntityL2
          isLoading={ isLoading }
          number={ item.number }
          fontWeight={ 600 }
          noIcon
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        <ScrollL2TxnBatchDA container={ item.data_availability?.batch_data_container } isLoading={ isLoading }/>
      </TableCell>
      <TableCell verticalAlign="middle">
        <ScrollL2TxnBatchStatus status={ item.confirmation_transaction.hash ? 'Finalized' : 'Committed' } isLoading={ isLoading }/>
      </TableCell>
      <TableCell verticalAlign="middle">
        <BlockEntityL1
          number={ item.commitment_transaction.block_number }
          isLoading={ isLoading }
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        <TxEntityL1
          hash={ item.commitment_transaction.hash }
          isLoading={ isLoading }
          truncation="constant_long"
          noCopy
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        <TimeWithTooltip
          timestamp={ item.commitment_transaction.timestamp }
          fallbackText={ tQuat('l2Ui.undefined') }
          isLoading={ isLoading }
          color="text.secondary"
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        { item.confirmation_transaction.block_number ? (
          <BlockEntityL1
            number={ item.confirmation_transaction.block_number }
            isLoading={ isLoading }
          />
        ) : <Skeleton loading={ isLoading } display="inline-block">{ tQuat('common.pending') }</Skeleton> }
      </TableCell>
      <TableCell verticalAlign="middle">
        { item.confirmation_transaction.hash ? (
          <TxEntityL1
            hash={ item.confirmation_transaction.hash }
            isLoading={ isLoading }
            truncation="constant_long"
            noCopy
          />
        ) : <Skeleton loading={ isLoading } display="inline-block">{ tQuat('common.pending') }</Skeleton> }
      </TableCell>
      <TableCell verticalAlign="middle" isNumeric>
        <Link
          href={ route({ pathname: '/batches/[number]', query: { number: item.number.toString(), tab: tQuat('l2Ui.blocks') } }) }
          loading={ isLoading }
        >
          { (item.end_block_number - item.start_block_number + 1).toLocaleString(NUMBER_LOCALES[locale]) }
        </Link>
      </TableCell>
      <TableCell verticalAlign="middle" isNumeric>
        { typeof item.transactions_count === 'number' ? (
          <Link
            href={ route({ pathname: '/batches/[number]', query: { number: item.number.toString(), tab: 'txs' } }) }
            loading={ isLoading }
          >
            { item.transactions_count.toLocaleString(NUMBER_LOCALES[locale]) }
          </Link>
        ) : tQuat('l2Ui.not_available') }
      </TableCell>
    </TableRow>
  );
};

export default ScrollL2TxnBatchesTableItem;
