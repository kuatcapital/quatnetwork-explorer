// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Alert } from 'toolkit/chakra/alert';

interface Props {
  isLoading?: boolean;
}

const ContractCustomAbiAlert = ({ isLoading }: Props) => {
  const { t: tQuat } = useTranslation();

  return (
    <Alert status="warning" loading={ isLoading }>{ tQuat('contracts.custom_abi_warning') }</Alert>
  );
};

export default React.memo(ContractCustomAbiAlert);
