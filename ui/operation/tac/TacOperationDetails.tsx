// Modified by Quat Capital, 2026-10-27: localized L2 and interop interface. GPL-3.0.
// Modified by Quat Capital, 2026-10-26: T18 reviewed literal localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type * as tac from '@blockscout/tac-operation-lifecycle-types';

import { sortStatusHistory } from 'lib/operations/tac';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import DetailedInfoTimestamp from 'ui/shared/DetailedInfo/DetailedInfoTimestamp';
import AddressEntityTacTon from 'ui/shared/entities/address/AddressEntityTacTon';
import TacOperationStatus from 'ui/shared/statusTag/TacOperationStatus';

import TacOperationLifecycleAccordion from './TacOperationLifecycleAccordion';

interface Props {
  isLoading?: boolean;
  data: tac.OperationDetails;
}

const TacOperationDetails = ({ isLoading, data }: Props) => {
  const { t: tQuat } = useTranslation();

  const statusHistory = data.status_history.filter((item) => item.is_exist).sort(sortStatusHistory);

  return (
    <DetailedInfo.Container
      templateColumns={{ base: 'minmax(0, 1fr)', lg: '210px minmax(728px, auto)' }}
    >
      { data?.sender && (
        <>
          <DetailedInfo.ItemLabel
            hint={ tQuat('l2Ui.sender_hint') }
            isLoading={ isLoading }
          >{ tQuat('l2Ui.sender') }</DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <AddressEntityTacTon
              address={{ hash: data.sender.address }}
              chainType={ data.sender.blockchain }
              isLoading={ isLoading }
            />
          </DetailedInfo.ItemValue>
        </>
      ) }

      <DetailedInfo.ItemLabel
        hint={ tQuat('l2Ui.operation_status_hint') }
        isLoading={ isLoading }
      >{ tQuat('l2Ui.status') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <TacOperationStatus status={ data.type } isLoading={ isLoading }/>
      </DetailedInfo.ItemValue>

      { data.timestamp && (
        <>
          <DetailedInfo.ItemLabel
            hint={ tQuat('l2Ui.operation_time_hint') }
            isLoading={ isLoading }
          >{ tQuat('l2Ui.timestamp') }</DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <DetailedInfoTimestamp timestamp={ data.timestamp } isLoading={ isLoading }/>
          </DetailedInfo.ItemValue>
        </>
      ) }

      { statusHistory.length > 0 && (
        <>
          <DetailedInfo.ItemLabel
            hint={ tQuat('l2Ui.lifecycle_hint') }
            isLoading={ isLoading }
          >{ tQuat('l2Ui.lifecycle') }</DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue mt={ 1 }>
            <TacOperationLifecycleAccordion data={ statusHistory } isLoading={ isLoading } type={ data.type }/>
          </DetailedInfo.ItemValue>
        </>
      ) }
    </DetailedInfo.Container>
  );
};

export default React.memo(TacOperationDetails);
