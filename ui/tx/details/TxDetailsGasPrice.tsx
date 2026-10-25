// Modified by Quat Capital, 2026-10-25: runtime transaction interface localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { TokenInfo } from 'types/api/token';

import config from 'configs/app';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import GasPriceValue from 'ui/shared/value/GasPriceValue';
import TokenValue from 'ui/shared/value/TokenValue';

interface Props {
  gasToken?: TokenInfo | null;
  gasPrice: string | null;
  isLoading?: boolean;
}

const TxDetailsGasPrice = ({ gasPrice, gasToken, isLoading }: Props) => {
  const { t: tTx } = useTranslation();
  if (config.UI.views.tx.hiddenFields?.gas_price || !gasPrice) {
    return null;
  }

  const content = (() => {
    if (gasToken) {
      return (
        <TokenValue
          amount={ gasPrice }
          token={ gasToken }
          loading={ isLoading }
          accuracy={ 0 }
        />
      );
    }

    return (
      <GasPriceValue
        amount={ gasPrice }
        loading={ isLoading }
      />
    );
  })();

  return (
    <>
      <DetailedInfo.ItemLabel
        hint={ tTx('transactions.gas_price_hint') }
        isLoading={ isLoading }
      >
        { tTx('common.gas_price') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue multiRow>
        { content }
      </DetailedInfo.ItemValue>
    </>
  );
};

export default TxDetailsGasPrice;
