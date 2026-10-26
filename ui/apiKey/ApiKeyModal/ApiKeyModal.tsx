// Modified by Quat Capital, 2026-10-26: account interface localization. GPL-3.0.
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { ApiKey } from 'types/api/account';

import FormModal from 'ui/shared/FormModal';

import ApiKeyForm from './ApiKeyForm';

type Props = {
  open: boolean;
  onOpenChange: ({ open }: { open: boolean }) => void;
  data?: ApiKey;
};

const ApiKeyModal: React.FC<Props> = ({ open, onOpenChange, data }) => {
  const { t: tAcct } = useTranslation();
  const title = data ? tAcct('accountUI.edit_api_key') : tAcct('accountUI.new_api_key');
  const text = !data ? tAcct('accountUI.api_key_help') : '';

  const [ isAlertVisible, setAlertVisible ] = useState(false);

  const renderForm = useCallback(() => {
    return <ApiKeyForm data={ data } onOpenChange={ onOpenChange } setAlertVisible={ setAlertVisible }/>;
  }, [ data, onOpenChange ]);
  return (
    <FormModal<ApiKey>
      open={ open }
      onOpenChange={ onOpenChange }
      title={ title }
      text={ text }
      renderForm={ renderForm }
      isAlertVisible={ isAlertVisible }
      setAlertVisible={ setAlertVisible }
    />
  );
};

export default ApiKeyModal;
