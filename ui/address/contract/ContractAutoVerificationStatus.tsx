// Modified by Quat Capital on 2026-10-25: localize verification statuses. GPL-3.0.
import { Box, HStack, Spinner } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Tooltip } from 'toolkit/chakra/tooltip';
import IconSvg from 'ui/shared/IconSvg';

const STATUS_MAP = {
  pending: {
    text: 'contracts.auto_checking',
    leftElement: <Spinner size="sm"/>,
  },
  success: {
    text: 'contracts.auto_verified',
    leftElement: <IconSvg name="verified" boxSize={ 5 } color="green.500"/>,
  },
  failed: {
    text: 'contracts.auto_failed',
    leftElement: <IconSvg name="status/warning" boxSize={ 5 } color="orange.400"/>,
  },
};

export type TContractAutoVerificationStatus = keyof typeof STATUS_MAP;

interface Props {
  status: TContractAutoVerificationStatus;
  mode?: 'inline' | 'tooltip';
}

const ContractAutoVerificationStatus = ({ status, mode = 'inline' }: Props) => {
  const { t } = useTranslation();
  return (
    <Tooltip content={ t(STATUS_MAP[status].text) } disabled={ mode === 'inline' }>
      <HStack gap={ 2 } whiteSpace="pre-wrap">
        { STATUS_MAP[status].leftElement }
        <Box display={ mode === 'inline' ? 'inline' : 'none' } textStyle="sm">{ t(STATUS_MAP[status].text) }</Box>
      </HStack>
    </Tooltip>
  );
};

export default React.memo(ContractAutoVerificationStatus);
