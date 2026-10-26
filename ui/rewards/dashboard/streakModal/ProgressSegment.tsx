// Modified by Quat Capital, 2026-10-26: marketplace, rewards or token info localization. GPL-3.0.
import { Flex, Text } from '@chakra-ui/react';
import { clamp } from 'es-toolkit';
import { useTranslation } from 'react-i18next';

import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { Progress } from 'toolkit/chakra/progress';
import IconSvg from 'ui/shared/IconSvg';

type Props = {
  value: number;
  target: number;
  prevTarget: number;
  isFirst: boolean;
};

export default function ProgressSegment({ value, target, prevTarget, isFirst }: Props) {
  const { t: tEco } = useTranslation();
  const { locale } = useLocale();
  const isDone = value >= target;
  const progress = clamp(value, prevTarget, target);

  return (
    <Flex gap={ 0 } flex={{ base: isFirst ? 0.7 : 1, lg: 1 }} minW="0">
      <Flex flex={ 1 } alignItems="center" h={{ base: '32px', lg: '40px' }} mx={ -2.5 }>
        <Progress
          value={ progress }
          min={ prevTarget }
          max={ target }
          w="full"
          color="green.400"
          trackProps={{
            borderStartRadius: isFirst ? undefined : 0,
            borderEndRadius: 0,
          }}
        />
      </Flex>
      <Flex
        direction="column"
        alignItems="center"
        gap={ 2 }
        flexShrink={ 0 }
        w="60px"
      >
        <Flex h={{ base: '32px', lg: '40px' }} alignItems="center">
          <Flex
            w="40px"
            h="32px"
            borderRadius="lg"
            bgColor={ isDone ? 'green.400' : 'progress.track' }
            alignItems="center"
            justifyContent="center"
            zIndex={ 1 }
          >
            { isDone ? (
              <IconSvg name="check" boxSize={ 5 } color="white"/>
            ) : (
              <IconSvg name="hexagon" boxSize={ 4 } color="icon.secondary"/>
            ) }
          </Flex>
        </Flex>
        <Text textStyle="xs" color="text.secondary">{ tEco('rewardsUI.days_count', { count: target, value: formatNumber(target, locale) }) }</Text>
      </Flex>
    </Flex>
  );
}
