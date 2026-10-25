// Modified by Quat Capital, 2026-10-25: runtime transaction localization. GPL-3.0.
import { HStack } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type * as tac from '@blockscout/tac-operation-lifecycle-types';

import { getTacOperationStage } from 'lib/operations/tac';
import { Tag } from 'toolkit/chakra/tag';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import OperationEntity from 'ui/shared/entities/operation/OperationEntity';
import TacOperationStatus from 'ui/shared/statusTag/TacOperationStatus';

interface Props {
  tacOperations: Array<tac.OperationDetails>;
  isLoading: boolean;
  txHash: string;
}

const TxDetailsTacOperation = ({ tacOperations, isLoading, txHash }: Props) => {
  const { t: tTx } = useTranslation();
  const [ hasScroll, setHasScroll ] = React.useState(false);

  return (
    <>
      <DetailedInfo.ItemLabel
        hint={ tTx('transactions.source_operation_hint_count', { count: tacOperations.length }) }
        isLoading={ isLoading }
        hasScroll={ hasScroll }
      >
        { tTx('transactions.source_operation', { count: tacOperations.length }) }
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValueWithScroll
        gradientHeight={ 48 }
        onScrollVisibilityChange={ setHasScroll }
        rowGap={ 3 }
        maxH="200px"
      >
        { tacOperations.map((tacOperation) => {
          const tags = [
            ...(getTacOperationStage(tacOperation, txHash) || []),
          ];

          return (
            <HStack key={ tacOperation.operation_id } rowGap={ 0 } columnGap={ 3 } flexWrap={{ base: 'wrap', lg: 'nowrap' }}>
              <OperationEntity
                id={ tacOperation.operation_id }
                type={ tacOperation.type }
                isLoading={ isLoading }
                my={{ base: '5px', lg: 0 }}
              />
              { tags.length > 0 && (
                <HStack flexShrink={ 0 } flexWrap="wrap" my={{ base: '3px', lg: 0 }}>
                  <TacOperationStatus status={ tacOperation.type } isLoading={ isLoading }/>
                  { tags.map((tag) => <Tag key={ tag } loading={ isLoading } flexShrink={ 0 }>{ tag }</Tag>) }
                </HStack>
              ) }
            </HStack>
          );
        }) }
      </DetailedInfo.ItemValueWithScroll>
    </>
  );
};

export default React.memo(TxDetailsTacOperation);
