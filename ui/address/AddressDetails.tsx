// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import { Box, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'react-i18next';

import config from 'configs/app';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import getQueryParamString from 'lib/router/getQueryParamString';
import AddressCounterItem from 'ui/address/details/AddressCounterItem';
import ServiceDegradationWarning from 'ui/shared/alerts/ServiceDegradationWarning';
import isCustomAppError from 'ui/shared/AppError/isCustomAppError';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import DetailedInfoSponsoredItem from 'ui/shared/DetailedInfo/DetailedInfoSponsoredItem';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import ContractCreationStatus from 'ui/shared/statusTag/ContractCreationStatus';

import Address3rdPartyWidgets from './Address3rdPartyWidgets';
import useAddress3rdPartyWidgets from './address3rdPartyWidgets/useAddress3rdPartyWidgets';
import AddressAlternativeFormat from './details/AddressAlternativeFormat';
import AddressBalance from './details/AddressBalance';
import AddressCeloAccount from './details/AddressCeloAccount';
import AddressImplementations from './details/AddressImplementations';
import AddressNameInfo from './details/AddressNameInfo';
import AddressNetWorth from './details/AddressNetWorth';
import FilecoinActorTag from './filecoin/FilecoinActorTag';
import TokenSelect from './tokenSelect/TokenSelect';
import { useAddressValidationLabels } from './useAddressValidationLabels';
import type { AddressCountersQuery } from './utils/useAddressCountersQuery';
import type { AddressQuery } from './utils/useAddressQuery';

interface Props {
  addressQuery: AddressQuery;
  countersQuery: AddressCountersQuery;
  isLoading?: boolean;
}

