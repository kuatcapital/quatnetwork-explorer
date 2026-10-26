// Modified by Quat Capital, 2026-10-26: exact localized Merits totals. GPL-3.0.
import { Flex, Text } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import { formatBigNumber, formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { Heading } from 'toolkit/chakra/heading';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Hint } from 'toolkit/components/Hint/Hint';

import MeritsIcon from '../MeritsIcon';

type Props = {
  label?: string;
  value: number | string | undefined;
  withIcon?: boolean;
  hint?: string | React.ReactNode;
  isLoading?: boolean;
  bottomText?: string;
  isBottomTextLoading?: boolean;
};

const RewardsDashboardCardValue = ({ label, value, withIcon, hint, isLoading, bottomText, isBottomTextLoading }: Props) => {
  const { locale } = useLocale();
  const displayedValue = (() => {
    if (typeof value === 'number') return formatNumber(value, locale);
    if (typeof value === 'string' && /^[+-]?\d+(?:\.\d+)?$/.test(value)) return formatBigNumber(new BigNumber(value), locale);
    return value;
  })();
  return (
    <Flex key={ label } flexDirection="column" alignItems="center" gap={{ base: 1, md: 2 }}>
      { label && (
        <Flex alignItems="center" gap={ 1 }>
          { hint && <Hint label={ hint }/> }
          <Text textStyle="xs" fontWeight="500" color="text.secondary">
            { label }
          </Text>
        </Flex>
      ) }
      <Skeleton
        loading={ isLoading }
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap={ 2 }
        minW="100px"
      >
        { withIcon && <MeritsIcon boxSize={ 8 }/> }
        <Heading level="1">
          { displayedValue }
        </Heading>
      </Skeleton>
      { bottomText && (
        <Skeleton loading={ isBottomTextLoading || isLoading } minW="100px">
          <Text textStyle={{ base: 'xs', md: 'sm' }} color="text.secondary">
            { bottomText }
          </Text>
        </Skeleton>
      ) }
    </Flex>
  );
};

export default RewardsDashboardCardValue;
