// Modified by Quat Capital, 2026-10-27: localized L2 and interop interface. GPL-3.0.
// Modified by Quat Capital, 2026-10-26: T18 reviewed literal localization. GPL-3.0.
import { Text } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { ZkEvmL2TxnBatchesItem } from 'types/api/zkEvmL2';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import { Link } from 'toolkit/chakra/link';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import BatchEntityL2 from 'ui/shared/entities/block/BatchEntityL2';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import ZkEvmL2TxnBatchStatus from 'ui/shared/statusTag/ZkEvmL2TxnBatchStatus';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';

const rollupFeature = config.features.rollup;

type Props = { item: ZkEvmL2TxnBatchesItem; isLoading?: boolean };

const ZkEvmTxnBatchesTableItem = ({ item, isLoading }: Props) => {
  const { t: tQuat } = useTranslation();

  if (!rollupFeature.isEnabled || rollupFeature.type !== 'zkEvm') {
    return null;
  }

  return (
    <TableRow>
      <TableCell verticalAlign="middle">
        <BatchEntityL2
          isLoading={ isLoading }
          number={ item.number }
          textStyle="sm"
          fontWeight={ 600 }
          noIcon
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        <ZkEvmL2TxnBatchStatus status={ item.status } isLoading={ isLoading }/>
      </TableCell>
      <TableCell verticalAlign="middle">
        <TimeWithTooltip
          timestamp={ item.timestamp }
          fallbackText={ tQuat('l2Ui.undefined') }
          isLoading={ isLoading }
          color="text.secondary"
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        <Link
          href={ route({ pathname: '/batches/[number]', query: { number: item.number.toString(), tab: 'txs' } }) }
          minW="40px"
          my={ 1 }
          loading={ isLoading }
        >
          { item.transactions_count }
        </Link>
      </TableCell>
      <TableCell pr={ 12 } verticalAlign="middle">
        { item.verify_transaction_hash ? (
          <TxEntityL1
            isLoading={ isLoading }
            hash={ item.verify_transaction_hash }
            textStyle="sm"
            truncation="constant_long"
            noIcon
            noCopy
          />
        ) : <Text>{ tQuat('common.pending') }</Text> }
      </TableCell>
      <TableCell pr={ 12 } verticalAlign="middle">
        { item.sequence_transaction_hash ? (
          <TxEntityL1
            isLoading={ isLoading }
            hash={ item.sequence_transaction_hash }
            textStyle="sm"
            truncation="constant_long"
            noIcon
            noCopy
          />
        ) : <Text>{ tQuat('common.pending') }</Text> }
      </TableCell>
    </TableRow>
  );
};

export default ZkEvmTxnBatchesTableItem;
