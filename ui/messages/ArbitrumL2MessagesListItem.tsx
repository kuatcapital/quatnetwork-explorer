// Modified by Quat Capital, 2026-10-27: localized L2 and interop interface. GPL-3.0.
// Modified by Quat Capital, 2026-10-26: T18 reviewed literal localization. GPL-3.0.
import { chakra } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { ArbitrumL2MessagesItem } from 'types/api/arbitrumL2';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import { layerLabels } from 'lib/rollups/utils';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import BlockEntityL1 from 'ui/shared/entities/block/BlockEntityL1';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';
import ArbitrumL2MessageStatus from 'ui/shared/statusTag/ArbitrumL2MessageStatus';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';

import type { MessagesDirection } from './ArbitrumL2Messages';

const rollupFeature = config.features.rollup;

type Props = { item: ArbitrumL2MessagesItem; isLoading?: boolean; direction: MessagesDirection };

const ArbitrumL2MessagesListItem = ({ item, isLoading, direction }: Props) => {
  const { t: tQuat } = useTranslation();

  if (!rollupFeature.isEnabled || rollupFeature.type !== 'arbitrum') {
    return null;
  }

  const l1TxHash = direction === 'from-rollup' ? item.completion_transaction_hash : item.origination_transaction_hash;
  const l2TxHash = direction === 'from-rollup' ? item.origination_transaction_hash : item.completion_transaction_hash;

  return (
    <ListItemMobileGrid.Container gridTemplateColumns="110px auto">

      { direction === 'to-rollup' && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('l2Ui.layer_block', { layer: layerLabels.parent }) }</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            { item.origination_transaction_block_number ? (
              <BlockEntityL1
                number={ item.origination_transaction_block_number }
                isLoading={ isLoading }
                fontWeight={ 600 }
              />
            ) : <chakra.span>{ tQuat('l2Ui.not_available') }</chakra.span> }
          </ListItemMobileGrid.Value>
        </>
      ) }

      { direction === 'from-rollup' && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('common.from') }</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <AddressEntity
              address={{ hash: item.origination_address_hash }}
              truncation="constant"
              isLoading={ isLoading }
              fontWeight={ 600 }
            />
          </ListItemMobileGrid.Value>
        </>
      ) }

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('l2Ui.message_marker') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton loading={ isLoading } display="inline-block">
          { item.id }
        </Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('l2Ui.layer_transaction', { layer: layerLabels.current }) }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        { l2TxHash ? (
          <TxEntity
            isLoading={ isLoading }
            hash={ l2TxHash }
            truncation="constant_long"
          />
        ) : (
          <chakra.span>{ tQuat('l2Ui.not_available') }</chakra.span>
        ) }
      </ListItemMobileGrid.Value>

      { item.origination_timestamp && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('l2Ui.age') }</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <TimeWithTooltip
              timestamp={ item.origination_timestamp }
              isLoading={ isLoading }
              display="inline-block"
            />
          </ListItemMobileGrid.Value>
        </>
      ) }

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('l2Ui.status') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        { item.status === 'confirmed' && direction === 'from-rollup' ?
          <Link href={ route({ pathname: '/txn-withdrawals', query: { q: item.origination_transaction_hash } }) }>{ tQuat('l2Ui.ready_relay') }</Link> :
          <ArbitrumL2MessageStatus status={ item.status } isLoading={ isLoading }/> }
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('l2Ui.layer_transaction', { layer: layerLabels.parent }) }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        { l1TxHash ? (
          <TxEntityL1
            isLoading={ isLoading }
            hash={ l1TxHash }
            truncation="constant_long"
            noCopy
          />
        ) : (
          <chakra.span>{ tQuat('l2Ui.not_available') }</chakra.span>
        ) }
      </ListItemMobileGrid.Value>

    </ListItemMobileGrid.Container>
  );
};

export default ArbitrumL2MessagesListItem;
