// Modified by Quat Capital, 2026-10-26: account interface localization. GPL-3.0.
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { AddressTag } from 'types/api/account';

import * as mixpanel from 'lib/mixpanel/index';
import FormModal from 'ui/shared/FormModal';

import AddressForm from './AddressForm';

type Props = {
  open: boolean;
  onOpenChange: ({ open }: { open: boolean }) => void;
  onSuccess: () => Promise<void>;
  data?: Partial<AddressTag>;
  pageType: string;
};

const AddressModal: React.FC<Props> = ({ open, onOpenChange, onSuccess, data, pageType }) => {
  const { t: tAcct } = useTranslation();
  const title = data?.id ? tAcct('accountUI.edit_address_tag') : tAcct('accountUI.new_address_tag');
  const text = !data?.id ? tAcct('accountUI.address_tag_help') : '';

  const [ isAlertVisible, setAlertVisible ] = useState(false);

  React.useEffect(() => {
    open && !data?.id && mixpanel.logEvent(
      mixpanel.EventTypes.PRIVATE_TAG,
      { Action: 'Form opened', 'Page type': pageType, 'Tag type': 'Address' },
    );
  }, [ data?.id, open, pageType ]);

  const handleSuccess = React.useCallback(() => {
    if (!data?.id) {
      mixpanel.logEvent(
        mixpanel.EventTypes.PRIVATE_TAG,
        { Action: 'Submit', 'Page type': pageType, 'Tag type': 'Address' },
      );
    }
    return onSuccess();
  }, [ data?.id, onSuccess, pageType ]);

  const renderForm = useCallback(() => {
    return <AddressForm data={ data } onOpenChange={ onOpenChange } onSuccess={ handleSuccess } setAlertVisible={ setAlertVisible }/>;
  }, [ data, onOpenChange, handleSuccess ]);
  return (
    <FormModal<AddressTag>
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

export default AddressModal;
