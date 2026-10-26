// Modified by Quat Capital, 2026-10-26: account interface localization. GPL-3.0.
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { CustomAbi } from 'types/api/account';

import FormModal from 'ui/shared/FormModal';

import CustomAbiForm, { type FormData } from './CustomAbiForm';

type Props = {
  open: boolean;
  onOpenChange: ({ open }: { open: boolean }) => void;
  onSuccess?: () => Promise<void>;
  data: FormData;
};

const CustomAbiModal: React.FC<Props> = ({ open, onOpenChange, data, onSuccess }) => {
  const { t: tAcct } = useTranslation();
  const title = data && 'id' in data ? tAcct('accountUI.edit_custom_abi') : tAcct('accountUI.new_custom_abi');
  const text = !(data && 'id' in data) ? tAcct('accountUI.custom_abi_help') : '';

  const [ isAlertVisible, setAlertVisible ] = useState(false);

  const renderForm = useCallback(() => {
    return <CustomAbiForm data={ data } onOpenChange={ onOpenChange } onSuccess={ onSuccess } setAlertVisible={ setAlertVisible }/>;
  }, [ data, onOpenChange, onSuccess ]);
  return (
    <FormModal<CustomAbi>
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

export default React.memo(CustomAbiModal);
