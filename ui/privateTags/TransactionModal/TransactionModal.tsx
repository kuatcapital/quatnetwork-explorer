// Modified by Quat Capital, 2026-10-26: account interface localization. GPL-3.0.
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { TransactionTag } from 'types/api/account';

import { PAGE_TYPE_DICT } from 'lib/mixpanel/getPageType';
import * as mixpanel from 'lib/mixpanel/index';
import FormModal from 'ui/shared/FormModal';

import TransactionForm from './TransactionForm';

type Props = {
  open: boolean;
  onOpenChange: ({ open }: { open: boolean }) => void;
  onSuccess?: () => Promise<void>;
  data?: Partial<TransactionTag>;
};

const TransactionModal: React.FC<Props> = ({ open, onOpenChange, onSuccess, data }) => {
  const { t: tAcct } = useTranslation();
  const title = data ? tAcct('accountUI.edit_transaction_tag') : tAcct('accountUI.new_transaction_tag');
  const text = !data ? tAcct('accountUI.transaction_tag_help') : '';

  const [ isAlertVisible, setAlertVisible ] = useState(false);

  React.useEffect(() => {
    open && !data?.id && mixpanel.logEvent(
      mixpanel.EventTypes.PRIVATE_TAG,
      { Action: 'Form opened', 'Page type': PAGE_TYPE_DICT['/account/tag-address'], 'Tag type': 'Tx' },
    );
  }, [ data?.id, open ]);

  const handleSuccess = React.useCallback(async() => {
    onSuccess?.();
    if (!data?.id) {
      mixpanel.logEvent(
        mixpanel.EventTypes.PRIVATE_TAG,
        { Action: 'Submit', 'Page type': PAGE_TYPE_DICT['/account/tag-address'], 'Tag type': 'Tx' },
      );
    }
  }, [ data?.id, onSuccess ]);

  const renderForm = useCallback(() => {
    return <TransactionForm data={ data } onOpenChange={ onOpenChange } onSuccess={ handleSuccess } setAlertVisible={ setAlertVisible }/>;
  }, [ data, handleSuccess, onOpenChange ]);
  return (
    <FormModal<TransactionTag>
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

export default TransactionModal;
