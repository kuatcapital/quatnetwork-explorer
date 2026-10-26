// Modified by Quat Capital, 2026-10-26: localize filter tag labels without changing API parameters. GPL-3.0.
import BigNumber from 'bignumber.js';
import { castArray } from 'es-toolkit/compat';
import type { TFunction } from 'i18next';

import type { AdvancedFilterAge, AdvancedFilterParams } from 'types/api/advancedFilter';
import type { ClusterChainConfig } from 'types/multichain';

import type { Locale } from 'configs/app/i18n';
import dayjs from 'lib/date/dayjs';
import { formatBigNumber } from 'lib/format/localeNumbers';
import { HOUR, DAY, MONTH } from 'toolkit/utils/consts';

import { getAdvancedFilterTypes, getAdvancedFilterAgeLabel } from './constants';

export function getDurationFromAge(age: AdvancedFilterAge) {
  switch (age) {
    case '1h':
      return HOUR;
    case '24h':
      return DAY;
    case '7d':
      return DAY * 7;
    case '1m':
      return MONTH;
    case '3m':
      return MONTH * 3;
    case '6m':
      return MONTH * 6;
  }
}

function getFilterValueWithNames(values?: Array<string>, names?: Array<string>) {
  if (!names) {
    return castArray(values).join(', ');
  } else if (Array.isArray(names) && Array.isArray(values)) {
    return names.map((n, i) => n ? n : values[i]).join(', ');
  } else {
    return names;
  }
}

const getFilterParamNames = (t: TFunction): Record<keyof AdvancedFilterParams, string> => ({
  // we don't show address_relation as filter tag
  address_relation: '',
  age: t('common.age'),
  age_from: t('advancedFilterUi.date_from'),
  age_to: t('advancedFilterUi.date_to'),
  amount_from: t('advancedFilterUi.amount_from'),
  amount_to: t('advancedFilterUi.amount_to'),
  from_address_hashes_to_exclude: t('advancedFilterUi.from_exclude'),
  from_address_hashes_to_include: t('common.from'),
  methods: t('advancedFilterUi.methods'),
  methods_names: '',
  to_address_hashes_to_exclude: t('advancedFilterUi.to_exclude'),
  to_address_hashes_to_include: t('common.to'),
  token_contract_address_hashes_to_exclude: t('advancedFilterUi.asset_exclude'),
  token_contract_symbols_to_exclude: '',
  token_contract_address_hashes_to_include: t('advancedFilterUi.asset'),
  token_contract_symbols_to_include: '',
  transaction_types: t('common.type'),
});

export function getFilterTags(
  filters: AdvancedFilterParams, chainConfig: ClusterChainConfig['app_config'] | undefined, t: TFunction, locale: Locale,
) {
  const filterParamNames = getFilterParamNames(t);
  const filtersToShow = { ...filters };
  if (filtersToShow.age) {
    filtersToShow.age_from = undefined;
    filtersToShow.age_to = undefined;
  }

  return (Object.entries(filtersToShow) as Array<[keyof AdvancedFilterParams, AdvancedFilterParams[keyof AdvancedFilterParams]]>).map(([ key, value ]) => {
    if (!value) {
      return;
    }
    const name = filterParamNames[key as keyof AdvancedFilterParams];
    if (!name) {
      return;
    }
    let valueStr;
    switch (key) {
      case 'age': {
        valueStr = filtersToShow.age ? getAdvancedFilterAgeLabel(filtersToShow.age, t) : '';
        break;
      }
      case 'amount_from':
      case 'amount_to': {
        const number = BigNumber(String(value));
        valueStr = number.isFinite() ? formatBigNumber(number, locale) : String(value);
        break;
      }
      case 'methods': {
        valueStr = getFilterValueWithNames(filtersToShow.methods, filtersToShow.methods_names);
        break;
      }
      case 'transaction_types': {
        const advancedFilterTypes = getAdvancedFilterTypes(chainConfig, false, t);
        valueStr = castArray(value).map(i => advancedFilterTypes.find(t => t.id === i)?.name).filter(Boolean).join(', ');
        break;
      }
      case 'token_contract_address_hashes_to_exclude': {
        valueStr = getFilterValueWithNames(filtersToShow.token_contract_address_hashes_to_exclude, filtersToShow.token_contract_symbols_to_exclude);
        break;
      }
      case 'token_contract_address_hashes_to_include': {
        valueStr = getFilterValueWithNames(filtersToShow.token_contract_address_hashes_to_include, filtersToShow.token_contract_symbols_to_include);
        break;
      }
      case 'age_from': {
        valueStr = dayjs(filtersToShow.age_from).locale(locale).format('ll');
        break;
      }
      case 'age_to': {
        valueStr = dayjs(filtersToShow.age_to).locale(locale).format('ll');
        break;
      }
      default: {
        valueStr = castArray(value).join(', ');
      }
    }
    if (!valueStr) {
      return;
    }

    return {
      key: key as keyof AdvancedFilterParams,
      name,
      value: valueStr,
    };
  }).filter(Boolean);
}
