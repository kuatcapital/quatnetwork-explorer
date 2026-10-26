// Modified by Quat Capital, 2026-10-26: T18 reviewed literal localization. GPL-3.0.
import { Text } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { ZkSyncBatchesItem } from 'types/api/zkSyncL2';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import { Link } from 'toolkit/chakra/link';
import BatchEntityL2 from 'ui/shared/entities/block/BatchEntityL2';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';
import ZkSyncL2TxnBatchStatus from 'ui/shared/statusTag/ZkSyncL2TxnBatchStatus';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';

const rollupFeature = config.features.rollup;

type Props = { item: ZkSyncBatchesItem; isLoading?: boolean };

const ZkSyncTxnBatchesListItem = ({ item, isLoading }: Props) => {
  const { t: tQuat } = useTranslation();

  if (!rollupFeature.isEnabled || rollupFeature.type !== 'zkSync') {
    return null;
  }

  return (
    <ListItemMobileGrid.Container gridTemplateColumns="110px auto">

      <ListItemMobileGrid.Label isLoading={ isLoading }>Batch #</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <BatchEntityL2
          isLoading={ isLoading }
          number={ item.number }
          textStyle="sm"
          fontWeight={ 600 }
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('common.status') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <ZkSyncL2TxnBatchStatus status={ item.status } isLoading={ isLoading }/>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('common.age') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TimeWithTooltip
          timestamp={ item.timestamp }
          fallbackText="Undefined"
          isLoading={ isLoading }
          display="inline-block"
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('addresses.transaction_count') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Link
          href={ route({ pathname: '/batches/[number]', query: { number: item.number.toString(), tab: 'txs' } }) }
          loading={ isLoading }
          fontWeight={ 600 }
          minW="40px"
        >
          { item.transactions_count }
        </Link>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Commit tx</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        { item.commit_transaction_hash ? (
          <TxEntityL1
            isLoading={ isLoading }
            hash={ item.commit_transaction_hash }
            textStyle="sm"
            truncation="constant_long"
            noCopy
          />
        ) : <Text>{ tQuat('common.pending') }</Text> }
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Prove tx</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        { item.prove_transaction_hash ? (
          <TxEntityL1
            isLoading={ isLoading }
            hash={ item.prove_transaction_hash }
            textStyle="sm"
            truncation="constant_long"
            noCopy
          />
        ) : <Text>{ tQuat('common.pending') }</Text> }
      </ListItemMobileGrid.Value>

    </ListItemMobileGrid.Container>
  );
};

export default ZkSyncTxnBatchesListItem;
