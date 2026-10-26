// Modified by Quat Capital, 2026-10-26: localize shared controls, details and data feedback. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import StatusTag from 'ui/shared/statusTag/StatusTag';

type Props = {
  status?: boolean;
  isLoading?: boolean;
};

const UserOpStatus = ({ status, isLoading }: Props) => {
  const { t } = useTranslation();
  if (status === undefined) {
    return null;
  }

  return (
    <StatusTag loading={ isLoading } type={ status === true ? 'ok' : 'error' } text={ status === true ? t('common.success') : t('common.failed') }/>
  );
};

export default UserOpStatus;
