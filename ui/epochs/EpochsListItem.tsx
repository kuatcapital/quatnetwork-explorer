// Modified by Quat Capital, 2026-10-26: localize validators, epochs and transfers. GPL-3.0.
import { HStack } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { CeloEpochListItem } from 'types/api/epochs';

import dayjs from 'lib/date/dayjs';
import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { Skeleton } from 'toolkit/chakra/skeleton';
import EpochEntity from 'ui/shared/entities/epoch/EpochEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import CeloEpochStatus from 'ui/shared/statusTag/CeloEpochStatus';
import TextSeparator from 'ui/shared/TextSeparator';
import Time from 'ui/shared/time/Time';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';

interface Props {
  item: CeloEpochListItem;
  isLoading?: boolean;
}

const EpochsListItem = ({ item, isLoading }: Props) => {
  const { locale } = useLocale();
  const { t } = useTranslation();
  return (
    <ListItemMobile rowGap={ 1 } py={ 3 } w="full" textStyle="sm" fontWeight={ 500 } alignItems="stretch">
      <HStack minH="30px" gap={ 3 }>
        <EpochEntity number={ String(item.number) } isLoading={ isLoading }/>
        <Skeleton loading={ isLoading } color="text.secondary" fontWeight={ 400 } ml="auto"><span>{ item.type }</span></Skeleton>
        <CeloEpochStatus isFinalized={ item.is_finalized } loading={ isLoading }/>
      </HStack>
      { item.timestamp && (
        <Skeleton loading={ isLoading } display="flex" alignItems="center" minH="30px" color="text.secondary">
          <div>{ dayjs(item.timestamp).locale(locale).fromNow() }</div>
          <TextSeparator/>
          <Time timestamp={ item.timestamp } format="lll_s"/>
        </Skeleton>
      ) }
      <HStack minH="30px">
        <Skeleton loading={ isLoading }>{ t('networkTransfers.block_range') }</Skeleton>
        <Skeleton loading={ isLoading } color="text.secondary">
          <span>{ formatNumber(item.start_block_number, locale) } - { item.end_block_number ? formatNumber(item.end_block_number, locale) : '' }</span>
        </Skeleton>
      </HStack>
      { item.distribution?.community_transfer ? (
        <HStack minH="30px">
          <Skeleton loading={ isLoading }>{ t('networkTransfers.community') }</Skeleton>
          <NativeCoinValue
            amount={ item.distribution?.community_transfer.value }
            loading={ isLoading }
            color="text.secondary"
          />
        </HStack>
      ) : null }
      { item.distribution?.carbon_offsetting_transfer ? (
        <HStack minH="30px">
          <Skeleton loading={ isLoading }>{ t('networkTransfers.carbon') }</Skeleton>
          <NativeCoinValue
            amount={ item.distribution?.carbon_offsetting_transfer.value }
            loading={ isLoading }
            color="text.secondary"
          />
        </HStack>
      ) : null }
      { item.distribution?.transfers_total ? (
        <HStack minH="30px">
          <Skeleton loading={ isLoading }>{ t('networkTransfers.total') }</Skeleton>
          <NativeCoinValue
            amount={ item.distribution?.transfers_total.value }
            noSymbol
            loading={ isLoading }
            color="text.secondary"
          />
        </HStack>
      ) : null }
    </ListItemMobile>
  );
};

export default EpochsListItem;
