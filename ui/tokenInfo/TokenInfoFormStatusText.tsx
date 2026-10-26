// Modified by Quat Capital, 2026-10-26: marketplace, rewards or token info localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { TokenInfoApplication } from 'types/api/account';

import { Alert } from 'toolkit/chakra/alert';

interface Props {
  application?: TokenInfoApplication;
}

const TokenInfoFormStatusText = ({ application }: Props) => {
  const { t: tEco } = useTranslation();

  if (!application) {
    return null;
  }

  switch (application.status) {
    case 'IN_PROCESS': {
      return (
        <div>
          <div>{ tEco('tokenInfoUI.moderation') }</div>
          <Alert status="warning" mt={ 6 }>{ tEco('tokenInfoUI.in_progress') }</Alert>
        </div>
      );
    }

    case 'UPDATE_REQUIRED': {
      return (
        <div>
          { application.adminComments && <Alert status="warning" mt={ 6 }>{ application.adminComments }</Alert> }
        </div>
      );
    }

    case 'REJECTED': {
      return (
        <div>
          { application.adminComments && <Alert status="warning" mt={ 6 }>{ application.adminComments }</Alert> }
        </div>
      );
    }

    default:
      return null;
  }
};

export default React.memo(TokenInfoFormStatusText);
