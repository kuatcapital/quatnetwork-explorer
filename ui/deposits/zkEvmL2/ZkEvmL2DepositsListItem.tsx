// Modified by Quat Capital, 2026-10-26: localize validators, epochs and transfers. GPL-3.0.
import { chakra } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { ZkEvmL2DepositsItem } from 'types/api/zkEvmL2';

import config from 'configs/app';
import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { layerLabels } from 'lib/rollups/utils';
import { Skeleton } from 'toolkit/chakra/skeleton';
import BlockEntityL1 from 'ui/shared/entities/block/BlockEntityL1';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import SimpleValue from 'ui/shared/value/SimpleValue';

const rollupFeature = config.features.rollup;

type Props = { item: ZkEvmL2DepositsItem; isLoading?: boolean };

const ZkEvmL2DepositsListItem = ({ item, isLoading }: Props) => {
  const { locale } = useLocale();
  const { t } = useTranslation();
  if (!rollupFeature.isEnabled || rollupFeature.type !== 'zkEvm') {
    return null;
  }

  return (
    <ListItemMobileGrid.Container>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ t('networkTransfers.layer_block', { layer: layerLabels.parent }) }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <BlockEntityL1
          number={ item.block_number }
          isLoading={ isLoading }
          textStyle="sm"
          fontWeight={ 600 }
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ t('networkTransfers.index') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton loading={ isLoading } display="inline-block">
          { formatNumber(item.index, locale) }
        </Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ t('networkTransfers.layer_tx_hash', { layer: layerLabels.parent }) }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TxEntityL1
          isLoading={ isLoading }
          hash={ item.l1_transaction_hash }
          textStyle="sm"
          truncation="constant_long"
          noCopy
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ t('networkTransfers.age') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TimeWithTooltip
          timestamp={ item.timestamp }
          isLoading={ isLoading }
          display="inline-block"
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ t('networkTransfers.layer_tx_hash', { layer: layerLabels.current }) }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        { item.l2_transaction_hash ? (
          <TxEntity
            isLoading={ isLoading }
            hash={ item.l2_transaction_hash }
            textStyle="sm"
            truncation="constant_long"
          />
        ) : (
          <chakra.span>
            { t('networkTransfers.pending_claim') }</chakra.span>
        ) }
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ t('networkTransfers.value') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <SimpleValue
          value={ BigNumber(item.value) }
          loading={ isLoading }
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ t('networkTransfers.token') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton loading={ isLoading } display="inline-block">
          { item.symbol }
        </Skeleton>
      </ListItemMobileGrid.Value>

    </ListItemMobileGrid.Container>
  );
};

export default ZkEvmL2DepositsListItem;
