// Modified by Quat Capital, 2026-10-25: runtime transaction interface localization. GPL-3.0.
import { Flex, Grid } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { Transaction } from 'types/api/transaction';
import type { ExcludeUndefined } from 'types/utils';

import { formatBigNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { Badge } from 'toolkit/chakra/badge';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import DetailedInfoNativeCoinValue from 'ui/shared/DetailedInfo/DetailedInfoNativeCoinValue';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import LogDecodedInputData from 'ui/shared/logs/LogDecodedInputData';
import RawInputData from 'ui/shared/RawInputData';
import TxFee from 'ui/shared/tx/TxFee';
import TxDetailsGasPrice from 'ui/tx/details/TxDetailsGasPrice';
import TxDetailsOther from 'ui/tx/details/TxDetailsOther';

interface Props {
  data: ExcludeUndefined<Transaction['wrapped']>;
}

const TxDetailsWrapped = ({ data }: Props) => {
  const { locale } = useLocale();
  const { t: tTx } = useTranslation();
  return (
    <Grid columnGap={ 8 } rowGap={{ base: 3, lg: 3 }} templateColumns={{ base: 'minmax(0, 1fr)', lg: 'auto minmax(0, 1fr)' }}>
      <DetailedInfo.ItemLabel
        hint={ tTx('transactions.hash_hint') }
      >
        { tTx('common.transaction_hash') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <TxEntity hash={ data.hash } noIcon noLink/>
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint={ tTx('transactions.method_hint') }
      >
        { tTx('common.method') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Badge colorPalette="gray">
          { data.method }
        </Badge>
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemDivider/>

      { data.to && (
        <>
          <DetailedInfo.ItemLabel
            hint={ tTx('transactions.receiver_hint') }
          >
            { data.to.is_contract ? tTx('transactions.interacted_contract') : tTx('common.to') }
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <Flex flexWrap="nowrap" alignItems="center" maxW="100%">
              <AddressEntity address={ data.to }/>
            </Flex>
          </DetailedInfo.ItemValue>
        </>
      ) }

      <DetailedInfo.ItemDivider/>

      <DetailedInfo.ItemLabel
        hint={ tTx('transactions.value_hint') }
      >
        { tTx('transactions.value_amount') }</DetailedInfo.ItemLabel>
      <DetailedInfoNativeCoinValue amount={ data.value }/>

      { data.fee.value !== null && (
        <>
          <DetailedInfo.ItemLabel
            hint={ tTx('transactions.total_fee_hint') }
          >
            { tTx('common.transaction_fee') }</DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <TxFee tx={ data } hasExchangeRateToggle/>
          </DetailedInfo.ItemValue>
        </>
      ) }

      <TxDetailsGasPrice gasPrice={ data.gas_price }/>

      { data.gas_limit && (
        <>
          <DetailedInfo.ItemLabel
            hint={ tTx('transactions.gas_limit_hint') }
          >
            { tTx('common.gas_limit') }</DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            { formatBigNumber(BigNumber(data.gas_limit), locale) }
          </DetailedInfo.ItemValue>
        </>
      ) }

      <DetailedInfo.ItemDivider/>

      <TxDetailsOther type={ data.type } nonce={ data.nonce } position={ null }/>

      <DetailedInfo.ItemLabel
        hint={ tTx('transactions.input_hint') }
      >
        { tTx('transactions.raw_input') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <RawInputData hex={ data.raw_input }/>
      </DetailedInfo.ItemValue>

      { data.decoded_input && (
        <>
          <DetailedInfo.ItemLabel
            hint={ tTx('transactions.decoded_input') }
          >
            { tTx('transactions.decoded_input') }</DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <LogDecodedInputData data={ data.decoded_input }/>
          </DetailedInfo.ItemValue>
        </>
      ) }
    </Grid>
  );
};

export default TxDetailsWrapped;
