// Modified by Quat Capital, 2026-10-26: marketplace, rewards or token info localization. GPL-3.0.
import { Flex } from '@chakra-ui/react';
import { Trans, useTranslation } from 'react-i18next';

import { useRewardsContext } from 'lib/contexts/rewards';
import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { Skeleton } from 'toolkit/chakra/skeleton';

import RewardsReadOnlyInputWithCopy from '../../RewardsReadOnlyInputWithCopy';
import RewardsDashboardCard from '../RewardsDashboardCard';

export default function ReferralsTab() {
  const { t: tEco } = useTranslation();
  const { locale } = useLocale();
  const { rewardsConfigQuery, referralsQuery } = useRewardsContext();

  return (
    <RewardsDashboardCard
      title={ tEco('rewardsUI.referral_program') }
      description={ (
        <Trans
          t={ tEco }
          i18nKey="rewardsUI.referrals_intro"
          values={{
            value: rewardsConfigQuery.data?.rewards?.referral_share ?
              formatNumber(Number(rewardsConfigQuery.data.rewards.referral_share), locale, { style: 'percent' }) : 'N/A',
          }}
          components={{ bonus: <Skeleton as="span" loading={ rewardsConfigQuery.isPending }/> }}
        />
      ) }
      contentDirection="row"
    >
      <Flex
        flex={ 1 }
        gap={{ base: 2, lg: 6 }}
        px={{ base: 4, lg: 6 }}
        py={{ base: 4, lg: 0 }}
        flexDirection={{ base: 'column', lg: 'row' }}
      >
        <RewardsReadOnlyInputWithCopy
          label={ tEco('rewardsUI.referral_link') }
          value={ referralsQuery.data?.link || 'N/A' }
          isLoading={ referralsQuery.isPending }
          flex={ 2 }
        />
        <RewardsReadOnlyInputWithCopy
          label={ tEco('rewardsUI.referral_code') }
          value={ referralsQuery.data?.code || 'N/A' }
          isLoading={ referralsQuery.isPending }
          flex={ 1 }
        />
      </Flex>
    </RewardsDashboardCard>
  );
}
