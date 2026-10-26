// Modified by Quat Capital, 2026-10-26: localize shared controls, details and data feedback. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import * as DetailedInfo from './DetailedInfo';

export const TX_ACTIONS_BLOCK_ID = 'tx-actions';

type Props = {
  children: React.ReactNode;
  isLoading?: boolean;
  type: 'tx' | 'user_op';
};

const DetailedInfoActionsWrapper = ({ children, isLoading, type }: Props) => {
  const { t } = useTranslation();
  const [ hasScroll, setHasScroll ] = React.useState(false);

  return (
    <>
      <DetailedInfo.ItemLabel
        id={ TX_ACTIONS_BLOCK_ID }
        hint={ type === 'tx' ? t('sharedUi.transaction_events') : t('sharedUi.operation_events') }
        isLoading={ isLoading }
        hasScroll={ hasScroll }
      >
        <span>{ type === 'tx' ? t('sharedUi.transaction_action') : t('sharedUi.operation_action') }</span>
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValueWithScroll
        gradientHeight={ 48 }
        onScrollVisibilityChange={ setHasScroll }
        alignItems="stretch"
        rowGap={ 5 }
        w="100%"
        maxH="200px"
      >
        { children }
      </DetailedInfo.ItemValueWithScroll>

    </>
  );
};

export default React.memo(DetailedInfoActionsWrapper);
