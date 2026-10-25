// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import { chakra } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { scroller } from 'react-scroll';

import type { TokenInfo } from 'types/api/token';

import config from 'configs/app';
import type { ResourceError } from 'lib/api/resources';
import useApiQuery from 'lib/api/useApiQuery';
import { useMultichainContext } from 'lib/contexts/multichain';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import { formatBigNumber, formatNumber } from 'lib/format/localeNumbers';
import useIsMounted from 'lib/hooks/useIsMounted';
import { useLocale } from 'lib/i18n/provider';
import { isConfidentialTokenType } from 'lib/token/tokenTypes';
import { TOKEN_COUNTERS } from 'stubs/token';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import type { TokenTabs } from 'ui/pages/Token';
import AppActionButton from 'ui/shared/AppActionButton/AppActionButton';
import useAppActionData from 'ui/shared/AppActionButton/useAppActionData';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import DetailedInfoSponsoredItem from 'ui/shared/DetailedInfo/DetailedInfoSponsoredItem';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import AssetValue from 'ui/shared/value/AssetValue';

import TokenNftMarketplaces from './TokenNftMarketplaces';

interface Props {
  tokenQuery: UseQueryResult<TokenInfo, ResourceError<unknown>>;
}

const TokenDetails = ({ tokenQuery }: Props) => {
  const { t: tQuat } = useTranslation();
  const { locale } = useLocale();

  const router = useRouter();
  const isMounted = useIsMounted();

  const hash = router.query.hash?.toString();

  const multichainContext = useMultichainContext();
  const chainSlug = multichainContext?.chain?.slug;

  const tokenCountersQuery = useApiQuery('general:token_counters', {
    pathParams: { hash },
    queryOptions: { enabled: Boolean(router.query.hash), placeholderData: TOKEN_COUNTERS },
  });

  const appActionData = useAppActionData(hash);

  const changeUrlAndScroll = useCallback((tab: TokenTabs) => () => {

    router.push(
      chainSlug ?
        { pathname: '/chain/[chain_slug]/token/[hash]', query: { hash: hash || '', tab, chain_slug: chainSlug } } :
        { pathname: '/token/[hash]', query: { hash: hash || '', tab } },
      undefined,
      { shallow: true },
    );
    scroller.scrollTo('token-tabs', {
      duration: 500,
      smooth: true,
    });
  }, [ chainSlug, hash, router ]);

  const countersItem = useCallback((item: 'token_holders_count' | 'transfers_count') => {
    const itemValue = tokenCountersQuery.data?.[item];
    if (!itemValue) {
      return tQuat('tokenUi.unavailable');
    }
    if (itemValue === '0') {
      return itemValue;
    }

    const tab: TokenTabs = item === 'token_holders_count' ? 'holders' : 'token_transfers';

    return (
      <Link onClick={ changeUrlAndScroll(tab) } loading={ tokenCountersQuery.isPlaceholderData }>
        { formatBigNumber(BigNumber(itemValue), locale) }
      </Link>
    );
  }, [ tokenCountersQuery.data, tokenCountersQuery.isPlaceholderData, changeUrlAndScroll, tQuat, locale ]);

  throwOnResourceLoadError(tokenQuery);

  if (!isMounted) {
    return null;
  }

  const {
    exchange_rate: exchangeRate,
    total_supply: totalSupply,
    circulating_market_cap: marketCap,
    decimals,
    symbol,
    type,
    zilliqa,
  } = tokenQuery.data || {};

  return (
    <DetailedInfo.Container>
      { zilliqa?.zrc2_address_hash && (
        <>
          <DetailedInfo.ItemLabel
            hint={ tQuat('tokenUi.zrc_hint') }
            isLoading={ tokenQuery.isPlaceholderData }
          >{ tQuat('tokenUi.zrc_address') }</DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <Skeleton loading={ tokenQuery.isPlaceholderData } display="inline-block">
              <AddressEntity address={{ hash: zilliqa.zrc2_address_hash }} isLoading={ tokenQuery.isPlaceholderData }/>
            </Skeleton>
          </DetailedInfo.ItemValue>
        </>
      ) }

      { exchangeRate && (
        <>
          <DetailedInfo.ItemLabel
            hint={ tQuat('tokenUi.price_hint') }
            isLoading={ tokenQuery.isPlaceholderData }
          >{ tQuat('tokenUi.price') }</DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <Skeleton loading={ tokenQuery.isPlaceholderData } display="inline-block">
              <span>{ `$${ formatNumber(Number(exchangeRate), locale, { minimumSignificantDigits: 4 }) }` }</span>
            </Skeleton>
          </DetailedInfo.ItemValue>
        </>
      ) }

      { marketCap && (
        <>
          <DetailedInfo.ItemLabel
            hint={ tQuat('tokenUi.market_cap_hint') }
            isLoading={ tokenQuery.isPlaceholderData }
          >{ tQuat('tokenUi.market_cap') }</DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <Skeleton loading={ tokenQuery.isPlaceholderData } display="inline-block">
              <span>{ `$${ formatBigNumber(BigNumber(marketCap), locale) }` }</span>
            </Skeleton>
          </DetailedInfo.ItemValue>
        </>
      ) }
      { type && !isConfidentialTokenType(type) && (
        <>
          <DetailedInfo.ItemLabel
            hint={ tQuat('tokenUi.supply_hint') }
            isLoading={ tokenQuery.isPlaceholderData }
          >{ tQuat('tokenUi.max_supply') }</DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue
            alignSelf="center"
            wordBreak="break-word"
            whiteSpace="pre-wrap"
          >
            <AssetValue
              amount={ totalSupply }
              asset={ <chakra.span maxW="50%" overflow="hidden" textOverflow="ellipsis"> { symbol }</chakra.span> }
              accuracy={ 3 }
              decimals={ decimals ?? '0' }
              loading={ tokenQuery.isPlaceholderData }
              w="100%"
            />
          </DetailedInfo.ItemValue>
        </>
      ) }

      <DetailedInfo.ItemLabel
        hint={ tQuat('tokenUi.holders_hint') }
        isLoading={ tokenQuery.isPlaceholderData }
      >{ tQuat('tokenUi.holders') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton loading={ tokenCountersQuery.isPlaceholderData }>
          { countersItem('token_holders_count') }
        </Skeleton>
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint={ tQuat('tokenUi.transfers_hint') }
        isLoading={ tokenQuery.isPlaceholderData }
      >{ tQuat('tokenUi.transfers') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton loading={ tokenCountersQuery.isPlaceholderData }>
          { countersItem('transfers_count') }
        </Skeleton>
      </DetailedInfo.ItemValue>

      { decimals && (
        <>
          <DetailedInfo.ItemLabel
            hint={ tQuat('tokenUi.decimals_hint') }
            isLoading={ tokenQuery.isPlaceholderData }
          >{ tQuat('tokenUi.decimals') }</DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <Skeleton loading={ tokenQuery.isPlaceholderData } minW={ 6 }>
              { decimals }
            </Skeleton>
          </DetailedInfo.ItemValue>
        </>
      ) }

      { type !== 'ERC-20' && (
        <TokenNftMarketplaces
          hash={ hash }
          isLoading={ tokenQuery.isPlaceholderData }
          appActionData={ appActionData }
          source="NFT collection"
        />
      ) }

      { (type !== 'ERC-20' && config.UI.views.nft.marketplaces.length === 0 && appActionData) && (
        <>
          <DetailedInfo.ItemLabel
            hint={ tQuat('tokenUi.dapp_hint') }
          >{ tQuat('tokenUi.dapp') }</DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue
            py="1px"
          >
            <AppActionButton data={ appActionData } height="30px" source="NFT collection"/>
          </DetailedInfo.ItemValue>
        </>
      ) }

      <DetailedInfoSponsoredItem isLoading={ tokenQuery.isPlaceholderData }/>
    </DetailedInfo.Container>
  );
};

export default React.memo(TokenDetails);
