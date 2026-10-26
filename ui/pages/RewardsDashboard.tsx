// Modified by Quat Capital, 2026-10-26: marketplace, rewards or token info localization. GPL-3.0.
import { Flex } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import config from 'configs/app';
import { useRewardsContext } from 'lib/contexts/rewards';
import { formatNumber } from 'lib/format/localeNumbers';
import useIsMobile from 'lib/hooks/useIsMobile';
import { useLocale } from 'lib/i18n/provider';
import { Alert } from 'toolkit/chakra/alert';
import { Button } from 'toolkit/chakra/button';
import { Link } from 'toolkit/chakra/link';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import DailyRewardClaimButton from 'ui/rewards/dashboard/DailyRewardClaimButton';
import RewardsDashboardCard from 'ui/rewards/dashboard/RewardsDashboardCard';
import RewardsDashboardCardValue from 'ui/rewards/dashboard/RewardsDashboardCardValue';
import RewardsStreakModal from 'ui/rewards/dashboard/streakModal/RewardsStreakModal';
import ActivityTab from 'ui/rewards/dashboard/tabs/ActivityTab';
import ReferralsTab from 'ui/rewards/dashboard/tabs/ReferralsTab';
import ResourcesTab from 'ui/rewards/dashboard/tabs/ResourcesTab';
import useStreakBadges from 'ui/rewards/hooks/useStreakBadges';
import AdBanner from 'ui/shared/ad/AdBanner';
import PageTitle from 'ui/shared/Page/PageTitle';
import useRedirectForInvalidAuthToken from 'ui/snippets/auth/useRedirectForInvalidAuthToken';

const RewardsDashboard = () => {
  const { t: tEco } = useTranslation();
  const { locale } = useLocale();
  const { balancesQuery, isAuth, referralsQuery, rewardsConfigQuery, dailyRewardQuery, isInitialized } = useRewardsContext();
  const { nextAchievementText, isLoading: isBadgesLoading, badgesQuery } = useStreakBadges();
  const streakModal = useDisclosure();
  const isMobile = useIsMobile();

  const [ isError, setIsError ] = useState(false);

  useRedirectForInvalidAuthToken();

  useEffect(() => {
    if (!config.features.rewards.isEnabled || (isInitialized && !isAuth)) {
      window.location.assign('/');
    }
  }, [ isInitialized, isAuth ]);

  useEffect(() => {
    setIsError(balancesQuery.isError || referralsQuery.isError || rewardsConfigQuery.isError || dailyRewardQuery.isError);
  }, [ balancesQuery.isError, referralsQuery.isError, rewardsConfigQuery.isError, dailyRewardQuery.isError ]);

  if (!config.features.rewards.isEnabled) {
    return null;
  }

  return (
    <>
      <Flex gap={ 3 } justifyContent="space-between" mb={ 6 }>
        <PageTitle
          title={ tEco('rewardsUI.dashboard') }
          secondRow={ (
            <span>
              <Trans
                t={ tEco }
                i18nKey="rewardsUI.hub_intro"
                components={{
                  hub: <Link external href={ `https://merits.blockscout.com/?tab=users&utm_source=${ config.chain.id }&utm_medium=text-banner` }/>,
                }}
              />
            </span>
          ) }
          mb={ 0 }
        />
        { !isMobile && <AdBanner format="mobile" w="fit-content" flexShrink={ 0 } borderRadius="md" overflow="hidden"/> }
      </Flex>
      <Flex flexDirection="column" alignItems="flex-start" w="full" gap={ 6 }>
        { isError && <Alert status="error">{ tEco('rewardsUI.load_error') }</Alert> }
        <Flex gap={ 6 } flexDirection={{ base: 'column', md: 'row' }} w="full">
          <RewardsDashboardCard
            title={ tEco('rewardsUI.all_merits') }
            description={ tEco('rewardsUI.claim_description') }
            contentDirection="column-reverse"
            cardValueStyle={{ minH: { base: '64px', md: '116px' } }}
            contentAfter={ <DailyRewardClaimButton/> }
            hint={ (
              <Trans
                t={ tEco }
                i18nKey="rewardsUI.total_hint"
                components={{ docs: <Link external href="https://docs.blockscout.com/using-blockscout/merits"/> }}
              />
            ) }
          >
            <RewardsDashboardCardValue
              value={ balancesQuery.data?.total || 'N/A' }
              isLoading={ balancesQuery.isPending }
              withIcon
            />
          </RewardsDashboardCard>
          <RewardsDashboardCard
            title={ tEco('rewardsUI.referrals') }
            description={ tEco('rewardsUI.referrals_description') }
            contentDirection="column-reverse"
            cardValueStyle={{ minH: { base: '64px', md: '116px' } }}
          >
            <RewardsDashboardCardValue
              value={ referralsQuery.data?.referrals ?
                tEco('rewardsUI.users_count', {
                  count: Number(referralsQuery.data.referrals), value: formatNumber(Number(referralsQuery.data.referrals), locale),
                }) :
                'N/A'
              }
              isLoading={ referralsQuery.isPending }
            />
          </RewardsDashboardCard>
          <RewardsDashboardCard
            title={ tEco('rewardsUI.streak') }
            description={ tEco('rewardsUI.streak_description') }
            hint={ (
              <Trans
                t={ tEco }
                i18nKey="rewardsUI.streak_hint"
                components={{ docs: <Link external href="https://docs.blockscout.com/using-blockscout/merits/streak-rewards"/> }}
              />
            ) }
            contentDirection="column-reverse"
            cardValueStyle={{ minH: { base: '64px', md: '116px' } }}
            contentAfter={ (
              <Button mt={ 3 } onClick={ streakModal.onOpen } loading={ isBadgesLoading }>
                { tEco('rewardsUI.check_achievements') }</Button>
            ) }
          >
            <RewardsDashboardCardValue
              value={ dailyRewardQuery.data?.streak ?
                tEco('rewardsUI.days_count', {
                  count: Number(dailyRewardQuery.data.streak), value: formatNumber(Number(dailyRewardQuery.data.streak), locale),
                }) :
                'N/A' }
              isLoading={ dailyRewardQuery.isPending }
              bottomText={ nextAchievementText }
              isBottomTextLoading={ isBadgesLoading }
            />
          </RewardsDashboardCard>
        </Flex>
        <RoutedTabs
          w="full"
          tabs={ [
            {
              id: 'activity',
              title: tEco('rewardsUI.activity'),
              component: <ActivityTab/>,
            },
            {
              id: 'referrals',
              title: tEco('rewardsUI.referrals'),
              component: <ReferralsTab/>,
            },
            {
              id: 'resources',
              title: tEco('rewardsUI.resources'),
              component: <ResourcesTab/>,
            },
          ] }
        />
      </Flex>
      { !isBadgesLoading && !dailyRewardQuery.isPending && (
        <RewardsStreakModal
          open={ streakModal.open }
          onOpenChange={ streakModal.onOpenChange }
          currentStreak={ Number(dailyRewardQuery.data?.streak || 0) }
          badges={ badgesQuery.data?.items }
        />
      ) }
    </>
  );
};

export default RewardsDashboard;
