// Modified by Quat Capital, 2026-10-26: pass the selected locale to gas value displays. GPL-3.0.
import { chakra } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { GasPriceInfo } from 'types/api/stats';
import type { GasUnit } from 'types/client/gasTracker';

import config from 'configs/app';
import { useMultichainContext } from 'lib/contexts/multichain';
import { useLocale } from 'lib/i18n/provider';

import formatGasValue from './formatGasValue';

function hasValue(value: number | string | null | undefined): boolean {
  return value !== null && value !== undefined && value !== '';
}

const UNITS_TO_API_FIELD_MAP: Record<GasUnit, 'price' | 'fiat_price'> = {
  gwei: 'price',
  usd: 'fiat_price',
};

interface Props {
  data: GasPriceInfo | null;
  className?: string;
  unitMode?: 'primary' | 'secondary';
  prefix?: string;
}

const GasPrice = ({ data, prefix, className, unitMode = 'primary' }: Props) => {
  const { locale } = useLocale();
  const { t } = useTranslation();
  const multichainContext = useMultichainContext();
  const feature = multichainContext?.chain?.app_config.features.gasTracker || config.features.gasTracker;

  if (!data || !feature.isEnabled) {
    return null;
  }

  switch (unitMode) {
    case 'secondary': {
      const primaryUnits = feature.units[0];
      const secondaryUnits = feature.units[1];

      if (!secondaryUnits) {
        return null;
      }

      const primaryUnitsValue = data[UNITS_TO_API_FIELD_MAP[primaryUnits]];
      if (!hasValue(primaryUnitsValue)) {
        // in this case we display values in secondary units in primary mode as fallback
        return null;
      }

      const secondaryUnitsValue = data[UNITS_TO_API_FIELD_MAP[secondaryUnits]];
      if (!hasValue(secondaryUnitsValue)) {
        return null;
      }

      const formattedValue = formatGasValue(data, secondaryUnits, locale, t('editorShared.not_available'));
      return <span className={ className }>{ prefix }{ formattedValue }</span>;
    }
    case 'primary': {
      const primaryUnits = feature.units[0];
      const secondaryUnits = feature.units[1];

      if (!primaryUnits) {
        // this should never happen since feature will be disabled if there are no units at all
        return null;
      }

      const value = data[UNITS_TO_API_FIELD_MAP[primaryUnits]];
      if (!hasValue(value)) {
        // in primary mode we want to fallback to secondary units if value in primary units are not available
        // unless there are no secondary units
        const valueInSecondaryUnits = data[UNITS_TO_API_FIELD_MAP[secondaryUnits]];

        if (!secondaryUnits || !hasValue(valueInSecondaryUnits)) {
          // in primary mode we always want to show something
          // this will return "N/A <units>"
          return <span className={ className }>{ formatGasValue(data, primaryUnits, locale, t('editorShared.not_available')) }</span>;
        } else {
          return <span className={ className }>{ prefix }{ formatGasValue(data, secondaryUnits, locale, t('editorShared.not_available')) }</span>;
        }
      }

      return <span className={ className }>{ prefix }{ formatGasValue(data, primaryUnits, locale, t('editorShared.not_available')) }</span>;
    }
  }
};

export default chakra(GasPrice);
