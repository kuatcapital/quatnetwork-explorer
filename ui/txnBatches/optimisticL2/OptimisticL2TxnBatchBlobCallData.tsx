// Modified by Quat Capital, 2026-10-26: T18 reviewed literal localization. GPL-3.0.
import { GridItem } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { layerLabels } from 'lib/rollups/utils';
import DetailedInfoTimestamp from 'ui/shared/DetailedInfo/DetailedInfoTimestamp';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';

import OptimisticL2TxnBatchBlobWrapper from './OptimisticL2TxnBatchBlobWrapper';

interface Props {
  l1TxHashes: Array<string>;
  l1Timestamp: string;
  isLoading: boolean;
}

const OptimisticL2TxnBatchBlobCallData = ({ l1TxHashes, l1Timestamp, isLoading }: Props) => {
  const { t: tQuat } = useTranslation();

  return (
    <OptimisticL2TxnBatchBlobWrapper isLoading={ isLoading }>
      <GridItem fontWeight={ 600 }>{ tQuat('common.timestamp') }</GridItem>
      <GridItem overflow="hidden">
        <DetailedInfoTimestamp timestamp={ l1Timestamp } isLoading={ isLoading } flexWrap={{ base: 'wrap', lg: 'nowrap' }}/>
      </GridItem>
      <GridItem fontWeight={ 600 }>{ layerLabels.parent } txn hash{ l1TxHashes.length > 1 ? 'es' : '' }</GridItem>
      <GridItem overflow="hidden" display="flex" flexDir="column" rowGap={ 2 }>
        { l1TxHashes.map((hash) => <TxEntityL1 key={ hash } hash={ hash } noIcon/>) }
      </GridItem>
    </OptimisticL2TxnBatchBlobWrapper>

  );
};

export default React.memo(OptimisticL2TxnBatchBlobCallData);
