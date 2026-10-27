import React from 'react';
import { useTranslation } from 'react-i18next';

import type { Pool } from 'types/api/pools';

import { NUMBER_LOCALES } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
// Modified by Quat Capital, 2026-10-27: T18 supplemental interface localization. GPL-3.0.

import { Skeleton } from 'toolkit/chakra/skeleton';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import DetailedInfoSponsoredItem from 'ui/shared/DetailedInfo/DetailedInfoSponsoredItem';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';

type Props = {
  data: Pool;
  isPlaceholderData: boolean;
};

const PoolInfo = ({ data, isPlaceholderData }: Props) => {
  const { locale } = useLocale();
  const { t: tQuat } = useTranslation();

  return (
    <DetailedInfo.Container>
      <DetailedInfo.ItemLabel
        isLoading={ isPlaceholderData }
        hint={ tQuat('suppUi.base_hint') }
      >{ tQuat('suppUi.base_token') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <TokenEntity
          token={{
            type: 'ERC-20',
            address_hash: data.base_token_address,
            name: data.base_token_symbol,
            symbol: data.base_token_symbol,
            icon_url: data.base_token_icon_url,
            reputation: null,
          }}
          isLoading={ isPlaceholderData }
        />
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        isLoading={ isPlaceholderData }
        hint={ tQuat('suppUi.quote_hint') }
      >{ tQuat('suppUi.quote_token') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <TokenEntity
          token={{
            type: 'ERC-20',
            address_hash: data.quote_token_address,
            name: data.quote_token_symbol,
            symbol: data.quote_token_symbol,
            icon_url: data.quote_token_icon_url,
            reputation: null,
          }}
          isLoading={ isPlaceholderData }
        />
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        isLoading={ isPlaceholderData }
        hint={ tQuat('suppUi.fdv_hint') }
      >{ tQuat('suppUi.base_fdv') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton loading={ isPlaceholderData }>
          { data.base_token_fully_diluted_valuation_usd ?
            `$${ Number(data.base_token_fully_diluted_valuation_usd).toLocaleString(NUMBER_LOCALES[locale], { maximumFractionDigits: 2, notation: 'compact' }) }` :
            tQuat('suppUi.not_available')
          }
        </Skeleton>
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        isLoading={ isPlaceholderData }
        hint={ tQuat('suppUi.cap_hint') }
      >{ tQuat('suppUi.base_cap') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton loading={ isPlaceholderData }>
          { data.base_token_market_cap_usd ?
            `$${ Number(data.base_token_market_cap_usd).toLocaleString(NUMBER_LOCALES[locale], { maximumFractionDigits: 2, notation: 'compact' }) }` :
            tQuat('suppUi.not_available')
          }
        </Skeleton>
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        isLoading={ isPlaceholderData }
        hint={ tQuat('suppUi.fdv_hint') }
      >{ tQuat('suppUi.quote_fdv') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton loading={ isPlaceholderData }>
          { data.quote_token_fully_diluted_valuation_usd ?
            `$${ Number(data.quote_token_fully_diluted_valuation_usd).toLocaleString(NUMBER_LOCALES[locale], { maximumFractionDigits: 2, notation: 'compact' }) }` :
            tQuat('suppUi.not_available')
          }
        </Skeleton>
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        isLoading={ isPlaceholderData }
        hint={ tQuat('suppUi.cap_hint') }
      >{ tQuat('suppUi.quote_cap') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton loading={ isPlaceholderData }>
          { data.quote_token_market_cap_usd ?
            `$${ Number(data.quote_token_market_cap_usd).toLocaleString(NUMBER_LOCALES[locale], { maximumFractionDigits: 2, notation: 'compact' }) }` :
            tQuat('suppUi.not_available')
          }
        </Skeleton>
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        isLoading={ isPlaceholderData }
        hint={ tQuat('suppUi.liquidity_hint') }
      >{ tQuat('suppUi.liquidity') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton loading={ isPlaceholderData }>
          ${ Number(data.liquidity).toLocaleString(NUMBER_LOCALES[locale], { maximumFractionDigits: 2, notation: 'compact' }) }
        </Skeleton>
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        isLoading={ isPlaceholderData }
        hint={ tQuat('suppUi.dex_hint') }
      >
        DEX
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton loading={ isPlaceholderData }>
          { data.dex.name }
        </Skeleton>
      </DetailedInfo.ItemValue>

      <DetailedInfoSponsoredItem isLoading={ isPlaceholderData }/>
    </DetailedInfo.Container>
  );
};

export default PoolInfo;
