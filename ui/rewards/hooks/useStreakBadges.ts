// Modified by Quat Capital, 2026-10-26: marketplace, rewards or token info localization. GPL-3.0.
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import type { GetAvailableBadgesResponse } from '@blockscout/points-types';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { useRewardsContext } from 'lib/contexts/rewards';
import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';

const feature = config.features.rewards;

export default function useStreakBadges() {
  const { t: tEco } = useTranslation();
  const { locale } = useLocale();
  const { isAuth, dailyRewardQuery } = useRewardsContext();

  const badgesQuery = useApiQuery<'rewards:user_badges', unknown, GetAvailableBadgesResponse>('rewards:user_badges', {
    queryOptions: {
      enabled: feature.isEnabled && isAuth,
      select: (data) => ({
        ...data,
        items: data.items
          .sort((a, b) => Number(a.requirements?.streak || 0) - Number(b.requirements?.streak || 0))
          .slice(0, 3), // UI limit
      }),
    },
  });

  const nextAchievementText = useMemo(() => {
    try {
      if (badgesQuery.isPending || dailyRewardQuery.isPending) {
        return tEco('rewardsUI.next_achievement_loading'); // for skeleton
      }
      if (!badgesQuery.data?.items || !dailyRewardQuery.data?.streak) {
        return undefined;
      }
      const currentStreak = Number(dailyRewardQuery.data.streak);
      const next = badgesQuery.data.items.find((b) =>
        !(b.is_qualified || b.is_whitelisted || b.is_minted) &&
        Number(b.requirements?.streak) > currentStreak,
      );
      if (!next) {
        return tEco('rewardsUI.all_achievements');
      }
      const target = Number(next.requirements?.streak || 0);
      const diff = target - currentStreak;
      return tEco('rewardsUI.next_achievement', { count: diff, value: formatNumber(diff, locale) });
    } catch {
      return undefined;
    }
  }, [ badgesQuery, dailyRewardQuery, tEco, locale ]);

  return {
    badgesQuery,
    nextAchievementText,
    isLoading: badgesQuery.isPending,
  };
}
