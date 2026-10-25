// Modified by Quat Capital, 2026-10-25: runtime transaction interface localization. GPL-3.0.
import BigNumber from 'bignumber.js';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { Transaction } from 'types/api/transaction';

import { formatBigNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { Skeleton } from 'toolkit/chakra/skeleton';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import TextSeparator from 'ui/shared/TextSeparator';
import Utilization from 'ui/shared/Utilization/Utilization';

interface Props {
  isLoading?: boolean;
  data: Transaction;
}

const TxDetailsGasUsage = ({ isLoading, data }: Props) => {
  const { locale } = useLocale();
  const { t: tTx } = useTranslation();
  return (
    <>
      <DetailedInfo.ItemLabel
        hint={ tTx('transactions.gas_used_hint') }
        isLoading={ isLoading }
      >
        { tTx('transactions.gas_usage_limit') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton loading={ isLoading }>{ formatBigNumber(BigNumber(data.gas_used || 0), locale) }</Skeleton>
        <TextSeparator/>
        <Skeleton loading={ isLoading }>{ formatBigNumber(BigNumber(data.gas_limit), locale) }</Skeleton>
        <Utilization ml={ 4 } value={ BigNumber(data.gas_used || 0).dividedBy(BigNumber(data.gas_limit)).toNumber() } isLoading={ isLoading }/>
      </DetailedInfo.ItemValue>
    </>
  );
};

export default React.memo(TxDetailsGasUsage);
