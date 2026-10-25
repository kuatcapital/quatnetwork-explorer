// Modified by Quat Capital, 2026-10-25: localized percentage labels with locale-independent CSS. GPL-3.0.
import type { HTMLChakraProps } from '@chakra-ui/react';
import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import { useLocale } from 'lib/i18n/provider';
import { Skeleton } from 'toolkit/chakra/skeleton';

import { formatUtilization } from './formatUtilization';

interface Props extends Omit<HTMLChakraProps<'div'>, 'direction'> {
  value: number;
  colorScheme?: 'green' | 'gray';
  isLoading?: boolean;
}

const WIDTH = 50;

const Utilization = ({ value, colorScheme = 'green', isLoading, ...rest }: Props, ref: React.Ref<HTMLDivElement>) => {
  const { locale } = useLocale();
  const { width, label } = formatUtilization(value, locale);
  const color = colorScheme === 'gray' ? 'text.secondary' : 'green.500';

  return (
    <Flex alignItems="center" columnGap={ 2 } { ...rest } ref={ ref }>
      <Skeleton loading={ isLoading } w={ `${ WIDTH }px` } h="4px" borderRadius="full" overflow="hidden">
        <Box bg={{ _light: 'blackAlpha.200', _dark: 'whiteAlpha.200' }} h="100%">
          <Box bg={ color } w={ width } h="100%"/>
        </Box>
      </Skeleton>
      <Skeleton loading={ isLoading } color={ color } fontWeight="bold">
        <span>
          { label }
        </span>
      </Skeleton>
    </Flex>
  );
};

export default React.memo(React.forwardRef(Utilization));
