// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import { Box } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { SmartContractConflictingImplementation, SmartContractProxyType } from 'types/api/contract';

import { Alert } from 'toolkit/chakra/alert';
import { Link } from 'toolkit/chakra/link';
import { space } from 'toolkit/utils/htmlEntities';

import ConflictingImplementationsModal from './ConflictingImplementationsModal';
import { PROXY_TYPES } from './utils';

interface Props {
  type: NonNullable<SmartContractProxyType>;
  isLoading?: boolean;
  conflictingImplementations?: Array<SmartContractConflictingImplementation>;
}

const ContractCodeProxyPattern = ({ type, isLoading, conflictingImplementations }: Props) => {
  const { t: tQuat } = useTranslation();

  const proxyInfo = PROXY_TYPES[type];

  if (!proxyInfo || type === 'unknown') {
    return null;
  }

  const status = conflictingImplementations && conflictingImplementations.length > 0 ? 'warning' : 'success';

  return (
    <Alert status={ status } whiteSpace="pre-wrap" loading={ isLoading } descriptionProps={{ flexDir: 'column' }}>
      { proxyInfo.link ? (
        <Box>
          This proxy smart-contract is detected via <Link href={ proxyInfo.link } external>{ proxyInfo.name }</Link>
          { proxyInfo.description && ` - ${ proxyInfo.description }` }
        </Box>
      ) : (
        <Box>
          This proxy smart-contract is detected via { proxyInfo.name }
          { proxyInfo.description && ` - ${ proxyInfo.description }` }
        </Box>
      ) }
      { conflictingImplementations && conflictingImplementations.length > 0 && (
        <Box mt={ 1 } whiteSpace="pre-wrap">
          <span>{ tQuat('contracts.multiple_implementations') }{ space }</span>
          <ConflictingImplementationsModal data={ conflictingImplementations }>
            <Link>{ tQuat('contracts.view_details') }</Link>
          </ConflictingImplementationsModal>
        </Box>
      ) }
    </Alert>
  );
};

export default React.memo(ContractCodeProxyPattern);
