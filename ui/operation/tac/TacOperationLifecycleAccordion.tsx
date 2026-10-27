// Modified by Quat Capital, 2026-10-27: localized L2 and interop interface. GPL-3.0.
import { useTranslation } from 'react-i18next';
import React from 'react';

import * as tac from '@blockscout/tac-operation-lifecycle-types';

import { getTacOperationStageLabel } from 'lib/operations/tac';
import { Root, Item, Trigger } from 'ui/shared/lifecycle/LifecycleAccordion';

import TacOperationLifecycleAccordionItemContent from './TacOperationLifecycleAccordionItemContent';

interface Props {
  data: tac.OperationDetails['status_history'];
  isLoading?: boolean;
  type: tac.OperationType;
}

const TacOperationLifecycleAccordion = ({ data, isLoading, type }: Props) => {
  const { t: tQuat } = useTranslation();
  const isPending = type === tac.OperationType.PENDING && !isLoading;

  return (
    <Root>
      { data.map((item, index) => {
        const isLast = index === data.length - 1 && !isPending;
        return (
          <Item key={ index } value={ item.type }>
            <Trigger
              status={ item.is_success ? 'success' : 'error' }
              text={ getTacOperationStageLabel(item.type, tQuat) }
              isFirst={ index === 0 }
              isLast={ isLast }
              isLoading={ isLoading }
            />
            <TacOperationLifecycleAccordionItemContent
              isLast={ isLast }
              data={ item }
            />
          </Item>
        );
      }) }
      { isPending && (
        <Item value="pending">
          <Trigger
            status="pending"
            text={ tQuat('l2Ui.pending') }
            isFirst={ false }
            isLast={ true }
            isLoading={ isLoading }
            isDisabled
          />
        </Item>
      ) }
    </Root>
  );
};

export default React.memo(TacOperationLifecycleAccordion);
