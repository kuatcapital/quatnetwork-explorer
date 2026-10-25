// Modified by Quat Capital, 2026-10-25: runtime transaction interface localization. GPL-3.0.
import BigNumber from 'bignumber.js';
import React from 'react';
import { useTranslation } from 'react-i18next';

import config from 'configs/app';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import DetailedInfoNativeCoinValue from 'ui/shared/DetailedInfo/DetailedInfoNativeCoinValue';

interface Props {
  txFee: string | null;
  gasUsed: string | null;
  isLoading?: boolean;
}

const TxDetailsFeePerGas = ({ txFee, gasUsed, isLoading }: Props) => {
  const { t: tTx } = useTranslation();
  if (!config.UI.views.tx.additionalFields?.fee_per_gas || !gasUsed || txFee === null) {
    return null;
  }

  return (
    <>
      <DetailedInfo.ItemLabel
        hint={ tTx('transactions.fee_per_gas') }
        isLoading={ isLoading }
      >
        { tTx('transactions.fee_per_gas') }</DetailedInfo.ItemLabel>
      <DetailedInfoNativeCoinValue
        amount={ BigNumber(txFee).dividedBy(gasUsed).toFixed() }
        noSymbol={ config.UI.views.tx.hiddenFields?.fee_currency }
        loading={ isLoading }
      />
    </>
  );
};

export default TxDetailsFeePerGas;
