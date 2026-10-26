// Modified by Quat Capital, 2026-10-26: marketplace, rewards or token info localization. GPL-3.0.
import { Flex, Text, Separator } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { GetAvailableBadgesResponse } from '@blockscout/points-types';

import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { DialogBody, DialogContent, DialogHeader, DialogRoot } from 'toolkit/chakra/dialog';
import { Heading } from 'toolkit/chakra/heading';

import BadgeCard from './BadgeCard';
import ProgressSegment from './ProgressSegment';

type Props = {
  open: boolean;
  onOpenChange: ({ open }: { open: boolean }) => void;
  currentStreak: number;
  badges?: GetAvailableBadgesResponse['items'];
};

const EMPTY_ARRAY: GetAvailableBadgesResponse['items'] = [];

const RewardsStreakModal = ({ open, onOpenChange, currentStreak, badges = EMPTY_ARRAY }: Props) => {
  const { t: tEco } = useTranslation();
  const { locale } = useLocale();

  return (
    <DialogRoot open={ open } onOpenChange={ onOpenChange } size={{ lgDown: 'full', lg: 'md' }}>
      <DialogContent>
        <DialogHeader>{ tEco('rewardsUI.streak_progress') }</DialogHeader>
        <DialogBody>
          <Flex direction="column" gap={ 6 }>
            <Flex direction="column" gap={{ base: 6, lg: 3 }}>
              <Text textStyle={{ base: 'sm', lg: 'md' }}>
                { tEco('rewardsUI.streak_progress_description') }</Text>
              <Flex
                direction={{ base: 'column', lg: 'row' }}
                gap={{ base: 3, lg: 10 }}
                bgColor={{ _light: 'gray.50', _dark: 'whiteAlpha.100' }}
                p={{ base: 4, lg: 8 }}
                pl={{ base: 4, lg: 5 }}
                borderRadius="lg"
                justifyContent="space-between"
              >
                <Flex direction="column" alignItems="center" gap={{ base: 1, lg: 2 }}>
                  <Heading level="1">{ formatNumber(currentStreak, locale) }</Heading>
                  <Text textStyle="xs" color="text.secondary">{ tEco('rewardsUI.day_streak') }</Text>
                </Flex>
                <Flex flex={ 1 } pl={{ base: 2, lg: 0 }}>
                  { badges.map((badge, i) => {
                    const target = Number(badge.requirements?.streak || 0);
                    const prevTarget = i > 0 ? Number(badges[i - 1]?.requirements?.streak || 0) : 0;
                    const value = (badge.is_whitelisted || badge.is_minted) ? target : currentStreak;
                    return (
                      <ProgressSegment
                        key={ i }
                        value={ value }
                        target={ target }
                        prevTarget={ prevTarget }
                        isFirst={ i === 0 }
                      />
                    );
                  }) }
                </Flex>
              </Flex>
            </Flex>

            <Flex direction="column" gap={ 2 }>
              <Heading level="3">{ tEco('rewardsUI.rewards') }</Heading>
              <Flex direction={{ base: 'column', lg: 'row' }} gap={{ base: 2, lg: 6 }} justifyContent="space-between">
                { badges.map((badge, i) => (
                  <>
                    <BadgeCard
                      key={ i }
                      badge={ badge }
                      currentStreak={ currentStreak }
                      index={ i }
                    />
                    { i < badges.length - 1 && (
                      <Separator
                        display={{ base: 'none', lg: 'block' }}
                        orientation="vertical"
                      />
                    ) }
                  </>
                )) }
              </Flex>
            </Flex>
          </Flex>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default RewardsStreakModal;
