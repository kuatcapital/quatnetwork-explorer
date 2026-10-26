// Modified by Quat Capital, 2026-10-26: T18 reviewed literal localization. GPL-3.0.
import { Flex, GridItem, VStack } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { OptimisticL2BlobTypeCelestia } from 'types/api/optimisticL2';

import { layerLabels } from 'lib/rollups/utils';
import CeleniumLink from 'ui/shared/batch/CeleniumLink';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import DetailedInfoTimestamp from 'ui/shared/DetailedInfo/DetailedInfoTimestamp';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';

import OptimisticL2TxnBatchBlobWrapper from './OptimisticL2TxnBatchBlobWrapper';

interface Props {
  blobs: Array<OptimisticL2BlobTypeCelestia>;
  isLoading: boolean;
}

const OptimisticL2TxnBatchBlobCelestia = ({ blobs, isLoading }: Props) => {
  const { t: tQuat } = useTranslation();

  return (
    <VStack rowGap={ 2 } w="100%">
      { blobs.map((blob) => {
        return (
          <OptimisticL2TxnBatchBlobWrapper key={ blob.commitment } isLoading={ isLoading } gridTemplateColumns="auto 1fr auto">
            <GridItem fontWeight={ 600 }>{ tQuat('blobUI.commitment') }</GridItem>
            <GridItem overflow="hidden">
              <Flex minW="0" w="calc(100% - 20px)">
                <HashStringShortenDynamic hash={ blob.commitment }/>
                <CopyToClipboard text={ blob.commitment }/>
              </Flex>
            </GridItem>
            <CeleniumLink commitment={ blob.commitment } namespace={ blob.namespace } height={ blob.height } fallback={ <GridItem/> }/>
            <GridItem fontWeight={ 600 }>Height</GridItem>
            <GridItem colSpan={ 2 }>
              { blob.height }
            </GridItem>
            <GridItem fontWeight={ 600 }>{ tQuat('common.timestamp') }</GridItem>
            <GridItem overflow="hidden" colSpan={ 2 }>
              <DetailedInfoTimestamp timestamp={ blob.l1_timestamp } isLoading={ isLoading } flexWrap={{ base: 'wrap', lg: 'nowrap' }}/>
            </GridItem>
            <GridItem fontWeight={ 600 }>{ layerLabels.parent } txn hash</GridItem>
            <GridItem overflow="hidden" colSpan={ 2 }>
              <TxEntityL1 hash={ blob.l1_transaction_hash } noIcon/>
            </GridItem>
          </OptimisticL2TxnBatchBlobWrapper>
        );
      }) }
    </VStack>

  );
};

export default React.memo(OptimisticL2TxnBatchBlobCelestia);
