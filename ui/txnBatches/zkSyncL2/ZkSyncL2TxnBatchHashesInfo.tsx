// Modified by Quat Capital, 2026-10-27: localized L2 and interop interface. GPL-3.0.
// Modified by Quat Capital, 2026-10-26: T18 reviewed literal localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { ZkSyncBatch } from 'types/api/zkSyncL2';

import { layerLabels } from 'lib/rollups/utils';
import { Skeleton } from 'toolkit/chakra/skeleton';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import DetailedInfoTimestamp from 'ui/shared/DetailedInfo/DetailedInfoTimestamp';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';

interface Props {
  isLoading: boolean;
  data: Pick<
    ZkSyncBatch,
  'commit_transaction_hash' |
  'commit_transaction_timestamp' |
  'prove_transaction_hash' |
  'prove_transaction_timestamp' |
  'execute_transaction_hash' |
  'execute_transaction_timestamp'
  >;
}

const ZkSyncL2TxnBatchHashesInfo = ({ isLoading, data }: Props) => {
  const { t: tQuat } = useTranslation();

  return (
    <>
      <DetailedInfo.ItemLabel
        hint={ tQuat('l2Ui.commit_hash_hint', { parent: layerLabels.parent }) }
        isLoading={ isLoading }
      >{ tQuat('l2Ui.commit_tx_hash') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue multiRow >
        { data.commit_transaction_hash ? (
          <>
            <TxEntityL1
              isLoading={ isLoading }
              hash={ data.commit_transaction_hash }
              maxW="100%"
            />
            { data.commit_transaction_timestamp && (
              <DetailedInfoTimestamp timestamp={ data.commit_transaction_timestamp } isLoading={ isLoading }/>
            ) }
          </>
        ) : <Skeleton loading={ isLoading }>{ tQuat('common.pending') }</Skeleton> }
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint={ tQuat('l2Ui.prove_hash_hint', { parent: layerLabels.parent }) }
        isLoading={ isLoading }
      >{ tQuat('l2Ui.prove_tx_hash') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue multiRow>
        { data.prove_transaction_hash ? (
          <>
            <TxEntityL1
              isLoading={ isLoading }
              hash={ data.prove_transaction_hash }
              maxW="100%"
            />
            { data.prove_transaction_timestamp && (
              <DetailedInfoTimestamp timestamp={ data.prove_transaction_timestamp } isLoading={ isLoading }/>
            ) }
          </>
        ) : <Skeleton loading={ isLoading }>{ tQuat('common.pending') }</Skeleton> }
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint={ tQuat('l2Ui.execute_hash_hint', { parent: layerLabels.parent }) }
        isLoading={ isLoading }
      >{ tQuat('l2Ui.execute_tx_hash') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue multiRow>
        { data.execute_transaction_hash ? (
          <>
            <TxEntityL1
              isLoading={ isLoading }
              hash={ data.execute_transaction_hash }
              maxW="100%"
            />
            { data.execute_transaction_timestamp && (
              <DetailedInfoTimestamp timestamp={ data.execute_transaction_timestamp } isLoading={ isLoading }/>
            ) }
          </>
        ) : <Skeleton loading={ isLoading }>{ tQuat('common.pending') }</Skeleton> }
      </DetailedInfo.ItemValue>
    </>
  );
};

export default React.memo(ZkSyncL2TxnBatchHashesInfo);
