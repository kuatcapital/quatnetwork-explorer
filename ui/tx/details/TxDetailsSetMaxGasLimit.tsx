// Modified by Quat Capital, 2026-10-25: runtime transaction interface localization. GPL-3.0.
import BigNumber from 'bignumber.js';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { Transaction } from 'types/api/transaction';

import config from 'configs/app';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import DetailedInfoNativeCoinValue from 'ui/shared/DetailedInfo/DetailedInfoNativeCoinValue';

import TxDetailsGasUsage from './TxDetailsGasUsage';

interface Props {
  data: Transaction;
}

const TxDetailsSetMaxGasLimit = ({ data }: Props) => {
  const { t: tTx } = useTranslation();
  if (!config.UI.views.tx.additionalFields?.set_max_gas_limit) {
    return null;
  }

  const maxGasLimit = BigNumber(data.gas_limit || 0).multipliedBy(BigNumber(data.gas_price || 0));

  return (
    <>
      <DetailedInfo.ItemLabel
        hint={ tTx('transactions.max_fee_hint') }
      >
        { tTx('transactions.max_gas_limit') }</DetailedInfo.ItemLabel>
      <DetailedInfoNativeCoinValue
        amount={ maxGasLimit.toString() }
        exchangeRate={ 'exchange_rate' in data ? data.exchange_rate : null }
        historicalExchangeRate={ 'historic_exchange_rate' in data ? data.historic_exchange_rate : null }
        hasExchangeRateToggle
        unitsTooltip="gwei"
        copyOriginalValue
      />
      <TxDetailsGasUsage data={ data }/>
    </>
  );
};

export default React.memo(TxDetailsSetMaxGasLimit);
