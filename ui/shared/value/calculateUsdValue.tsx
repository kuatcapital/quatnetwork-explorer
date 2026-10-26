// Modified by Quat Capital, 2026-10-26: optional explicit display locale, preserving raw BigNumber values. GPL-3.0.
import BigNumber from 'bignumber.js';

import type { Locale } from 'configs/app/i18n';
import { getNumberSeparators } from 'lib/format/localeNumbers';
import { ZERO } from 'toolkit/utils/consts';

import { DEFAULT_ACCURACY, DEFAULT_ACCURACY_USD } from './utils';

export interface Params {
  amount: string;
  decimals?: string | number | null;
  exchangeRate?: string | null;
  accuracy?: number;
  accuracyUsd?: number;
  locale?: Locale;
}

export default function calculateUsdValue({
  amount, accuracy = DEFAULT_ACCURACY, accuracyUsd = DEFAULT_ACCURACY_USD, decimals, exchangeRate, locale = 'en',
}: Params) {
  const separators = getNumberSeparators(locale);
  const format = { groupSize: 3, groupSeparator: separators.group, decimalSeparator: separators.decimal };
  const valueBn = BigNumber(amount).div(BigNumber(10 ** Number(decimals || '0')));

  const valueStr = (() => {
    if (!accuracy) {
      return valueBn.toFormat(format);
    }
    const formattedValue = valueBn.dp(accuracy).toFormat(format);
    return formattedValue === '0' && !valueBn.isEqualTo(ZERO) ? `< 0${ separators.decimal }${ '0'.repeat(accuracy - 1) }1` : formattedValue;
  })();

  const usdBn = (() => {
    if (!exchangeRate) {
      return ZERO;
    }
    const exchangeRateBn = new BigNumber(exchangeRate);
    return valueBn.times(exchangeRateBn);
  })();

  const usdStr = (() => {
    if (!exchangeRate) {
      return undefined;
    }

    if (accuracyUsd && !usdBn.isEqualTo(0)) {
      const usdBnDp = usdBn.dp(accuracyUsd);
      return usdBnDp.isEqualTo(0) ? usdBn.precision(accuracyUsd).toFormat(format) : usdBnDp.toFormat(format);
    }
    return usdBn.toFormat(format);
  })();

  return {
    valueBn,
    valueStr,
    usdBn,
    usdStr,
  };
}
