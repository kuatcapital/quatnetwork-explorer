// Modified by Quat Capital, 2026-10-26: localize validators, epochs and transfers. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { OptimisticL2WithdrawalsItem } from 'types/api/optimisticL2';

import config from 'configs/app';
import dayjs from 'lib/date/dayjs';
import { useLocale } from 'lib/i18n/provider';
import { layerLabels } from 'lib/rollups/utils';
import { Skeleton } from 'toolkit/chakra/skeleton';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';

import OptimisticL2WithdrawalsItemStatus from './OptimisticL2WithdrawalsItemStatus';

const rollupFeature = config.features.rollup;

type Props = { item: OptimisticL2WithdrawalsItem; isLoading?: boolean };

const OptimisticL2WithdrawalsListItem = ({ item, isLoading }: Props) => {
  const { locale } = useLocale();
  const { t } = useTranslation();
  const timeToEnd = item.challenge_period_end ?
    t('networkTransfers.time_remaining', { duration: dayjs(item.challenge_period_end).locale(locale).fromNow(true) }) : null;

  if (!rollupFeature.isEnabled || rollupFeature.type !== 'optimistic') {
    return null;
  }

  return (
    <ListItemMobileGrid.Container>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ t('networkTransfers.msg_nonce') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton loading={ isLoading } display="inline-block">
          { item.msg_nonce_version + '-' + item.msg_nonce }
        </Skeleton>
      </ListItemMobileGrid.Value>

      { item.from && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>{ t('networkTransfers.from') }</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <AddressEntity
              address={ item.from }
              isLoading={ isLoading }
              truncation="constant"
            />
          </ListItemMobileGrid.Value>
        </>
      ) }

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ t('networkTransfers.layer_tx_hash', { layer: layerLabels.current }) }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TxEntity
          isLoading={ isLoading }
          hash={ item.l2_transaction_hash }
          truncation="constant_long"
        />
      </ListItemMobileGrid.Value>

      { item.l2_timestamp && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>{ t('networkTransfers.age') }</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <TimeWithTooltip
              timestamp={ item.l2_timestamp }
              isLoading={ isLoading }
              display="inline-block"
            />
          </ListItemMobileGrid.Value>
        </>
      ) }

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ t('networkTransfers.status') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <OptimisticL2WithdrawalsItemStatus data={ item } isLoading={ isLoading }/>
      </ListItemMobileGrid.Value>

      { item.l1_transaction_hash && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>{ t('networkTransfers.layer_tx_hash', { layer: layerLabels.parent }) }</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <TxEntityL1
              isLoading={ isLoading }
              hash={ item.l1_transaction_hash }
              truncation="constant_long"
              noCopy
            />
          </ListItemMobileGrid.Value>
        </>
      ) }

      { timeToEnd && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>{ t('networkTransfers.time_left') }</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>{ timeToEnd }</ListItemMobileGrid.Value>
        </>
      ) }

    </ListItemMobileGrid.Container>
  );
};

export default OptimisticL2WithdrawalsListItem;
