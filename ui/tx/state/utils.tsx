// Modified by Quat Capital, 2026-10-25: request-aware state labels and precise locale display. GPL-3.0.
import { Flex } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { TxStateChange } from 'types/api/txStateChanges';

import config from 'configs/app';
import { formatBigNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import getNetworkValidatorTitle from 'lib/networks/getNetworkValidatorTitle';
import { currencyUnits } from 'lib/units';
import { Badge } from 'toolkit/chakra/badge';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import { ZERO_ADDRESS } from 'toolkit/utils/consts';
import { nbsp, space } from 'toolkit/utils/htmlEntities';
import NftEntity from 'ui/shared/entities/nft/NftEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';

import TxStateTokenIdList from './TxStateTokenIdList';

const PRODUCER_KEYS: Record<string, string> = {
  miner: 'transactions.miner',
  validator: 'common.validator',
  poster: 'home.poster',
  sequencer: 'home.sequencer',
  'fee recipient': 'home.fee_recipient',
};

export function useStateElements(data: TxStateChange, isLoading?: boolean) {
  const { t: tTx } = useTranslation();
  const { locale } = useLocale();
  const tag = (() => {
    if (data.is_miner) {
      return (
        <Tooltip content={ tTx('transactions.block_producer_hint') }>
          <Badge textTransform="capitalize" colorPalette="yellow" loading={ isLoading }>
            { tTx(PRODUCER_KEYS[getNetworkValidatorTitle()]) }
          </Badge>
        </Tooltip>
      );
    }

    if (data.address.hash === ZERO_ADDRESS) {
      const changeDirection = (() => {
        if (Array.isArray(data.change)) {
          const firstChange = data.change[0];
          return firstChange.direction;
        }
        return Number(data.change) > 0 ? 'to' : 'from';
      })();

      if (changeDirection) {
        const text = tTx(changeDirection === 'from' ? 'transactions.mint_address' : 'transactions.burn_address');
        return (
          <Tooltip content={ tTx('transactions.mint_burn_address_hint') }>
            <Badge textTransform="capitalize" colorPalette="yellow" loading={ isLoading }>{ text }</Badge>
          </Tooltip>
        );
      }
    }

    return null;
  })();

  switch (data.type) {
    case 'coin': {
      const beforeBn = BigNumber(data.balance_before || '0').div(10 ** config.chain.currency.decimals);
      const afterBn = BigNumber(data.balance_after || '0').div(10 ** config.chain.currency.decimals);
      const differenceBn = afterBn.minus(beforeBn);
      const changeColor = beforeBn.lte(afterBn) ? 'green.500' : 'red.500';
      const changeSign = beforeBn.lte(afterBn) ? '+' : '-';

      return {
        before: (
          <Skeleton loading={ isLoading } wordBreak="break-all" display="inline-block">
            { formatBigNumber(beforeBn, locale) } { currencyUnits.ether }
          </Skeleton>
        ),
        after: (
          <Skeleton loading={ isLoading } wordBreak="break-all" display="inline-block">
            { formatBigNumber(afterBn, locale) } { currencyUnits.ether }
          </Skeleton>
        ),
        change: (
          <Skeleton loading={ isLoading } display="inline-block" color={ changeColor }>
            <span>{ changeSign }{ nbsp }{ formatBigNumber(differenceBn.abs(), locale) }</span>
          </Skeleton>
        ),
        tag,
      };
    }
    case 'token': {
      const tokenLink = (
        <TokenEntity
          token={ data.token }
          isLoading={ isLoading }
          noIcon
          noCopy
          onlySymbol
          w="auto"
        />
      );
      const beforeBn = BigNumber(data.balance_before || '0').div(BigNumber(10 ** (Number(data.token.decimals))));
      const afterBn = BigNumber(data.balance_after || '0').div(BigNumber(10 ** (Number(data.token.decimals))));
      const change = (() => {
        let differenceBn;
        if (typeof data.change === 'string') {
          differenceBn = BigNumber(data.change || '0').div(BigNumber(10 ** (Number(data.token.decimals))));
        } else {
          differenceBn = afterBn.minus(beforeBn);
        }

        if (!differenceBn || differenceBn.isEqualTo(0)) {
          return null;
        }

        const changeColor = differenceBn.isGreaterThanOrEqualTo(0) ? 'green.500' : 'red.500';
        const changeSign = differenceBn.isGreaterThanOrEqualTo(0) ? '+' : '-';

        return (
          <Skeleton loading={ isLoading } display="inline-block" color={ changeColor } wordBreak="break-all">
            <span>{ changeSign }{ nbsp }{ formatBigNumber(differenceBn.abs(), locale) }</span>
          </Skeleton>
        );
      })();

      const tokenId = (() => {
        if (!Array.isArray(data.change)) {
          if ('token_id' in data && data.token_id) {
            return (
              <NftEntity
                hash={ data.token.address_hash }
                id={ data.token_id }
                isLoading={ isLoading }
              />
            );
          } else {
            return null;
          }
        }

        return <TxStateTokenIdList items={ data.change } tokenAddress={ data.token.address_hash } isLoading={ isLoading }/>;
      })();

      return {
        before: data.balance_before ? (
          <Flex whiteSpace="pre-wrap" justifyContent={{ base: 'flex-start', lg: 'flex-end' }} flexWrap="wrap">
            <Skeleton loading={ isLoading } wordBreak="break-all">{ formatBigNumber(beforeBn, locale) }</Skeleton>
            <span>{ space }</span>
            { tokenLink }
          </Flex>
        ) : null,
        after: data.balance_after ? (
          <Flex whiteSpace="pre-wrap" justifyContent={{ base: 'flex-start', lg: 'flex-end' }} flexWrap="wrap">
            <Skeleton loading={ isLoading } wordBreak="break-all">{ formatBigNumber(afterBn, locale) }</Skeleton>
            <span>{ space }</span>
            { tokenLink }
          </Flex>
        ) : null,
        change,
        tag,
        tokenId,
      };
    }
  }
}
