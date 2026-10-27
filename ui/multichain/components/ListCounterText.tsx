// Modified by Quat Capital, 2026-10-27: complete runtime multichain localization. GPL-3.0.
import { BigNumber } from 'bignumber.js';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { formatBigNumber } from 'lib/format/localeNumbers';
import useIsInitialLoading from 'lib/hooks/useIsInitialLoading';
import { useLocale } from 'lib/i18n/provider';
import { TruncatedText } from 'toolkit/components/truncation/TruncatedText';

interface Props {
  value: string | undefined;
  isLoading: boolean;
  type: 'transaction' | 'transfer';
}

const ListCounterText = ({ isLoading, value, type }: Props) => {
  const { t: tQuat } = useTranslation();
  const { locale } = useLocale();
  const isInitialLoading = useIsInitialLoading(isLoading);

  if (value === undefined || value === '0') {
    return null;
  }

  const valueNum = Number(value);
  const text = type === 'transaction' ?
    tQuat('multiUi.total_transactions', { count: valueNum, value: formatBigNumber(BigNumber(value), locale) }) :
    tQuat('multiUi.total_transfers', { count: valueNum, value: formatBigNumber(BigNumber(value), locale) });

  return (
    <TruncatedText
      text={ text }
      loading={ isInitialLoading }
      textStyle={{ base: 'md', lg: 'sm' }}
      color="text.secondary"
      ml={{ base: 0, lg: 4 }}
      mr={{ base: 0, lg: 8 }}
      mb={{ base: 4, lg: 0 }}
    />
  );
};

export default React.memo(ListCounterText);
