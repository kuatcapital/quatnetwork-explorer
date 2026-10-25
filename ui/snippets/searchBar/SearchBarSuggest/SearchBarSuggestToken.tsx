// Modified by Quat Capital, 2026-10-25: localize token quantities and labels without precision loss. GPL-3.0.
import { Grid, Text, Flex } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { mapValues } from 'es-toolkit';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { ItemsProps } from './types';
import type { SearchResultToken } from 'types/api/search';
import type * as multichain from 'types/client/multichainAggregator';

import { toBech32Address } from 'lib/address/bech32';
import { formatBigNumber } from 'lib/format/localeNumbers';
import highlightText from 'lib/highlightText';
import { useLocale } from 'lib/i18n/provider';
import * as contract from 'lib/multichain/contract';
import ContractCertifiedLabel from 'ui/shared/ContractCertifiedLabel';
import * as TokenEntity from 'ui/shared/entities/token/TokenEntity';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import IconSvg from 'ui/shared/IconSvg';

const SearchBarSuggestToken = ({ data, isMobile, searchTerm, addressFormat, chainInfo }: ItemsProps<SearchResultToken | multichain.QuickSearchResultToken>) => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const icon = <TokenEntity.Icon token={{ ...data, type: data.token_type }} chain={ chainInfo }/>;
  const verifiedIcon = <IconSvg name="certified" boxSize={ 4 } color="green.500" ml={ 1 } flexShrink={ 0 }/>;
  const certifiedIcon = <ContractCertifiedLabel iconSize={ 4 } boxSize={ 4 } ml={ 1 } flexShrink={ 0 }/>;
  const hash = (() => {
    if ('filecoin_robust_address' in data && data.filecoin_robust_address) {
      return data.filecoin_robust_address;
    }
    return addressFormat === 'bech32' ? toBech32Address(data.address_hash) : data.address_hash;
  })();

  const isVerified = (() => {
    if ('chain_infos' in data) {
      return contract.isVerified({ chain_infos: mapValues(data.chain_infos, (chainInfo) => ({ ...chainInfo, is_contract: true, coin_balance: '0' })) });
    }
    return data.is_smart_contract_verified;
  })();

  const name = (
    <Text
      fontWeight={ 700 }
      overflow="hidden"
      whiteSpace="nowrap"
      textOverflow="ellipsis"
    >
      <span dangerouslySetInnerHTML={{ __html: highlightText(data.name + (data.symbol ? ` (${ data.symbol })` : ''), searchTerm) }}/>
    </Text>
  );

  const address = (
    <Text color="text.secondary" whiteSpace="nowrap" overflow="hidden">
      <HashStringShortenDynamic hash={ hash } noTooltip/>
    </Text>
  );

  const contractVerifiedIcon = isVerified && <IconSvg name="status/success" boxSize="14px" color="green.500" ml={ 1 } flexShrink={ 0 }/>;
  const additionalInfo = (
    <Text overflow="hidden" whiteSpace="nowrap" fontWeight={ 700 }>
      { data.token_type === 'ERC-20' && 'exchange_rate' in data && data.exchange_rate && `$${ formatBigNumber(BigNumber(data.exchange_rate), locale) }` }
      { data.token_type !== 'ERC-20' && data.total_supply && t('search.items', { value: formatBigNumber(BigNumber(data.total_supply), locale) }) }
    </Text>
  );

  if (isMobile) {
    const templateCols = `1fr
    ${ (data.token_type === 'ERC-20' && 'exchange_rate' in data && data.exchange_rate) ||
      (data.token_type !== 'ERC-20' && 'total_supply' in data && data.total_supply) ? ' auto' : '' }`;

    return (
      <>
        <Flex alignItems="center">
          { icon }
          { name }
          { 'certified' in data && data.certified && certifiedIcon }
          { 'is_verified_via_admin_panel' in data && data.is_verified_via_admin_panel && !data.certified && verifiedIcon }
          { data.reputation && <TokenEntity.Reputation value={ data.reputation }/> }
        </Flex>
        <Grid templateColumns={ templateCols } alignItems="center" gap={ 2 }>
          <Flex alignItems="center" overflow="hidden">
            { address }
            { contractVerifiedIcon }
          </Flex>
          { additionalInfo }
        </Grid>
      </>
    );
  }

  return (
    <Grid templateColumns="228px 1fr auto" gap={ 2 }>
      <Flex alignItems="center">
        { icon }
        { name }
        { 'certified' in data && data.certified && certifiedIcon }
        { 'is_verified_via_admin_panel' in data && data.is_verified_via_admin_panel && !data.certified && verifiedIcon }
        { 'reputation' in data && data.reputation && <TokenEntity.Reputation value={ data.reputation }/> }
      </Flex>
      <Flex alignItems="center" overflow="hidden">
        { address }
        { contractVerifiedIcon }
      </Flex>
      { additionalInfo }
    </Grid>
  );
};

export default React.memo(SearchBarSuggestToken);
