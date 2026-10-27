// Modified by Quat Capital, 2026-10-27: localized L2 and interop interface. GPL-3.0.
// Modified by Quat Capital, 2026-10-26: T18 reviewed literal localization. GPL-3.0.
import { Box } from '@chakra-ui/react';
import React from 'react';

import * as tac from '@blockscout/tac-operation-lifecycle-types';

import DetailedInfoTimestamp from 'ui/shared/DetailedInfo/DetailedInfoTimestamp';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TxEntityTon from 'ui/shared/entities/tx/TxEntityTon';
import { ItemContent, ItemBody, ItemRow } from 'ui/shared/lifecycle/LifecycleAccordion';
import StatusTag from 'ui/shared/statusTag/StatusTag';
import { useTranslation } from 'react-i18next';


interface Props {
  isLast: boolean;
  data: tac.OperationStage;
}

const TacOperationLifecycleAccordionItemContent = ({ isLast, data }: Props) => {
  const { t: tQuat } = useTranslation();

  return (
    <ItemContent isLast={ isLast }>
      <ItemBody>
        <ItemRow label={ tQuat('l2Ui.status') }>
          <StatusTag type={ data.is_success ? 'ok' : 'error' } text={ data.is_success ? tQuat('l2Ui.success') : tQuat('l2Ui.failed') } my={ 1 }/>
        </ItemRow>

        { data.timestamp && (
          <ItemRow label={ tQuat('l2Ui.timestamp') }>
            <DetailedInfoTimestamp timestamp={ data.timestamp } isLoading={ false } flexWrap={{ base: 'wrap', lg: 'nowrap' }} py="6px"/>
          </ItemRow>
        ) }

        { data.transactions.length > 0 && (
          <ItemRow label={ tQuat('l2Ui.transactions') }>
            <Box
              display="flex"
              flexDirection="column"
              rowGap={ 3 }
              py="6px"
              width="100%"
              overflow="hidden"
            >
              {
                data.transactions.map((tx) => {
                  if (tx.type === tac.BlockchainType.TON) {
                    return <TxEntityTon key={ tx.hash } hash={ tx.hash }/>;
                  }

                  return <TxEntity key={ tx.hash } hash={ tx.hash } icon={{ name: 'brands/tac' }}/>;
                })
              }
            </Box>
          </ItemRow>
        ) }

        { data.note && (
          <ItemRow label={ tQuat('l2Ui.note') }>
            <Box
              display="inline-flex"
              alignItems="center"
              py="6px"
              whiteSpace="pre-wrap"
              wordBreak="break-word"
            >
              { data.note }
            </Box>
          </ItemRow>
        ) }
      </ItemBody>
    </ItemContent>
  );
};

export default React.memo(TacOperationLifecycleAccordionItemContent);
