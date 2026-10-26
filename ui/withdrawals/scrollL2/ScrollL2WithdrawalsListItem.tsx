// Modified by Quat Capital, 2026-10-26: localize validators, epochs and transfers. GPL-3.0.
import { chakra } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { ScrollL2MessageItem } from 'types/api/scrollL2';

import config from 'configs/app';
import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { layerLabels } from 'lib/rollups/utils';
import { Skeleton } from 'toolkit/chakra/skeleton';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';

const rollupFeature = config.features.rollup;

type Props = { item: ScrollL2MessageItem; isLoading?: boolean };

const ScrollL2WithdrawalsListItem = ({ item, isLoading }: Props) => {
  const { locale } = useLocale();
  const { t } = useTranslation();
  if (!rollupFeature.isEnabled || rollupFeature.type !== 'scroll') {
    return null;
  }

  return (
    <ListItemMobileGrid.Container>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ t('networkTransfers.layer_block', { layer: layerLabels.current }) }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <BlockEntity
          number={ item.origination_transaction_block_number }
          isLoading={ isLoading }
          fontWeight={ 600 }
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ t('networkTransfers.index') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton loading={ isLoading } display="inline-block">
          { formatNumber(item.id, locale) }
        </Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ t('networkTransfers.layer_tx_hash', { layer: layerLabels.current }) }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TxEntity
          isLoading={ isLoading }
          hash={ item.origination_transaction_hash }
          truncation="constant_long"
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ t('networkTransfers.age') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TimeWithTooltip
          timestamp={ item.origination_timestamp }
          isLoading={ isLoading }
          display="inline-block"
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ t('networkTransfers.layer_tx_hash', { layer: layerLabels.parent }) }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        { item.completion_transaction_hash ? (
          <TxEntityL1
            isLoading={ isLoading }
            hash={ item.completion_transaction_hash }
            truncation="constant_long"
            noCopy
          />
        ) : (
          <chakra.span>
            { t('networkTransfers.pending_claim') }</chakra.span>
        ) }
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ t('networkTransfers.value') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <NativeCoinValue
          amount={ item.value }
          loading={ isLoading }
        />
      </ListItemMobileGrid.Value>

    </ListItemMobileGrid.Container>
  );
};

export default ScrollL2WithdrawalsListItem;
