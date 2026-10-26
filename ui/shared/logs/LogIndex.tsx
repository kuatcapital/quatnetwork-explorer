// Modified by Quat Capital, 2026-10-25: localize event log and status labels. GPL-3.0.
import type { HTMLChakraProps } from '@chakra-ui/react';
import { Center } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';

interface Props extends HTMLChakraProps<'div'> {
  isLoading?: boolean;
}

const LogIndex = ({ children, isLoading, ...props }: Props) => {
  const { t } = useTranslation();
  return (
    <Tooltip content={ t('sharedLogs.log_index') }>
      <Skeleton loading={ isLoading } asChild>
        <Center
          color={ isLoading ? 'transparent' : { _light: 'blue.600', _dark: 'gray.50' } }
          bgColor={ isLoading ? undefined : { _light: 'blue.50', _dark: 'gray.600' } }
          borderRadius="base"
          px={ 2 }
          { ...props }
        >
          { children }
        </Center>
      </Skeleton>
    </Tooltip>
  );
};

export default React.memo(LogIndex);
