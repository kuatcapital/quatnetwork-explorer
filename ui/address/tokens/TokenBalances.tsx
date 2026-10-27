// Modified by Quat Capital, 2026-10-27: localize balance labels, token plurals and exact monetary values. GPL-3.0.
import { Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'react-i18next';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { useLocale } from 'lib/i18n/provider';
import { currencyUnits } from 'lib/units';
import { ZERO } from 'toolkit/utils/consts';
import { thinsp } from 'toolkit/utils/htmlEntities';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import IconSvg from 'ui/shared/IconSvg';
import NativeTokenIcon from 'ui/shared/NativeTokenIcon';
import calculateUsdValue from 'ui/shared/value/calculateUsdValue';

import { formatAddressUsd, getAddressCountOptions } from '../localization';
import { getTokensTotalInfo } from '../utils/tokenUtils';
import useFetchTokens from '../utils/useFetchTokens';
import TokenBalancesItem from './TokenBalancesItem';

const TokenBalances = () => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const router = useRouter();

  const hash = router.query.hash?.toString();

  const addressQuery = useApiQuery('general:address', {
    pathParams: { hash },
    queryOptions: { enabled: Boolean(hash), refetchOnMount: false },
  });

  const tokenQuery = useFetchTokens({ hash });

  if (addressQuery.isError || tokenQuery.isError) {
    return <DataFetchAlert/>;
  }

  const addressData = addressQuery.data;
  const { valueStr: nativeValue, usdBn: nativeUsd } = calculateUsdValue({
    amount: addressData?.coin_balance || '0',
    exchangeRate: addressData?.exchange_rate,
    decimals: String(config.chain.currency.decimals),
    locale,
  });

  const tokensInfo = getTokensTotalInfo(tokenQuery.data);
  const prefix = tokensInfo.isOverflow ? `>${ thinsp }` : '';
  const totalUsd = nativeUsd.plus(tokensInfo.usd);
  const tokensNumText = tokensInfo.num > 0 ?
    prefix + t('addressTxUi.token_total', getAddressCountOptions(tokensInfo.num, locale)) :
    '0';

  return (
    <Flex columnGap={ 3 } rowGap={ 3 } mt={{ base: '6px', lg: 0 }} flexDirection={{ base: 'column', lg: 'row' }}>
      <TokenBalancesItem
        name={ t('addressTxUi.net_worth') }
        value={ addressData?.exchange_rate ? `${ prefix }$${ formatAddressUsd(totalUsd, locale) }` : t('home.not_available') }
        isLoading={ addressQuery.isPending || tokenQuery.isPending }
        icon={ <IconSvg name="wallet" boxSize="20px" flexShrink={ 0 } color="icon.primary"/> }
      />
      <TokenBalancesItem
        name={ t('addressTxUi.native_balance', { currency: currencyUnits.ether }) }
        value={ `${ nativeValue } ${ currencyUnits.ether }` }
        valueSecondary={ !nativeUsd.eq(ZERO) ? `$${ formatAddressUsd(nativeUsd, locale) }` : '' }
        isLoading={ addressQuery.isPending || tokenQuery.isPending }
        icon={ <NativeTokenIcon boxSize="20px"/> }
      />
      <TokenBalancesItem
        name={ t('common.tokens') }
        value={ tokensNumText }
        valueSecondary={ `${ prefix }$${ formatAddressUsd(tokensInfo.usd, locale) }` }
        isLoading={ addressQuery.isPending || tokenQuery.isPending }
        icon={ <IconSvg name="tokens" boxSize="20px" flexShrink={ 0 } color="icon.primary"/> }
      />
    </Flex>
  );
};

export default TokenBalances;
