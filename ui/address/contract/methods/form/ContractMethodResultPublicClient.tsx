// Modified by Quat Capital, 2026-10-27: complete runtime contract-interface localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { Alert } from 'toolkit/chakra/alert';

import { localizeContractInteractionError } from '../../localization';
export interface Props {
  data: unknown;
  onSettle: () => void;
  estimatedGas?: bigint;
}

const ContractMethodResultPublicClient = ({ data, estimatedGas, onSettle }: Props) => {
  const { t } = useTranslation();
  const { locale } = useLocale();

  React.useEffect(() => {
    onSettle();
  }, [ onSettle ]);

  if (data instanceof Error) {
    return (
      <Alert status="error" textStyle="sm" wordBreak="break-word" whiteSpace="pre-wrap">
        { localizeContractInteractionError(data, t) }
      </Alert>
    );
  }

  if (estimatedGas) {
    return (
      <Alert status="info" textStyle="sm" wordBreak="break-word" whiteSpace="pre-wrap">
        { t('contracts.estimated_gas', { gas: formatNumber(estimatedGas, locale) }) }
      </Alert>
    );
  }

  return null;
};

export default React.memo(ContractMethodResultPublicClient);
