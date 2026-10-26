// Modified by Quat Capital, 2026-10-26: localize shared controls, details and data feedback. GPL-3.0.
import { Text, chakra } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { CoinType } from '@blockscout/zetachain-cctx-types';

import config from 'configs/app';
import { useLocale } from 'lib/i18n/provider';
import { Skeleton } from 'toolkit/chakra/skeleton';
import calculateUsdValue from 'ui/shared/value/calculateUsdValue';

type Props = {
  coinType: CoinType;
  tokenSymbol?: string;
  amount: string;
  decimals?: number | null;
  isLoading?: boolean;
  className?: string;
  accuracy?: number;
};

const ZetaChainCCTXValue = ({ coinType, tokenSymbol, amount, decimals, isLoading, className, accuracy = 8 }: Props) => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  let unit: string;
  let value: string | undefined;
  switch (coinType) {
    case CoinType.ERC20:
      unit = tokenSymbol || t('sharedEntities.unnamed_token');
      value = calculateUsdValue({ amount, decimals: decimals?.toString() || '18', accuracy, locale }).valueStr;
      break;
    case CoinType.ZETA:
      unit = config.chain.currency.symbol || config.chain.currency.name || '';
      value = calculateUsdValue({ amount, decimals: config.chain.currency.decimals?.toString() || '18', accuracy, locale }).valueStr;
      break;
    case CoinType.GAS:
      unit = tokenSymbol || t('sharedEntities.unnamed_token');
      value = calculateUsdValue({ amount, decimals: decimals?.toString() || '18', accuracy, locale }).valueStr;
      break;
    default:
      unit = '-';
      break;
  }

  return (
    <Skeleton loading={ isLoading } display="flex" gap={ 1 } overflow="hidden" className={ className }>
      <Text overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">{ value }</Text>
      <Text color="text.secondary" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">{ unit }</Text>
    </Skeleton>
  );
};

export default React.memo(chakra(ZetaChainCCTXValue));
