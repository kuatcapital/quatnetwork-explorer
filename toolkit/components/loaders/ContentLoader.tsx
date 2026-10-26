// Modified by Quat Capital, 2026-10-26: runtime toolkit labels for RU/KK/EN. GPL-3.0.
import type { BoxProps } from '@chakra-ui/react';
import { Box, Text } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props extends BoxProps {
  text?: string;
}

export const ContentLoader = React.memo(({ text, ...props }: Props) => {
  const { t } = useTranslation();
  return (
    <Box display="inline-block" { ...props }>
      <Box
        width="100%"
        height="6px"
        position="relative"
        _after={{
          content: `" "`,
          position: 'absolute',
          width: '60px',
          height: '6px',
          animation: `fromLeftToRight 700ms ease-in-out infinite alternate`,
          left: '0%',
          top: 0,
          backgroundColor: 'blue.300',
          borderRadius: 'full',
        }}
      />
      <Text mt={ 6 } color="text.secondary">
        { text || t('toolkit.loading') }
      </Text>
    </Box>
  );
});
