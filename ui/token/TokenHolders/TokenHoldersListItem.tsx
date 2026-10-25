// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import BigNumber from 'bignumber.js';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { TokenHolder, TokenInfo } from 'types/api/token';

import { hasTokenIds, isConfidentialTokenType } from 'lib/token/tokenTypes';
import { TruncatedText } from 'toolkit/components/truncation/TruncatedText';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';
import Utilization from 'ui/shared/Utilization/Utilization';
import AssetValue from 'ui/shared/value/AssetValue';
import ConfidentialValue from 'ui/shared/value/ConfidentialValue';

interface Props {
  holder: TokenHolder;
  token: TokenInfo;
  isLoading?: boolean;
}

const TokenHoldersListItem = ({ holder, token, isLoading }: Props) => {
  const { t: tQuat } = useTranslation();

  return (
    <ListItemMobileGrid.Container>
      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('tokenUi.address') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <AddressEntity
          address={ holder.address }
          isLoading={ isLoading }
          fontWeight="700"
          maxW="100%"
        />
      </ListItemMobileGrid.Value>

      { (hasTokenIds(token.type)) && 'token_id' in holder && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('tokenUi.id_number') }</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <TruncatedText text={ holder.token_id } loading={ isLoading } w="100%"/>
          </ListItemMobileGrid.Value>
        </>
      ) }

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('tokenUi.quantity') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        { isConfidentialTokenType(token.type) ? (
          <ConfidentialValue loading={ isLoading }/>
        ) : (
          <AssetValue
            amount={ holder.value }
            decimals={ token.decimals ?? '0' }
            loading={ isLoading }
          />
        ) }
      </ListItemMobileGrid.Value>

      { token.total_supply && token.type !== 'ERC-404' && !isConfidentialTokenType(token.type) && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('tokenUi.percentage') }</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <Utilization
              value={ BigNumber(holder.value).div(BigNumber(token.total_supply)).dp(4).toNumber() }
              colorScheme="green"
              isLoading={ isLoading }
              display="inline-flex"
            />
          </ListItemMobileGrid.Value>
        </>
      ) }

    </ListItemMobileGrid.Container>
  );
};

export default TokenHoldersListItem;
