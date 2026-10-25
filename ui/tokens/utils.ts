// Modified by Quat Capital, 2026-10-25: localize token sort labels at render time. GPL-3.0.
import type { TFunction } from 'i18next';

import type { TokensSortingValue } from 'types/api/tokens';
import type { ClusterChainConfig } from 'types/multichain';

import config from 'configs/app';
import getFilterValuesFromQuery from 'lib/getFilterValuesFromQuery';
import { getTokenTypes } from 'lib/token/tokenTypes';
import type { SelectOption } from 'toolkit/chakra/select';

export const SORT_OPTIONS: Array<SelectOption<TokensSortingValue>> = [
  { label: 'tokenUi.sort_default', value: 'default' },
  { label: 'tokenUi.sort_price_asc', value: 'fiat_value-asc' },
  { label: 'tokenUi.sort_price_desc', value: 'fiat_value-desc' },
  { label: 'tokenUi.sort_holders_asc', value: 'holders_count-asc' },
  { label: 'tokenUi.sort_holders_desc', value: 'holders_count-desc' },
  { label: 'tokenUi.sort_cap_asc', value: 'circulating_market_cap-asc' },
  { label: 'tokenUi.sort_cap_desc', value: 'circulating_market_cap-desc' },
];

export function getLocalizedSortOptions(t: TFunction): Array<SelectOption<TokensSortingValue>> {
  return [
    { label: t('tokenUi.sort_default'), value: 'default' },
    { label: t('tokenUi.sort_price_asc'), value: 'fiat_value-asc' },
    { label: t('tokenUi.sort_price_desc'), value: 'fiat_value-desc' },
    { label: t('tokenUi.sort_holders_asc'), value: 'holders_count-asc' },
    { label: t('tokenUi.sort_holders_desc'), value: 'holders_count-desc' },
    { label: t('tokenUi.sort_cap_asc'), value: 'circulating_market_cap-asc' },
    { label: t('tokenUi.sort_cap_desc'), value: 'circulating_market_cap-desc' },
  ];
}

export const getTokenFilterValue = (
  value: string | Array<string> | undefined,
  chainConfig?: Array<ClusterChainConfig['app_config']> | ClusterChainConfig['app_config'],
) => {
  const tokenTypes = getTokenTypes(false, chainConfig);
  return getFilterValuesFromQuery(Object.keys(tokenTypes), value);
};

const bridgedTokensChainIds = (() => {
  const feature = config.features.bridgedTokens;
  if (!feature.isEnabled) {
    return [];
  }

  return feature.chains.map(chain => chain.id);
})();
export const getBridgedChainsFilterValue = (getFilterValuesFromQuery<string>).bind(null, bridgedTokensChainIds);
