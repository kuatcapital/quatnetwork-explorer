// Modified by Quat Capital, 2026-10-26: account interface localization. GPL-3.0.
import { chakra } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { TokenInfoApplication } from 'types/api/account';

interface Props {
  status?: TokenInfoApplication['status'];
}

const VerifiedAddressesStatus = ({ status }: Props) => {
  const { t: tAcct } = useTranslation();
  switch (status) {
    case 'IN_PROCESS': {
      return <chakra.span fontWeight={ 500 }>{ tAcct('accountUI.in_progress') }</chakra.span>;
    }
    case 'APPROVED': {
      return <chakra.span fontWeight={ 500 } color="green.500">{ tAcct('accountUI.approved') }</chakra.span>;
    }
    case 'UPDATE_REQUIRED': {
      return <chakra.span fontWeight={ 500 } color="orange.500">{ tAcct('accountUI.waiting_update') }</chakra.span>;
    }
    case 'REJECTED': {
      return <chakra.span fontWeight={ 500 } color="red.500">{ tAcct('accountUI.rejected') }</chakra.span>;
    }

    default:
      return null;
  }
};

export default VerifiedAddressesStatus;
