// Modified by Quat Capital, 2026-10-25: runtime transaction interface localization. GPL-3.0.
import { Text } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { Transaction } from 'types/api/transaction';

import { layerLabels } from 'lib/rollups/utils';
import { Skeleton } from 'toolkit/chakra/skeleton';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import DetailedInfoNativeCoinValue from 'ui/shared/DetailedInfo/DetailedInfoNativeCoinValue';
import TextSeparator from 'ui/shared/TextSeparator';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';

type Props = {
  data: Transaction;
  isLoading: boolean;
};

export const TxInfoScrollFees = ({ data, isLoading }: Props) => {
  const { t: tTx } = useTranslation();
  return (
    <>
      { data.scroll?.l1_fee !== undefined && (
        <>
          <DetailedInfo.ItemLabel

            hint={ tTx('transactions.rollup_fee_hint', { layer: layerLabels.parent }) }
            isLoading={ isLoading }
          >
            { tTx('transactions.layer_data_fee', { layer: layerLabels.parent }) }</DetailedInfo.ItemLabel>
          <DetailedInfoNativeCoinValue
            amount={ data.scroll?.l1_fee }
            exchangeRate={ data.exchange_rate }
            historicalExchangeRate={ data.historic_exchange_rate }
            hasExchangeRateToggle
            loading={ isLoading }
          />
        </>
      ) }

      { data.scroll?.l2_fee !== undefined && (
        <>
          <DetailedInfo.ItemLabel
            hint={ tTx('transactions.execution_fee_hint', { layer: layerLabels.current }) }
            isLoading={ isLoading }
          >
            { tTx('transactions.execution_fee') }</DetailedInfo.ItemLabel>
          <DetailedInfoNativeCoinValue
            amount={ data.scroll?.l2_fee.value }
            exchangeRate={ data.exchange_rate }
            historicalExchangeRate={ data.historic_exchange_rate }
            hasExchangeRateToggle
            loading={ isLoading }
          />
        </>
      ) }

      { data.scroll?.l1_fee_commit_scalar !== undefined && (
        <>
          <DetailedInfo.ItemLabel
            hint={ tTx('transactions.commit_scalar_hint') }
            isLoading={ isLoading }
          >
            { tTx('transactions.layer_commit_scalar', { layer: layerLabels.parent }) }</DetailedInfo.ItemLabel>
          <DetailedInfoNativeCoinValue
            amount={ String(data.scroll?.l1_fee_commit_scalar) }
            exchangeRate={ data.exchange_rate }
            historicalExchangeRate={ data.historic_exchange_rate }
            hasExchangeRateToggle
            loading={ isLoading }
          />
        </>
      ) }

      { data.scroll?.l1_fee_overhead !== undefined && (
        <>
          <DetailedInfo.ItemLabel
            hint={ tTx('transactions.gas_overhead_hint') }
            isLoading={ isLoading }
          >
            { layerLabels.parent } { tTx('transactions.fee_overhead') }</DetailedInfo.ItemLabel>
          <DetailedInfoNativeCoinValue
            amount={ String(data.scroll?.l1_fee_overhead) }
            exchangeRate={ data.exchange_rate }
            historicalExchangeRate={ data.historic_exchange_rate }
            hasExchangeRateToggle
            loading={ isLoading }
          />
        </>
      ) }
      { (data.scroll?.l1_base_fee !== undefined || data.scroll?.l1_fee_scalar !== undefined) && (
        <>
          <DetailedInfo.ItemLabel
            hint={ tTx('transactions.layer_gas_fees', { layer: layerLabels.parent }) }
            isLoading={ isLoading }
          >
            { tTx('transactions.layer_gas_fees', { layer: layerLabels.parent }) }
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            { data.scroll?.l1_base_fee !== undefined && (
              <Skeleton loading={ isLoading }>
                <Text as="span" fontWeight="500">{ tTx('transactions.base_label') }{ ' ' }</Text>
                <NativeCoinValue
                  amount={ String(data.scroll?.l1_base_fee || 0) }
                  units="gwei"
                  unitsTooltip="wei"
                  noSymbol
                  fontWeight="600"
                />
              </Skeleton>
            ) }
            { data.scroll?.l1_fee_scalar !== undefined && (
              <Skeleton loading={ isLoading }>
                <TextSeparator/>
                <Text as="span" fontWeight="500">{ tTx('transactions.scalar_label') }{ ' ' }</Text>
                <NativeCoinValue
                  amount={ String(data.scroll?.l1_fee_scalar || 0) }
                  units="gwei"
                  unitsTooltip="wei"
                  noSymbol
                  fontWeight="600"
                />
              </Skeleton>
            ) }
          </DetailedInfo.ItemValue>
        </>
      ) }
      { (data.scroll?.l1_blob_base_fee !== undefined || data.scroll?.l1_fee_blob_scalar !== undefined) && (
        <>
          <DetailedInfo.ItemLabel
            hint={ tTx('transactions.layer_blob_fees', { layer: layerLabels.parent }) }
            isLoading={ isLoading }
          >
            { tTx('transactions.layer_blob_fees', { layer: layerLabels.parent }) }
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            { data.scroll?.l1_blob_base_fee !== undefined && (
              <Skeleton loading={ isLoading }>
                <Text as="span" fontWeight="500">{ tTx('transactions.base_label') }{ ' ' }</Text>
                <NativeCoinValue
                  amount={ String(data.scroll?.l1_blob_base_fee || 0) }
                  units="gwei"
                  unitsTooltip="wei"
                  noSymbol
                  fontWeight="600"
                />
              </Skeleton>
            ) }
            { data.scroll?.l1_fee_blob_scalar !== undefined && (
              <Skeleton loading={ isLoading }>
                <TextSeparator/>
                <Text as="span" fontWeight="500">{ tTx('transactions.scalar_label') }{ ' ' }</Text>
                <NativeCoinValue
                  amount={ String(data.scroll?.l1_fee_blob_scalar || 0) }
                  units="gwei"
                  unitsTooltip="wei"
                  noSymbol
                  fontWeight="600"
                />
              </Skeleton>
            ) }
          </DetailedInfo.ItemValue>
        </>
      ) }
    </>
  );
};

export default TxInfoScrollFees;