const AddressDetails = ({ addressQuery, countersQuery, isLoading }: Props) => {
  const { t: tQuat } = useTranslation();

  const router = useRouter();
  const { blocksTitle, blocksHint } = useAddressValidationLabels();

  const addressHash = getQueryParamString(router.query.hash);

  const addressType = addressQuery.data?.is_contract && addressQuery.data?.proxy_type !== 'eip7702' ? 'contract' : 'eoa';
  const address3rdPartyWidgets = useAddress3rdPartyWidgets(addressType, addressQuery.isPlaceholderData);

  const error404Data = React.useMemo(() => ({
    hash: addressHash || '',
    is_contract: false,
    implementations: null,
    token: null,
    watchlist_address_id: null,
    watchlist_names: null,
    creation_transaction_hash: null,
    block_number_balance_updated_at: null,
    name: null,
    exchange_rate: null,
    coin_balance: null,
    has_tokens: true,
    has_token_transfers: true,
    has_validated_blocks: false,
    filecoin: undefined,
    celo: undefined,
    creator_filecoin_robust_address: null,
    creator_address_hash: null,
  }), [ addressHash ]);

  // error handling (except 404 codes)
  if (addressQuery.isError) {
    if (isCustomAppError(addressQuery.error)) {
      const is404Error = addressQuery.isError && 'status' in addressQuery.error && addressQuery.error.status === 404;
      if (!is404Error) {
        throwOnResourceLoadError(addressQuery);
      }
    } else {
      return <DataFetchAlert/>;
    }
  }

  const data = addressQuery.isError ? error404Data : addressQuery.data;

  if (!data) {
    return null;
  }

  const creatorAddressHash = data.creator_address_hash;

  return (
    <>
      { addressQuery.isDegradedData && <ServiceDegradationWarning isLoading={ isLoading } mb={ 6 }/> }
      <DetailedInfo.Container>

        { data.celo?.account && (
          <AddressCeloAccount data={ data.celo.account } isLoading={ isLoading }/>
        ) }

        <AddressAlternativeFormat isLoading={ isLoading } addressHash={ addressHash }/>

        { data.filecoin?.id && (
          <>
            <DetailedInfo.ItemLabel
              hint={ tQuat('addresses.hints.short_id') }
            >
              ID
            </DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue>
              <Text>{ data.filecoin.id }</Text>
              <CopyToClipboard text={ data.filecoin.id }/>
            </DetailedInfo.ItemValue>
          </>
        ) }

        { data.filecoin?.actor_type && (
          <>
            <DetailedInfo.ItemLabel
              hint={ tQuat('addresses.hints.actor') }
            >{ tQuat('addresses.actor') }</DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue>
              <FilecoinActorTag actorType={ data.filecoin.actor_type }/>
            </DetailedInfo.ItemValue>
          </>
        ) }

        { (data.filecoin?.actor_type === 'evm' || data.filecoin?.actor_type === 'ethaccount') && data?.filecoin?.robust && (
          <>
            <DetailedInfo.ItemLabel
              hint={ tQuat('addresses.hints.ethereum_address') }
            >{ tQuat('addresses.ethereum_address') }</DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue flexWrap="nowrap">
              <AddressEntity
                address={{ hash: data.hash }}
                noIcon
                noLink
              />
            </DetailedInfo.ItemValue>
          </>
        ) }

        <AddressNameInfo data={ data } isLoading={ isLoading }/>

        { data.is_contract && data.creation_transaction_hash && (creatorAddressHash) && (
          <>
            <DetailedInfo.ItemLabel
              hint={ tQuat('addresses.hints.creator') }
              isLoading={ isLoading }
            >{ tQuat('addresses.creator') }</DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue>
              <AddressEntity
                address={{ hash: creatorAddressHash, filecoin: { robust: data.creator_filecoin_robust_address } }}
                truncation="constant"
                noIcon
              />
              <Text whiteSpace="pre">{ tQuat('addresses.at_transaction') }</Text>
              <TxEntity hash={ data.creation_transaction_hash } truncation="constant" noIcon/>
              { data.creation_status && <ContractCreationStatus status={ data.creation_status } ml={{ base: 0, lg: 2 }}/> }
            </DetailedInfo.ItemValue>
          </>
        ) }
        { !isLoading && data.is_contract && data.implementations && data.implementations?.length > 0 && (
          <AddressImplementations
            data={ data.implementations }
            isLoading={ isLoading }
            proxyType={ data.proxy_type }
          />
        ) }

        <AddressBalance data={ data } isLoading={ isLoading }/>

        { data.has_tokens && (
          <>
            <DetailedInfo.ItemLabel
              hint={ tQuat('addresses.hints.tokens') }
            >{ tQuat('common.tokens') }</DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue py={ addressQuery.data ? 0 : undefined }>
              { addressQuery.data ? <TokenSelect/> : <Box>0</Box> }
            </DetailedInfo.ItemValue>
          </>
        ) }
        { (config.features.multichainButton.isEnabled || (data.exchange_rate && data.has_tokens)) && (
          <>
            <DetailedInfo.ItemLabel
              hint={ tQuat('addresses.hints.net_worth') }
              isLoading={ isLoading }
            >{ tQuat('addresses.net_worth') }</DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue multiRow>
              <AddressNetWorth addressData={ addressQuery.data } addressHash={ addressHash } isLoading={ isLoading }/>
            </DetailedInfo.ItemValue>
          </>
        )
        }

        <DetailedInfo.ItemLabel
          hint={ tQuat('addresses.hints.transaction_count') }
          isLoading={ isLoading || countersQuery.isPlaceholderData }
        >{ tQuat('common.transactions') }</DetailedInfo.ItemLabel>
        <DetailedInfo.ItemValue>
          { addressQuery.data ? (
            <AddressCounterItem
              prop="transactions_count"
              query={ countersQuery }
              address={ data.hash }
              isAddressQueryLoading={ addressQuery.isPlaceholderData }
              isDegradedData={ addressQuery.isDegradedData }
            />
          ) :
            0 }
        </DetailedInfo.ItemValue>

        { data.has_token_transfers && (
          <>
            <DetailedInfo.ItemLabel
              hint={ tQuat('addresses.hints.transfer_count') }
              isLoading={ isLoading || countersQuery.isPlaceholderData }
            >{ tQuat('common.transfers') }</DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue>
              { addressQuery.data ? (
                <AddressCounterItem
                  prop="token_transfers_count"
                  query={ countersQuery }
                  address={ data.hash }
                  isAddressQueryLoading={ addressQuery.isPlaceholderData }
                  isDegradedData={ addressQuery.isDegradedData }
                />
              ) :
                0 }
            </DetailedInfo.ItemValue>
          </>
        ) }

        { countersQuery.data?.gas_usage_count && (
          <>
            <DetailedInfo.ItemLabel
              hint={ tQuat('addresses.hints.gas_usage') }
              isLoading={ isLoading || countersQuery.isPlaceholderData }
            >{ tQuat('common.gas_used') }</DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue multiRow>
              { addressQuery.data ? (
                <AddressCounterItem
                  prop="gas_usage_count"
                  query={ countersQuery }
                  address={ data.hash }
                  isAddressQueryLoading={ addressQuery.isPlaceholderData }
                  isDegradedData={ addressQuery.isDegradedData }
                />
              ) :
                0 }
            </DetailedInfo.ItemValue>
          </>
        ) }

        { data.has_validated_blocks && (
          <>
            <DetailedInfo.ItemLabel
              hint={ blocksHint }
              isLoading={ isLoading || countersQuery.isPlaceholderData }
            >
              { blocksTitle }
            </DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue>
              { addressQuery.data ? (
                <AddressCounterItem
                  prop="validations_count"
                  query={ countersQuery }
                  address={ data.hash }
                  isAddressQueryLoading={ addressQuery.isPlaceholderData }
                  isDegradedData={ addressQuery.isDegradedData }
                />
              ) :
                0 }
            </DetailedInfo.ItemValue>
          </>
        ) }

        { data.block_number_balance_updated_at && (
          <>
            <DetailedInfo.ItemLabel
              hint={ tQuat('addresses.hints.last_balance_update') }
              isLoading={ isLoading }
            >{ tQuat('addresses.last_balance_update') }</DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue>
              <BlockEntity
                number={ data.block_number_balance_updated_at }
                isLoading={ isLoading }
              />
            </DetailedInfo.ItemValue>
          </>
        ) }

        <DetailedInfoSponsoredItem isLoading={ isLoading }/>

        { (address3rdPartyWidgets.isEnabled && address3rdPartyWidgets.items.length > 0) && (
          <>
            <DetailedInfo.ItemLabel
              hint={ tQuat('addresses.hints.widgets') }
              isLoading={ address3rdPartyWidgets.configQuery.isPlaceholderData || addressQuery.isPlaceholderData }
            >{ tQuat('addresses.widgets') }</DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue>
              <Address3rdPartyWidgets
                addressType={ addressType }
                isLoading={ addressQuery.isPlaceholderData }
              />
            </DetailedInfo.ItemValue>
          </>
        ) }
      </DetailedInfo.Container>
    </>
  );
};

export default React.memo(AddressDetails);
