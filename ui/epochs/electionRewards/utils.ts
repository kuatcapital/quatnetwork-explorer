// Modified by Quat Capital, 2026-10-26: complete localized reward counts and table labels. GPL-3.0.
import type { TFunction } from 'i18next';

import type { CeloEpochDetails } from 'types/api/epochs';
import type { ExcludeNull } from 'types/utils';

import type { Locale } from 'configs/app/i18n';
import { formatNumber } from 'lib/format/localeNumbers';

export function getRewardNumText(type: keyof NonNullable<CeloEpochDetails['aggregated_election_rewards']>, num: number, t: TFunction, locale: Locale): string {
  const options = { count: num, value: formatNumber(num, locale) };
  switch (type) {
    case 'delegated_payment': return t('networkTransfers.payment_count', options);
    case 'group': return t('networkTransfers.group_reward_count', options);
    case 'validator': return t('networkTransfers.validator_count', options);
    case 'voter': return t('networkTransfers.voter_count', options);
    default: return '';
  }
}

export function getRewardDetailsTableTitles(type: keyof ExcludeNull<CeloEpochDetails['aggregated_election_rewards']>, t: TFunction): [string, string] {
  switch (type) {
    case 'delegated_payment':
      return [ t('networkTransfers.beneficiary'), t('networkTransfers.validator') ];
    case 'group':
      return [ t('networkTransfers.validator_group'), t('networkTransfers.associated_validator') ];
    case 'validator':
      return [ t('networkTransfers.validator'), t('networkTransfers.validator_group') ];
    case 'voter':
      return [ t('networkTransfers.voter'), t('networkTransfers.validator_group') ];
  }
}

export function formatRewardType(type: keyof ExcludeNull<CeloEpochDetails['aggregated_election_rewards']>) {
  return type.replaceAll('_', '-');
}
