import { GridItem } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { UserOp } from 'types/api/userOps';

// Modified by Quat Capital, 2026-10-26: T18 reviewed literal localization. GPL-3.0.
// Modified by Quat Capital, 2026-10-26: T18 reviewed literal localization. GPL-3.0.

import config from 'configs/app';
import type { ResourceError } from 'lib/api/resources';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import { formatBigNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { CollapsibleDetails } from 'toolkit/chakra/collapsible';
import { Skeleton } from 'toolkit/chakra/skeleton';
import isCustomAppError from 'ui/shared/AppError/isCustomAppError';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import DetailedInfoNativeCoinValue from 'ui/shared/DetailedInfo/DetailedInfoNativeCoinValue';
import DetailedInfoTimestamp from 'ui/shared/DetailedInfo/DetailedInfoTimestamp';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import AddressStringOrParam from 'ui/shared/entities/address/AddressStringOrParam';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import UserOpEntity from 'ui/shared/entities/userOp/UserOpEntity';
import UserOpSponsorType from 'ui/shared/userOps/UserOpSponsorType';
import UserOpStatus from 'ui/shared/userOps/UserOpStatus';
import Utilization from 'ui/shared/Utilization/Utilization';
import GasPriceValue from 'ui/shared/value/GasPriceValue';

import UserOpCallData from './UserOpCallData';
import UserOpDecodedCallData from './UserOpDecodedCallData';
import UserOpDetailsActions from './UserOpDetailsActions';

interface Props {
  query: UseQueryResult<UserOp, ResourceError>;
}

const UserOpDetails = ({ query }: Props) => {
  const { t: tQuat } = useTranslation();
  const { locale } = useLocale();

  const { data, isPlaceholderData, isError, error } = query;

  if (isError) {
    if (error?.status === 400 || isCustomAppError(error)) {
      throwOnResourceLoadError({ isError, error });
    }

    return <DataFetchAlert/>;
  }

  if (!data) {
    return null;
  }

  return (
    <DetailedInfo.Container
      templateColumns={{ base: 'minmax(0, 1fr)', lg: 'minmax(min-content, 220px) minmax(0, 1fr)' }}
    >
      <DetailedInfo.ItemLabel
        hint={ tQuat('operationsUi.hash_hint') }
        isLoading={ isPlaceholderData }
      >{ tQuat('operationsUi.hash') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton loading={ isPlaceholderData } overflow="hidden">
          <UserOpEntity hash={ data.hash } noIcon noLink/>
        </Skeleton>
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint={ tQuat('operationsUi.sender_hint') }
        isLoading={ isPlaceholderData }
      >{ tQuat('transactions.sender') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <AddressStringOrParam address={ data.sender } isLoading={ isPlaceholderData }/>
      </DetailedInfo.ItemValue>

      { data.execute_target && (
        <>
          <DetailedInfo.ItemLabel
            hint={ tQuat('operationsUi.target_hint') }
            isLoading={ isPlaceholderData }
          >{ tQuat('transactions.target') }</DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <AddressEntity address={ data.execute_target } isLoading={ isPlaceholderData }/>
          </DetailedInfo.ItemValue>
        </>
      ) }

      <DetailedInfo.ItemLabel
        hint={ tQuat('operationsUi.state_hint') }
        isLoading={ isPlaceholderData }
      >{ tQuat('common.status') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <UserOpStatus status={ data.status } isLoading={ isPlaceholderData }/>
      </DetailedInfo.ItemValue>

      { data.revert_reason && (
        <>
          <DetailedInfo.ItemLabel
            hint={ tQuat('operationsUi.revert_hint') }
            isLoading={ isPlaceholderData }
          >{ tQuat('transactions.revert_reason') }</DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue
            wordBreak="break-all"
            whiteSpace="normal"
          >
            <Skeleton loading={ isPlaceholderData }>
              { data.revert_reason }
            </Skeleton>
          </DetailedInfo.ItemValue>
        </>
      ) }

      { data.timestamp && (
        <>
          <DetailedInfo.ItemLabel
            hint={ tQuat('operationsUi.time_hint') }
            isLoading={ isPlaceholderData }
          >{ tQuat('common.timestamp') }</DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <DetailedInfoTimestamp timestamp={ data.timestamp } isLoading={ isPlaceholderData }/>
          </DetailedInfo.ItemValue>
        </>

      ) }
      { !config.UI.views.tx.hiddenFields?.tx_fee && (
        <>
          <DetailedInfo.ItemLabel
            hint={ tQuat('operationsUi.fee_hint') }
            isLoading={ isPlaceholderData }
          >{ tQuat('common.fee') }</DetailedInfo.ItemLabel>
          <DetailedInfoNativeCoinValue
            amount={ data.fee }
            loading={ isPlaceholderData }
          />
        </>
      ) }

      <DetailedInfo.ItemLabel
        hint={ tQuat('operationsUi.gas_limit_hint') }
        isLoading={ isPlaceholderData }
      >{ tQuat('common.gas_limit') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton loading={ isPlaceholderData }>
          { formatBigNumber(BigNumber(data.gas), locale) }
        </Skeleton>
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint={ tQuat('operationsUi.gas_used_hint') }
        isLoading={ isPlaceholderData }
      >{ tQuat('common.gas_used') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton loading={ isPlaceholderData }>
          { formatBigNumber(BigNumber(data.gas_used), locale) }
        </Skeleton>
        <Utilization
          ml={ 4 }
          colorScheme="gray"
          value={ BigNumber(data.gas_used).dividedBy(BigNumber(data.gas)).toNumber() }
          isLoading={ isPlaceholderData }
        />
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint={ tQuat('operationsUi.tx_hint') }
        isLoading={ isPlaceholderData }
      >{ tQuat('common.transaction_hash') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <TxEntity hash={ data.transaction_hash } isLoading={ isPlaceholderData }/>
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint={ tQuat('operationsUi.block_hint') }
        isLoading={ isPlaceholderData }
      >{ tQuat('common.block') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <BlockEntity number={ Number(data.block_number) } isLoading={ isPlaceholderData }/>
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint={ tQuat('operationsUi.entry_hint') }
        isLoading={ isPlaceholderData }
      >{ tQuat('operationsUi.entry_point') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <AddressStringOrParam address={ data.entry_point } isLoading={ isPlaceholderData }/>
      </DetailedInfo.ItemValue>

      { config.features.txInterpretation.isEnabled && <UserOpDetailsActions hash={ data.hash } isUserOpDataLoading={ isPlaceholderData }/> }

      { /* ADDITIONAL INFO */ }
      <CollapsibleDetails loading={ isPlaceholderData } mt={ 6 } gridColumn={{ base: undefined, lg: '1 / 3' }}>
        <GridItem colSpan={{ base: undefined, lg: 2 }} mt={{ base: 1, lg: 4 }}/>

        <DetailedInfo.ItemLabel
          hint={ tQuat('operationsUi.call_gas_hint') }
        >{ tQuat('operationsUi.call_gas') }</DetailedInfo.ItemLabel>
        <DetailedInfo.ItemValue>
          { formatBigNumber(BigNumber(data.call_gas_limit), locale) }
        </DetailedInfo.ItemValue>

        <DetailedInfo.ItemLabel
          hint={ tQuat('operationsUi.verification_gas_hint') }
        >{ tQuat('operationsUi.verification_gas') }</DetailedInfo.ItemLabel>
        <DetailedInfo.ItemValue>
          { formatBigNumber(BigNumber(data.verification_gas_limit), locale) }
        </DetailedInfo.ItemValue>

        <DetailedInfo.ItemLabel
          hint={ tQuat('operationsUi.pre_gas_hint') }
        >{ tQuat('operationsUi.pre_gas') }</DetailedInfo.ItemLabel>
        <DetailedInfo.ItemValue>
          { formatBigNumber(BigNumber(data.pre_verification_gas), locale) }
        </DetailedInfo.ItemValue>

        { !config.UI.views.tx.hiddenFields?.gas_fees && (
          <>
            <DetailedInfo.ItemLabel
              hint={ tQuat('operationsUi.max_fee_hint') }
            >{ tQuat('operationsUi.max_fee') }</DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue multiRow>
              <GasPriceValue amount={ data.max_fee_per_gas }/>
            </DetailedInfo.ItemValue>

            <DetailedInfo.ItemLabel
              hint={ tQuat('operationsUi.priority_hint') }
            >{ tQuat('operationsUi.priority_fee') }</DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue multiRow>
              <GasPriceValue amount={ data.max_priority_fee_per_gas }/>
            </DetailedInfo.ItemValue>
          </>
        ) }

        <DetailedInfo.ItemDivider/>

        { data.aggregator && (
          <>
            <DetailedInfo.ItemLabel
              hint={ tQuat('operationsUi.aggregator_hint') }
            >{ tQuat('operationsUi.aggregator') }</DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue>
              <AddressStringOrParam address={ data.aggregator }/>
            </DetailedInfo.ItemValue>
          </>
        ) }

        { data.aggregator_signature && (
          <>
            <DetailedInfo.ItemLabel
              hint={ tQuat('operationsUi.aggregator_signature') }
            >{ tQuat('operationsUi.aggregator_signature') }</DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue>
              { data.aggregator_signature }
            </DetailedInfo.ItemValue>
          </>
        ) }

        <DetailedInfo.ItemLabel
          hint={ tQuat('operationsUi.bundler_hint') }
        >{ tQuat('operationsUi.bundler') }</DetailedInfo.ItemLabel>
        <DetailedInfo.ItemValue>
          <AddressStringOrParam address={ data.bundler }/>
        </DetailedInfo.ItemValue>

        { data.factory && (
          <>
            <DetailedInfo.ItemLabel
              hint={ tQuat('operationsUi.factory_hint') }
            >{ tQuat('operationsUi.factory') }</DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue>
              <AddressStringOrParam address={ data.factory }/>
            </DetailedInfo.ItemValue>
          </>
        ) }

        { data.paymaster && (
          <>
            <DetailedInfo.ItemLabel
              hint={ tQuat('operationsUi.paymaster_hint') }
            >{ tQuat('operationsUi.paymaster') }</DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue>
              <AddressStringOrParam address={ data.paymaster }/>
            </DetailedInfo.ItemValue>
          </>
        ) }

        <DetailedInfo.ItemLabel
          hint={ tQuat('operationsUi.sponsor_hint') }
        >{ tQuat('operationsUi.sponsor_type') }</DetailedInfo.ItemLabel>
        <DetailedInfo.ItemValue>
          <UserOpSponsorType sponsorType={ data.sponsor_type }/>
        </DetailedInfo.ItemValue>

        <DetailedInfo.ItemDivider/>

        <DetailedInfo.ItemLabel
          hint={ tQuat('operationsUi.signature_hint') }
        >{ tQuat('blockDetails.signature') }</DetailedInfo.ItemLabel>
        <DetailedInfo.ItemValue
          wordBreak="break-all"
          whiteSpace="normal"
        >
          { data.signature }
        </DetailedInfo.ItemValue>

        <DetailedInfo.ItemLabel
          hint={ tQuat('operationsUi.nonce_hint') }
        >{ tQuat('operationsUi.nonce') }</DetailedInfo.ItemLabel>
        <DetailedInfo.ItemValue
          wordBreak="break-all"
          whiteSpace="normal"
        >
          { data.nonce }
        </DetailedInfo.ItemValue>

        <UserOpCallData data={ data }/>

        <UserOpDecodedCallData data={ data }/>
      </CollapsibleDetails>
    </DetailedInfo.Container>
  );
};

export default UserOpDetails;
