// Modified by Quat Capital, 2026-10-26: localize validators, epochs and transfers. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { AddressWithdrawalsItem } from 'types/api/address';
import type { BlockWithdrawalsItem } from 'types/api/block';
import type { WithdrawalsItem } from 'types/api/withdrawals';

import config from 'configs/app';
import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { Skeleton } from 'toolkit/chakra/skeleton';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';

const feature = config.features.beaconChain;

type Props = ({
  item: WithdrawalsItem;
  view: 'list';
} | {
  item: AddressWithdrawalsItem;
  view: 'address';
} | {
  item: BlockWithdrawalsItem;
  view: 'block';
}) & { isLoading?: boolean };

const BeaconChainWithdrawalsListItem = ({ item, isLoading, view }: Props) => {
  const { locale } = useLocale();
  const { t } = useTranslation();
  if (!feature.isEnabled) {
    return null;
  }

  return (
    <ListItemMobileGrid.Container gridTemplateColumns="100px auto">

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ t('networkTransfers.index') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton loading={ isLoading } display="inline-block">{ formatNumber(item.index, locale) }</Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ t('networkTransfers.validator_index') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton loading={ isLoading } display="inline-block">{ item.validator_index }</Skeleton>
      </ListItemMobileGrid.Value>

      { view !== 'block' && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>{ t('networkTransfers.block') }</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <BlockEntity
              number={ item.block_number }
              isLoading={ isLoading }
              textStyle="sm"
            />
          </ListItemMobileGrid.Value>
        </>
      ) }

      { view !== 'address' && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>{ t('networkTransfers.to') }</ListItemMobileGrid.Label><ListItemMobileGrid.Value>
            <AddressEntity
              address={ item.receiver }
              isLoading={ isLoading }
              truncation="constant"
            />
          </ListItemMobileGrid.Value>
        </>
      ) }

      { view !== 'block' && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>{ t('networkTransfers.age') }</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <TimeWithTooltip
              timestamp={ item.timestamp }
              isLoading={ isLoading }
              display="inline-block"
            />
          </ListItemMobileGrid.Value>

          <ListItemMobileGrid.Label isLoading={ isLoading }>{ t('networkTransfers.value') }</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <NativeCoinValue amount={ item.amount } loading={ isLoading }/>
          </ListItemMobileGrid.Value>
        </>
      ) }

    </ListItemMobileGrid.Container>
  );
};

export default BeaconChainWithdrawalsListItem;
