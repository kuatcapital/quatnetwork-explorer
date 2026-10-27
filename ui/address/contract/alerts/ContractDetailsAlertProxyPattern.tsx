// Modified by Quat Capital, 2026-10-27: complete runtime contract-interface localization. GPL-3.0.
// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import { Box } from '@chakra-ui/react';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import type { SmartContractConflictingImplementation, SmartContractProxyType } from 'types/api/contract';

import { Alert } from 'toolkit/chakra/alert';
import { Link } from 'toolkit/chakra/link';
import { space } from 'toolkit/utils/htmlEntities';

import { getLocalizedProxyInfo } from '../localization';
import ConflictingImplementationsModal from './ConflictingImplementationsModal';

interface Props {
  type: NonNullable<SmartContractProxyType>;
  isLoading?: boolean;
  conflictingImplementations?: Array<SmartContractConflictingImplementation>;
}

const ContractCodeProxyPattern = ({ type, isLoading, conflictingImplementations }: Props) => {
  const { t: tQuat } = useTranslation();

  const proxyInfo = getLocalizedProxyInfo(type, tQuat);

  if (!proxyInfo || type === 'unknown') {
    return null;
  }

  const status = conflictingImplementations && conflictingImplementations.length > 0 ? 'warning' : 'success';

  return (
    <Alert status={ status } whiteSpace="pre-wrap" loading={ isLoading } descriptionProps={{ flexDir: 'column' }}>
      <Box>
        <Trans
          t={ tQuat }
          i18nKey="contracts.proxy_detected"
          components={{ pattern: proxyInfo.link ? <Link href={ proxyInfo.link } external>{ proxyInfo.name }</Link> : <span>{ proxyInfo.name }</span> }}
        />
        { proxyInfo.description && ` - ${ proxyInfo.description }` }
      </Box>
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
