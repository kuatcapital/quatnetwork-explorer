// Modified by Quat Capital, 2026-10-26: localize validators, epochs and transfers. GPL-3.0.
import BigNumber from 'bignumber.js';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { OptimisticL2DepositsItem } from 'types/api/optimisticL2';

import config from 'configs/app';
import { formatBigNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { layerLabels } from 'lib/rollups/utils';
import { Skeleton } from 'toolkit/chakra/skeleton';
import AddressEntityL1 from 'ui/shared/entities/address/AddressEntityL1';
import BlockEntityL1 from 'ui/shared/entities/block/BlockEntityL1';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';

const rollupFeature = config.features.rollup;

type Props = { item: OptimisticL2DepositsItem; isLoading?: boolean };

const OptimisticDepositsListItem = ({ item, isLoading }: Props) => {
  const { locale } = useLocale();
  const { t } = useTranslation();
  if (!rollupFeature.isEnabled || rollupFeature.type !== 'optimistic') {
    return null;
  }

  return (
    <ListItemMobileGrid.Container>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ t('networkTransfers.layer_block_no', { layer: layerLabels.parent }) }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <BlockEntityL1
          number={ item.l1_block_number }
          isLoading={ isLoading }
          fontWeight={ 600 }
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ t('networkTransfers.layer_tx_hash', { layer: layerLabels.current }) }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TxEntity
          isLoading={ isLoading }
          hash={ item.l2_transaction_hash }
          truncation="constant_long"
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ t('networkTransfers.age') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TimeWithTooltip
          timestamp={ item.l1_block_timestamp }
          isLoading={ isLoading }
          display="inline-block"
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ t('networkTransfers.layer_tx_hash', { layer: layerLabels.parent }) }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TxEntityL1
          isLoading={ isLoading }
          hash={ item.l1_transaction_hash }
          truncation="constant_long"
          noCopy
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ t('networkTransfers.layer_tx_origin', { layer: layerLabels.parent }) }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <AddressEntityL1
          address={{ hash: item.l1_transaction_origin, name: '', is_contract: false, is_verified: false, ens_domain_name: null, implementations: null }}
          isLoading={ isLoading }
          noCopy
          truncation="constant"
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ t('networkTransfers.gas_limit') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton loading={ isLoading } display="inline-block">{ formatBigNumber(BigNumber(item.l2_transaction_gas_limit), locale) }</Skeleton>
      </ListItemMobileGrid.Value>

    </ListItemMobileGrid.Container>
  );
};

export default OptimisticDepositsListItem;
