// Modified by Quat Capital, 2026-10-27: complete epoch and reward value label localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { AddressEpochRewardsItem } from 'types/api/address';

import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import EpochEntity from 'ui/shared/entities/epoch/EpochEntity';
import EpochRewardTypeTag from 'ui/shared/EpochRewardTypeTag';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import TokenValue from 'ui/shared/value/TokenValue';

type Props = {
  item: AddressEpochRewardsItem;
  isLoading?: boolean;
};

const AddressEpochRewardsListItem = ({ item, isLoading }: Props) => {
  const { t: tQuat } = useTranslation();

  return (
    <ListItemMobileGrid.Container gridTemplateColumns="100px auto">

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('addressTxUi.epoch_label') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <EpochEntity number={ String(item.epoch_number) } noIcon isLoading={ isLoading }/>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('common.age') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TimeWithTooltip
          timestamp={ item.block_timestamp }
          isLoading={ isLoading }
          color="text.secondary"
          display="inline-block"
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('addresses.reward_type') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <EpochRewardTypeTag type={ item.type } isLoading={ isLoading }/>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('addresses.associated_address') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <AddressEntity
          address={ item.associated_account }
          isLoading={ isLoading }
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('addresses.reward_value') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TokenValue
          amount={ item.amount }
          token={ item.token }
          loading={ isLoading }
        />
      </ListItemMobileGrid.Value>

    </ListItemMobileGrid.Container>
  );
};

export default AddressEpochRewardsListItem;
