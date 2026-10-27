// Modified by Quat Capital, 2026-10-27: localize balance series and insufficient-data counts. GPL-3.0.
import BigNumber from 'bignumber.js';
import React from 'react';
import { useTranslation } from 'react-i18next';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { useLocale } from 'lib/i18n/provider';
import { currencyUnits } from 'lib/units';
import { ChartWidget } from 'toolkit/components/charts/ChartWidget';
import { useChartsConfig } from 'ui/shared/chart/config';

import { getAddressCountOptions } from '../localization';

interface Props {
  addressHash: string;
}

const AddressCoinBalanceChart = ({ addressHash }: Props) => {
  const { t: tQuat } = useTranslation();
  const { locale } = useLocale();

  const { data, isPending, isError } = useApiQuery('general:address_coin_balance_chart', {
    pathParams: { hash: addressHash },
  });
  const chartsConfig = useChartsConfig();

  const charts = React.useMemo(() => {
    if (!data) {
      return [];
    }

    return [
      {
        id: 'balance',
        name: tQuat('addresses.field_value'),
        items: data.items.map(({ date, value }) => ({
          date: new Date(date),
          value: BigNumber(value).div(10 ** config.chain.currency.decimals).toNumber(),
        })),
        charts: chartsConfig,
        units: currencyUnits.ether,
      },
    ];
  }, [ chartsConfig, data, tQuat ]);

  return (
    <ChartWidget
      isError={ isError }
      title={ tQuat('addresses.balances') }
      charts={ charts }
      isLoading={ isPending }
      h="300px"
      emptyText={ data?.days ? tQuat('addressTxUi.insufficient_days', getAddressCountOptions(data.days, locale)) : undefined }
    />
  );
};

export default React.memo(AddressCoinBalanceChart);
