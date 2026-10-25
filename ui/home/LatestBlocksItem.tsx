// Modified by Quat Capital, 2026-10-25: localized block card and producer labels (T18, GPL-3.0).
import { Box, Flex, Grid } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { Block } from 'types/api/block';

import config from 'configs/app';
import getBlockTotalReward from 'lib/block/getBlockTotalReward';
import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import getNetworkValidatorTitle from 'lib/networks/getNetworkValidatorTitle';
import { currencyUnits } from 'lib/units';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import { thinsp } from 'toolkit/utils/htmlEntities';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import IconSvg from 'ui/shared/IconSvg';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import SimpleValue from 'ui/shared/value/SimpleValue';

type Props = {
  block: Block;
  isLoading?: boolean;
  animation?: string;
};

const PRODUCER_KEYS = {
  validator: 'common.validator',
  miner: 'home.miner',
  poster: 'home.poster',
  sequencer: 'home.sequencer',
  'fee recipient': 'home.fee_recipient',
} as const;

const LatestBlocksItem = ({ block, isLoading, animation }: Props) => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const totalReward = getBlockTotalReward(block);
  return (
    <Box
      animation={ animation }
      borderRadius="md"
      border="1px solid"
      borderColor="border.divider"
      p={ 3 }
    >
      <Flex alignItems="center" overflow="hidden" w="100%" mb={ 3 }>
        <BlockEntity
          isLoading={ isLoading }
          number={ block.height }
          tailLength={ 2 }
          textStyle="md"
          fontWeight={ 500 }
          mr="auto"
        />
        { block.celo?.l1_era_finalized_epoch_number && (
          <Tooltip content={ t('home.finalized_epoch', { number: block.celo.l1_era_finalized_epoch_number }) }>
            <IconSvg name="checkered_flag" boxSize={ 5 } p="1px" ml={ 2 } isLoading={ isLoading } flexShrink={ 0 }/>
          </Tooltip>
        ) }
        <TimeWithTooltip
          timestamp={ block.timestamp }
          enableIncrement={ !isLoading }
          timeFormat="relative"
          isLoading={ isLoading }
          color="text.secondary"
          display="inline-block"
          textStyle="sm"
          flexShrink={ 0 }
          ml={ 2 }
        />
      </Flex>
      <Grid gridGap={ 2 } templateColumns="auto minmax(0, 1fr)" textStyle="sm">
        <Skeleton loading={ isLoading }>{ t('home.txn') }</Skeleton>
        <Skeleton loading={ isLoading } color="text.secondary"><span>{ formatNumber(block.transactions_count, locale) }</span></Skeleton>

        { !config.features.rollup.isEnabled && !config.UI.views.block.hiddenFields?.total_reward && (
          <>
            <Skeleton loading={ isLoading }>{ t('home.reward') }</Skeleton>
            <SimpleValue
              value={ totalReward }
              loading={ isLoading }
              color="text.secondary"
              endElement={ `${ thinsp }${ currencyUnits.ether }` }
            />
          </>
        ) }

        { !config.features.rollup.isEnabled && !config.UI.views.block.hiddenFields?.miner && (
          <>
            <Skeleton loading={ isLoading }>{ t(PRODUCER_KEYS[getNetworkValidatorTitle()]) }</Skeleton>
            <AddressEntity
              address={ block.miner }
              isLoading={ isLoading }
              noIcon
              noCopy
              truncation="constant"
            />
          </>
        ) }
      </Grid>
    </Box>
  );
};

export default LatestBlocksItem;
