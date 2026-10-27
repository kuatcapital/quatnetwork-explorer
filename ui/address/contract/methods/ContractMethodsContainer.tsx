// Modified by Quat Capital, 2026-10-27: complete runtime contract-interface localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { MethodType } from './types';

import { ContentLoader } from 'toolkit/components/loaders/ContentLoader';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

interface Props {
  isLoading?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
  type: MethodType;
  children: React.JSX.Element;
}

const ContractMethodsContainer = ({ isLoading, isError, isEmpty, type, children }: Props) => {
  const { t } = useTranslation();

  if (isLoading) {
    return <ContentLoader w="fit-content"/>;
  }

  if (isError) {
    return <DataFetchAlert/>;
  }

  if (isEmpty) {
    const text = (() => {
      if (type === 'read') return t('contracts.no_public_read');
      if (type === 'write') return t('contracts.no_public_write');
      return t('contracts.no_public_all');
    })();
    return <span>{ text }</span>;
  }

  return children;
};

export default React.memo(ContractMethodsContainer);
