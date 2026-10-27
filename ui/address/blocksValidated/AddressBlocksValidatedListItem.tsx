// Modified by Quat Capital, 2026-10-27: localize validated-block transaction and gas counts. GPL-3.0.
import { Text, Flex } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { Block } from 'types/api/block';

import config from 'configs/app';
import getBlockTotalReward from 'lib/block/getBlockTotalReward';
import { formatBigNumber, formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { currencyUnits } from 'lib/units';
import { Skeleton } from 'toolkit/chakra/skeleton';
import BlockGasUsed from 'ui/shared/block/BlockGasUsed';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import SimpleValue from 'ui/shared/value/SimpleValue';

type Props = Block & {
  page: number;
  isLoading: boolean;
};

const AddressBlocksValidatedListItem = (props: Props) => {
  const { t: tQuat } = useTranslation();
  const { locale } = useLocale();

  const totalReward = getBlockTotalReward(props);

  return (
    <ListItemMobile rowGap={ 2 }>
      <Flex justifyContent="space-between" w="100%">
        <BlockEntity
          isLoading={ props.isLoading }
          number={ props.height }
          noIcon
          fontWeight={ 700 }
        />
        <TimeWithTooltip
          timestamp={ props.timestamp }
          enableIncrement={ props.page === 1 }
          isLoading={ props.isLoading }
          color="text.secondary"
          display="inline-block"
        />
      </Flex>
      <Flex columnGap={ 2 } w="100%">
        <Skeleton loading={ props.isLoading } fontWeight={ 500 } flexShrink={ 0 }>{ tQuat('home.txn') }</Skeleton>
        <Skeleton loading={ props.isLoading } display="inline-block" color="Skeleton_secondary">
          <span>{ formatNumber(props.transactions_count, locale) }</span>
        </Skeleton>
      </Flex>
      <Flex columnGap={ 2 } w="100%">
        <Skeleton loading={ props.isLoading } fontWeight={ 500 } flexShrink={ 0 }>{ tQuat('common.gas_used') }</Skeleton>
        <Skeleton loading={ props.isLoading }>
          <Text color="text.secondary">{ formatBigNumber(BigNumber(props.gas_used || 0), locale) }</Text>
        </Skeleton>
        <BlockGasUsed
          gasUsed={ props.gas_used || undefined }
          gasLimit={ props.gas_limit }
          isLoading={ props.isLoading }
        />
      </Flex>
      { !config.UI.views.block.hiddenFields?.total_reward && !config.features.rollup.isEnabled && (
        <Flex columnGap={ 2 } w="100%">
          <Skeleton loading={ props.isLoading } fontWeight={ 500 } flexShrink={ 0 }>{ tQuat('home.reward') }{ ' ' }{ currencyUnits.ether }</Skeleton>
          <SimpleValue
            value={ totalReward }
            accuracy={ 0 }
            loading={ props.isLoading }
            color="text.secondary"
          />
        </Flex>
      ) }
    </ListItemMobile>
  );
};

export default React.memo(AddressBlocksValidatedListItem);
