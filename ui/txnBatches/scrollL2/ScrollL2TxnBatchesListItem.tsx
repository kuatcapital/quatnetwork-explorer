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
import ScrollL2TxnBatchDA from 'ui/shared/batch/ScrollL2TxnBatchDA';
import BatchEntityL2 from 'ui/shared/entities/block/BatchEntityL2';
import BlockEntityL1 from 'ui/shared/entities/block/BlockEntityL1';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';
import ScrollL2TxnBatchStatus from 'ui/shared/statusTag/ScrollL2TxnBatchStatus';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';

const rollupFeature = config.features.rollup;

type Props = { item: ScrollL2TxnBatch; isLoading?: boolean };

const ScrollL2TxnBatchesListItem = ({ item, isLoading }: Props) => {
  const { locale } = useLocale();
  const { t: tQuat } = useTranslation();

  if (!rollupFeature.isEnabled || rollupFeature.type !== 'scroll') {
    return null;
  }

  return (
    <ListItemMobileGrid.Container gridTemplateColumns="110px auto">

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('l2Ui.batch_marker') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <BatchEntityL2
          isLoading={ isLoading }
          number={ item.number }
          fontWeight={ 600 }
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('l2Ui.data_availability') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <ScrollL2TxnBatchDA container={ item.data_availability.batch_data_container } isLoading={ isLoading }/>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('common.status') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <ScrollL2TxnBatchStatus status={ item.confirmation_transaction.hash ? 'Finalized' : 'Committed' } isLoading={ isLoading }/>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('l2Ui.committed_block') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <BlockEntityL1
          number={ item.commitment_transaction.block_number }
          isLoading={ isLoading }
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('l2Ui.committed_txn_hash') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TxEntityL1
          hash={ item.commitment_transaction.hash }
          isLoading={ isLoading }
          noCopy
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('common.age') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TimeWithTooltip
          timestamp={ item.commitment_transaction.timestamp }
          fallbackText={ tQuat('l2Ui.undefined') }
          isLoading={ isLoading }
          display="inline-block"
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('l2Ui.finalized_block') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        { item.confirmation_transaction.block_number ? (
          <BlockEntityL1
            number={ item.confirmation_transaction.block_number }
            isLoading={ isLoading }
          />
        ) : <Skeleton loading={ isLoading } display="inline-block">{ tQuat('common.pending') }</Skeleton> }
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('l2Ui.finalized_txn_hash') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        { item.confirmation_transaction.hash ? (
          <TxEntityL1
            hash={ item.confirmation_transaction.hash }
            isLoading={ isLoading }
            noCopy
          />
        ) : <Skeleton loading={ isLoading } display="inline-block">{ tQuat('common.pending') }</Skeleton> }
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('l2Ui.blocks_count') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Link
          href={ route({ pathname: '/batches/[number]', query: { number: item.number.toString(), tab: tQuat('l2Ui.blocks') } }) }
          loading={ isLoading }
          fontWeight={ 600 }
          minW="40px"
        >
          { (item.end_block_number - item.start_block_number + 1).toLocaleString(NUMBER_LOCALES[locale]) }
        </Link>
      </ListItemMobileGrid.Value>

      { typeof item.transactions_count === 'number' ? (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('addresses.transaction_count') }</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <Link
              href={ route({ pathname: '/batches/[number]', query: { number: item.number.toString(), tab: 'txs' } }) }
              loading={ isLoading }
              fontWeight={ 600 }
              minW="40px"
            >
              { item.transactions_count.toLocaleString(NUMBER_LOCALES[locale]) }
            </Link>
          </ListItemMobileGrid.Value>
        </>
      ) : null }

    </ListItemMobileGrid.Container>
  );
};

export default ScrollL2TxnBatchesListItem;
