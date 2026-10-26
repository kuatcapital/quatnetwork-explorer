// Modified by Quat Capital, 2026-10-25: localize event log and status labels. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { SmartContractCreationStatus } from 'types/api/contract';

import type { BadgeProps } from 'toolkit/chakra/badge';
import { Badge } from 'toolkit/chakra/badge';
import { Tooltip } from 'toolkit/chakra/tooltip';

import StatusTag from './StatusTag';

interface Props extends BadgeProps {
  status: SmartContractCreationStatus;
}

const ContractCreationStatus = ({ status, ...rest }: Props) => {
  const { t } = useTranslation();
  switch (status) {
    case 'success':
      return (
        <Tooltip content={ t('sharedStatus.contract_created') }>
          <StatusTag type="ok" text={ t('common.success') } { ...rest }/>
        </Tooltip>
      );
    case 'failed':
      return (
        <Tooltip content={ t('sharedStatus.creation_failed') }>
          <StatusTag type="error" text={ t('common.failed') } { ...rest }/>
        </Tooltip>
      );
    case 'selfdestructed':
      return (
        <Tooltip content={ t('sharedStatus.contract_destroyed_hint') }>
          <Badge colorPalette="gray" { ...rest }>{ t('sharedStatus.self_destructed') }</Badge>
        </Tooltip>
      );
    default:
      return null;
  }
};

export default React.memo(ContractCreationStatus);
