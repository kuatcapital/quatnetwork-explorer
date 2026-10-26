// Modified by Quat Capital, 2026-10-26: locale-specific gas numbers without changing machine values. GPL-3.0.
import type { GasPriceInfo } from 'types/api/stats';
import type { GasUnit } from 'types/client/gasTracker';

import type { Locale } from 'configs/app/i18n';
import { formatNumber } from 'lib/format/localeNumbers';
import { currencyUnits } from 'lib/units';

export default function formatGasValue(data: GasPriceInfo, unit: GasUnit, locale: Locale = 'en', unavailable = 'N/A') {
  switch (unit) {
    case 'gwei': {
      if (data.price === null || !Number.isFinite(data.price)) {
        return `${ unavailable } ${ currencyUnits.gwei }`;
      }

      if (Number(data.price) < 0.1) {
        return `< ${ formatNumber(0.1, locale) } ${ currencyUnits.gwei }`;
      }

      return `${ formatNumber(data.price, locale, { maximumFractionDigits: 1 }) } ${ currencyUnits.gwei }`;
    }

    case 'usd': {
      if (!data.fiat_price) {
        return `$${ unavailable }`;
      }

      if (Number(data.fiat_price) < 0.01) {
        return `< $${ formatNumber(0.01, locale) }`;
      }

      return `$${ formatNumber(Number(data.fiat_price), locale, { maximumFractionDigits: 2 }) }`;
    }
  }
}
