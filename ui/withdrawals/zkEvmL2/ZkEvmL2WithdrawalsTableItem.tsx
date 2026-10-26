// Modified by Quat Capital, 2026-10-26: localize validators, epochs and transfers. GPL-3.0.
import { chakra } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { ZkEvmL2WithdrawalsItem } from 'types/api/zkEvmL2';

import config from 'configs/app';
import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import SimpleValue from 'ui/shared/value/SimpleValue';

const rollupFeature = config.features.rollup;

type Props = { item: ZkEvmL2WithdrawalsItem; isLoading?: boolean };

const ZkEvmL2WithdrawalsTableItem = ({ item, isLoading }: Props) => {
  const { locale } = useLocale();
  const { t } = useTranslation();
  if (!rollupFeature.isEnabled || rollupFeature.type !== 'zkEvm') {
    return null;
  }

  return (
    <TableRow>
      <TableCell verticalAlign="middle">
        <BlockEntity
          number={ item.block_number }
          isLoading={ isLoading }
          textStyle="sm"
          fontWeight={ 600 }
          noIcon
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading }>
          <span>{ formatNumber(item.index, locale) }</span>
        </Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle">
        <TxEntity
          isLoading={ isLoading }
          hash={ item.l2_transaction_hash }
          textStyle="sm"
          truncation="constant_long"
          noIcon
        />
      </TableCell>
      <TableCell verticalAlign="middle" pr={ 12 }>
        <TimeWithTooltip
          timestamp={ item.timestamp }
          isLoading={ isLoading }
          color="text.secondary"
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        { item.l1_transaction_hash ? (
          <TxEntityL1
            isLoading={ isLoading }
            hash={ item.l1_transaction_hash }
            truncation="constant_long"
            noIcon
            textStyle="sm"
            noCopy
          />
        ) : (
          <chakra.span color="text.secondary">
            { t('networkTransfers.pending_claim') }</chakra.span>
        ) }
      </TableCell>
      <TableCell verticalAlign="middle" isNumeric>
        <SimpleValue
          value={ BigNumber(item.value) }
          loading={ isLoading }
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading } display="inline-block">
          <span>{ item.symbol }</span>
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default ZkEvmL2WithdrawalsTableItem;
