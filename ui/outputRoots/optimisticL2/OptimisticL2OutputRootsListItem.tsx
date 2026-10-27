// Modified by Quat Capital, 2026-10-27: localized L2 and interop interface. GPL-3.0.
// Modified by Quat Capital, 2026-10-26: T18 reviewed literal localization. GPL-3.0.
import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { OptimisticL2OutputRootsItem } from 'types/api/optimisticL2';

import config from 'configs/app';
import { layerLabels } from 'lib/rollups/utils';
import { Skeleton } from 'toolkit/chakra/skeleton';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import BlockEntityL2 from 'ui/shared/entities/block/BlockEntityL2';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import HashStringShorten from 'ui/shared/HashStringShorten';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import { useTranslation } from 'react-i18next';


const rollupFeature = config.features.rollup;

type Props = { item: OptimisticL2OutputRootsItem; isLoading?: boolean };

const OptimisticL2OutputRootsListItem = ({ item, isLoading }: Props) => {
  const { t: tQuat } = useTranslation();

  if (!rollupFeature.isEnabled || rollupFeature.type !== 'optimistic') {
    return null;
  }

  return (
    <ListItemMobileGrid.Container>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ layerLabels.current }{ ' ' }{ tQuat('l2Ui.output_index') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value fontWeight={ 600 } color="text.primary">
        <Skeleton loading={ isLoading } display="inline-block">{ item.l2_output_index }</Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('l2Ui.age') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TimeWithTooltip
          timestamp={ item.l1_timestamp }
          isLoading={ isLoading }
          display="inline-block"
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('l2Ui.layer_block_marker', { layer: layerLabels.current }) }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <BlockEntityL2
          isLoading={ isLoading }
          number={ item.l2_block_number }
          noIcon
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('l2Ui.layer_txn_hash', { layer: layerLabels.parent }) }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value py="3px">
        <TxEntityL1
          isLoading={ isLoading }
          hash={ item.l1_transaction_hash }
          truncation="constant_long"
          noCopy
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('l2Ui.output_root') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Flex overflow="hidden" whiteSpace="nowrap" alignItems="center" w="100%" justifyContent="start">
          <Skeleton loading={ isLoading } color="text.secondary">
            <HashStringShorten hash={ item.output_root } type="long"/>
          </Skeleton>
          <CopyToClipboard text={ item.output_root } isLoading={ isLoading }/>
        </Flex>
      </ListItemMobileGrid.Value>

    </ListItemMobileGrid.Container>
  );
};

export default OptimisticL2OutputRootsListItem;
