import { localizeDisputeGameStatus } from './localizeDisputeGameStatus';
// Modified by Quat Capital, 2026-10-27: localized L2 and interop interface. GPL-3.0.
// Modified by Quat Capital, 2026-10-26: T18 reviewed literal localization. GPL-3.0.
import React from 'react';

import type { OptimisticL2DisputeGamesItem } from 'types/api/optimisticL2';

import config from 'configs/app';
import { layerLabels } from 'lib/rollups/utils';
import { Skeleton } from 'toolkit/chakra/skeleton';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import BlockEntityL2 from 'ui/shared/entities/block/BlockEntityL2';
import HashStringShorten from 'ui/shared/HashStringShorten';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import { useTranslation } from 'react-i18next';


const rollupFeature = config.features.rollup;

type Props = { item: OptimisticL2DisputeGamesItem; isLoading?: boolean };

const OptimisticL2DisputeGamesListItem = ({ item, isLoading }: Props) => {
  const { t: tQuat } = useTranslation();

  if (!rollupFeature.isEnabled || rollupFeature.type !== 'optimistic') {
    return null;
  }

  return (
    <ListItemMobileGrid.Container>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('l2Ui.index') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value fontWeight={ 600 } color="text.primary">
        <Skeleton loading={ isLoading } display="inline-block">{ item.index }</Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('l2Ui.game_type') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton loading={ isLoading } display="inline-block">{ item.game_type }</Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('l2Ui.address') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value color="text.primary">
        <Skeleton loading={ isLoading } display="flex" overflow="hidden" w="100%" alignItems="center">
          <HashStringShorten hash={ item.contract_address_hash } type="long"/>
          <CopyToClipboard text={ item.contract_address_hash } ml={ 2 } isLoading={ isLoading }/>
        </Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('l2Ui.layer_block_marker', { layer: layerLabels.current }) }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <BlockEntityL2
          isLoading={ isLoading }
          number={ item.l2_block_number }
          noIcon
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('l2Ui.age') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TimeWithTooltip
          timestamp={ item.created_at }
          isLoading={ isLoading }
          display="inline-block"
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('l2Ui.status') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value color="text.primary">
        <Skeleton loading={ isLoading } display="inline-block">{ localizeDisputeGameStatus(item.status, tQuat) }</Skeleton>
      </ListItemMobileGrid.Value>

      { item.resolved_at && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('l2Ui.resolution_age') }</ListItemMobileGrid.Label><ListItemMobileGrid.Value>
            <TimeWithTooltip
              timestamp={ item.resolved_at }
              isLoading={ isLoading }
              display="inline-block"
            />
          </ListItemMobileGrid.Value>
        </>
      ) }

    </ListItemMobileGrid.Container>
  );
};

export default OptimisticL2DisputeGamesListItem;
