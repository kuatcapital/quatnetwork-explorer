// Modified by Quat Capital, 2026-10-25: runtime transaction interface localization. GPL-3.0.
import BigNumber from 'bignumber.js';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { Transaction } from 'types/api/transaction';

import config from 'configs/app';
import { currencyUnits } from 'lib/units';
import { ZERO } from 'toolkit/utils/consts';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import DetailedInfoNativeCoinValue from 'ui/shared/DetailedInfo/DetailedInfoNativeCoinValue';
import IconSvg from 'ui/shared/IconSvg';

const rollupFeature = config.features.rollup;

interface Props {
  data: Transaction;
  isLoading?: boolean;
}

const TxDetailsBurntFees = ({ data, isLoading }: Props) => {
  const { t: tTx } = useTranslation();

  if (config.UI.views.tx.hiddenFields?.burnt_fees || (rollupFeature.isEnabled && rollupFeature.type === 'optimistic')) {
    return null;
  }

  const value = BigNumber(data.transaction_burnt_fee || 0).plus(BigNumber(data.blob_gas_used || 0).multipliedBy(BigNumber(data.blob_gas_price || 0)));

  if (value.isEqualTo(ZERO)) {
    return null;
  }

  return (
    <>
      <DetailedInfo.ItemLabel
        hint={ tTx('transactions.burnt_fee_hint', {
          currency: currencyUnits.ether,
          blobPart: data.blob_gas_price && data.blob_gas_used ? tTx('transactions.burnt_blob_part') : '',
        }) }
        isLoading={ isLoading }
      >
        { tTx('blocks.burnt_fees') }</DetailedInfo.ItemLabel>
      <DetailedInfoNativeCoinValue
        amount={ value.toString() }
        exchangeRate={ data.exchange_rate }
        historicalExchangeRate={ data.historic_exchange_rate }
        hasExchangeRateToggle
        startElement={ <IconSvg name="flame" boxSize={ 5 } color="icon.primary" isLoading={ isLoading } mr={{ base: 0, lg: 1 }}/> }
        loading={ isLoading }
      />
    </>
  );
};

export default React.memo(TxDetailsBurntFees);
