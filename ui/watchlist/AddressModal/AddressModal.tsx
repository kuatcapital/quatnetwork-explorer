// Modified by Quat Capital, 2026-10-26: account interface localization. GPL-3.0.
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { WatchlistAddress } from 'types/api/account';

import FormModal from 'ui/shared/FormModal';

import AddressForm from './AddressForm';

type Props = {
  isAdd: boolean;
  open: boolean;
  onOpenChange: ({ open }: { open: boolean }) => void;
  onSuccess: () => Promise<void>;
  data?: Partial<WatchlistAddress>;
  hasEmail: boolean;
  showEmailAlert?: boolean;
};

const AddressModal: React.FC<Props> = ({ open, onOpenChange, onSuccess, data, isAdd, hasEmail, showEmailAlert }) => {
  const { t: tAcct } = useTranslation();
  const title = !isAdd ? tAcct('accountUI.edit_watchlist_address') : tAcct('accountUI.new_watchlist_address');
  const text = isAdd ? tAcct('accountUI.watchlist_description') : '';

  const [ isAlertVisible, setAlertVisible ] = useState(false);

  const renderForm = useCallback(() => {
    return (
      <AddressForm
        data={ data }
        onSuccess={ onSuccess }
        setAlertVisible={ setAlertVisible }
        isAdd={ isAdd }
        hasEmail={ hasEmail }
        showEmailAlert={ showEmailAlert }
      />
    );
  }, [ data, isAdd, onSuccess, hasEmail, showEmailAlert ]);

  return (
    <FormModal<WatchlistAddress>
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
