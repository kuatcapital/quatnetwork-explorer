// Modified by Quat Capital, 2026-10-26: marketplace, rewards or token info localization. GPL-3.0.
import { Text, Box, Flex, Center } from '@chakra-ui/react';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { route } from 'nextjs-routes';

import { useRewardsContext } from 'lib/contexts/rewards';
import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { Button } from 'toolkit/chakra/button';
import { Skeleton } from 'toolkit/chakra/skeleton';
import IconSvg from 'ui/shared/IconSvg';

import MeritsIcon from '../../MeritsIcon';
import RewardsReadOnlyInputWithCopy from '../../RewardsReadOnlyInputWithCopy';

type Props = {
  isReferral: boolean;
  customReferralReward: string | undefined;
};

const CongratsStepContent = ({ isReferral, customReferralReward }: Props) => {
  const { t: tEco } = useTranslation();
  const { locale } = useLocale();
  const { referralsQuery, rewardsConfigQuery } = useRewardsContext();

  const registrationReward = Number(rewardsConfigQuery.data?.rewards?.registration);
  const registrationWithReferralReward = customReferralReward ?
    Number(customReferralReward) + registrationReward :
    Number(rewardsConfigQuery.data?.rewards?.registration_with_referral);
  const referralReward = registrationWithReferralReward - registrationReward;

  const refLink = referralsQuery.data?.link || 'N/A';
  const shareText = tEco('rewardsUI.share_message', {
    reward: registrationReward ? formatNumber(registrationReward, locale) : 'N/A', link: refLink,
  });

  const textColor = { _light: 'blue.700', _dark: 'blue.100' };

  return (
    <>
      <Flex
        alignItems="center"
        background={{ _light: 'linear-gradient(254.96deg, #9CD8FF 9.09%, #D0EFFF 88.45%)', _dark: 'linear-gradient(255deg, #1B253B 9.09%, #222C3F 88.45%)' }}
        borderRadius="md"
        p={ 2 }
        pl={{ base: isReferral ? 4 : 8, md: 8 }}
        mb={ 8 }
        h="90px"
      >
        <MeritsIcon boxSize={{ base: isReferral ? 8 : 12, md: 12 }} mr={{ base: isReferral ? 1 : 2, md: 2 }}/>
        <Skeleton loading={ rewardsConfigQuery.isLoading }>
          <Text fontSize={{ base: isReferral ? '24px' : '30px', md: '30px' }} fontWeight="700" color={ textColor }>
            +{ (isReferral ? registrationWithReferralReward : registrationReward) ?
              formatNumber(isReferral ? registrationWithReferralReward : registrationReward, locale) : 'N/A' }
          </Text>
        </Skeleton>
        { isReferral && (
          <Flex alignItems="center" h="56px">
            <Box w="1px" h="full" bgColor={{ _light: 'whiteAlpha.800', _dark: 'whiteAlpha.100' }} mx={{ base: 3, md: 8 }}/>
            <Flex flexDirection="column" justifyContent="space-between" gap={ 2 }>
              { [
                {
                  title: tEco('rewardsUI.registration'),
                  value: registrationReward || 'N/A',
                },
                {
                  title: tEco('rewardsUI.referral_program'),
                  value: referralReward || 'N/A',
                },
              ].map(({ title, value }) => (
                <Flex key={ title } alignItems="center" gap={{ base: 1, md: 2 }}>
                  <MeritsIcon boxSize={{ base: 5, md: 6 }}/>
                  <Skeleton loading={ rewardsConfigQuery.isLoading }>
                    <Text fontSize="sm" fontWeight="700" color={ textColor }>
                      +{ typeof value === 'number' ? formatNumber(value, locale) : value }
                    </Text>
                  </Skeleton>
                  <Text fontSize="sm" color={ textColor }>
                    { title }
                  </Text>
                </Flex>
              )) }
            </Flex>
          </Flex>
        ) }
      </Flex>
      <Flex flexDirection="column" alignItems="flex-start" px={ 3 } mb={ 8 }>
        <Flex alignItems="center" gap={ 2 }>
          <Center
            boxSize={ 8 }
            borderRadius="8px"
            color={{ _light: 'blue.500', _dark: 'blue.100' }}
            bgColor={{ _light: 'blue.50', _dark: 'blue.800' }}
          >
            <IconSvg name="profile" boxSize={ 5 }/>
          </Center>
          <Text fontSize="lg" fontWeight="500">
            { tEco('rewardsUI.referral_program') }</Text>
        </Flex>
        <Text fontSize="md" mt={ 2 }>
          <Trans
            t={ tEco }
            i18nKey="rewardsUI.referrals_bonus"
            values={{
              value: rewardsConfigQuery.data?.rewards?.referral_share ?
                formatNumber(Number(rewardsConfigQuery.data.rewards.referral_share), locale, { style: 'percent' }) : 'N/A',
            }}
            components={{ bonus: <Skeleton as="span" loading={ rewardsConfigQuery.isLoading }/> }}
          />
        </Text>
        <RewardsReadOnlyInputWithCopy
          label={ tEco('rewardsUI.referral_link') }
          value={ refLink }
          isLoading={ referralsQuery.isLoading }
          mt={ 3 }
          w="100%"
        />
        <Skeleton loading={ referralsQuery.isLoading } mt={ 6 }>
          <Button asChild>
            <a href={ `https://x.com/intent/tweet?text=${ encodeURIComponent(shareText) }` } target="_blank" rel="noopener noreferrer">
              { tEco('rewardsUI.share_on') }<IconSvg name="social/twitter" boxSize={ 6 } ml={ 1 }/>
            </a>
          </Button>
        </Skeleton>
      </Flex>
      <Flex flexDirection="column" alignItems="flex-start" px={ 3 }>
        <Flex alignItems="center" gap={ 2 }>
          <Center
            boxSize={ 8 }
            borderRadius="8px"
            color={{ _light: 'blue.500', _dark: 'blue.100' }}
            bgColor={{ _light: 'blue.50', _dark: 'blue.800' }}
          >
            { /* FIXME use non-navigation icon */ }
            <IconSvg name="navigation/stats" boxSize={ 6 }/>
          </Center>
          <Text fontSize="lg" fontWeight="500">
            { tEco('rewardsUI.dashboard') }</Text>
        </Flex>
        <Text fontSize="md" mt={ 2 }>
          { tEco('rewardsUI.dashboard_description') }</Text>
        <Button asChild mt={ 3 }>
          <a href={ route({ pathname: '/account/merits' }) }>{ tEco('rewardsUI.open') }</a>
        </Button>
      </Flex>
    </>
  );
};

export default CongratsStepContent;
