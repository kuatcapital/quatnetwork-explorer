// Modified by Quat Capital, 2026-10-29: runtime native-token labels preserve machine token ids. GPL-3.0.
// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import { Flex, HStack, Grid, GridItem } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { TokenInfo } from 'types/api/token';
import type { AggregatedTokenInfo } from 'types/client/multichainAggregator';

import config from 'configs/app';
import multichainConfig from 'configs/multichain';
import { formatBigNumber, formatNumber } from 'lib/format/localeNumbers';
import getItemIndex from 'lib/getItemIndex';
import { useLocale } from 'lib/i18n/provider';
import { getTokenTypeName } from 'lib/token/tokenTypes';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tag } from 'toolkit/chakra/tag';
import AddressAddToWallet from 'ui/shared/address/AddressAddToWallet';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import SimpleValue from 'ui/shared/value/SimpleValue';
import { DEFAULT_ACCURACY_USD } from 'ui/shared/value/utils';

type Props = {
  token: TokenInfo | AggregatedTokenInfo;
  index: number;
  page: number;
  isLoading?: boolean;
};

const bridgedTokensFeature = config.features.bridgedTokens;

const TokensListItem = ({
  token,
  page,
  index,
  isLoading,
}: Props) => {
  const { t: tQuat } = useTranslation();
  const { locale } = useLocale();

  const {
    address_hash: addressHash,
    exchange_rate: exchangeRate,
    type,
    holders_count: holdersCount,
    circulating_market_cap: marketCap,
  } = token;

  const originalChainId = 'origin_chain_id' in token ? token.origin_chain_id : undefined;
  const chainInfos = 'chain_infos' in token ? token.chain_infos : undefined;

  const bridgedChainTag = bridgedTokensFeature.isEnabled ?
    bridgedTokensFeature.chains.find(({ id }) => id === originalChainId)?.short_title :
    undefined;

  const filecoinRobustAddress = 'filecoin_robust_address' in token ? token.filecoin_robust_address : undefined;

  const chainInfo = React.useMemo(() => {
    if (!chainInfos) {
      return;
    }

    const chainId = Object.keys(chainInfos)[0];
    const chain = multichainConfig()?.chains.find((chain) => chain.id === chainId);
    return chain;
  }, [ chainInfos ]);

  return (
    <ListItemMobile rowGap={ 3 }>
      <Grid
        width="100%"
        gridTemplateColumns="minmax(0, 1fr)"
      >
        <GridItem display="flex">
          <TokenEntity
            token={ token }
            chain={ chainInfo }
            isLoading={ isLoading }
            jointSymbol
            noCopy
            w="auto"
            textStyle="sm"
            fontWeight="700"
            noLink={ type === 'NATIVE' }
          />
          <Flex ml={ 3 } flexShrink={ 0 } columnGap={ 1 }>
            <Tag loading={ isLoading }>{ getTokenTypeName(type, chainInfo?.app_config, tQuat) }</Tag>
            { bridgedChainTag && <Tag loading={ isLoading }>{ bridgedChainTag }</Tag> }
          </Flex>
          <Skeleton loading={ isLoading } textStyle="sm" ml="auto" color="text.secondary" minW="24px" textAlign="right">
            <span>{ formatNumber(getItemIndex(index, page), locale) }</span>
          </Skeleton>
        </GridItem>
      </Grid>
      { type !== 'NATIVE' && (
        <Flex justifyContent="space-between" alignItems="center" width="150px" ml={ 7 } mt={ -2 }>
          <AddressEntity
            address={{ hash: addressHash, filecoin: { robust: filecoinRobustAddress } }}
            isLoading={ isLoading }
            truncation="constant"
            link={{ variant: 'secondary' }}
            noIcon
          />
          <AddressAddToWallet token={ token } isLoading={ isLoading }/>
        </Flex>
      ) }
      { exchangeRate && (
        <HStack gap={ 3 }>
          <Skeleton loading={ isLoading } textStyle="sm" fontWeight={ 500 }>{ tQuat('tokenUi.price') }</Skeleton>
          <SimpleValue
            value={ BigNumber(exchangeRate) }
            loading={ isLoading }
            accuracy={ 4 }
            prefix="$"
            textStyle="sm"
            color="text.secondary"
          />
        </HStack>
      ) }
      { marketCap && (
        <HStack gap={ 3 }>
          <Skeleton loading={ isLoading } textStyle="sm" fontWeight={ 500 }>{ tQuat('tokenUi.onchain_cap') }</Skeleton>
          <SimpleValue
            value={ BigNumber(marketCap) }
            loading={ isLoading }
            prefix="$"
            accuracy={ DEFAULT_ACCURACY_USD }
            textStyle="sm"
            color="text.secondary"
          />
        </HStack>
      ) }
      { holdersCount && (
        <HStack gap={ 3 }>
          <Skeleton loading={ isLoading } textStyle="sm" fontWeight={ 500 }>{ tQuat('tokenUi.holders') }</Skeleton>
          <Skeleton loading={ isLoading } textStyle="sm" color="text.secondary">
            <span>{ formatBigNumber(BigNumber(holdersCount || 0), locale) }</span>
          </Skeleton>
        </HStack>
      ) }
    </ListItemMobile>
  );
};

export default TokensListItem;
