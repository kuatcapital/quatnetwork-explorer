// Modified by Quat Capital, 2026-10-25: runtime transaction interface localization. GPL-3.0.
import { Box, Text } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { Transaction } from 'types/api/transaction';

import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import TextSeparator from 'ui/shared/TextSeparator';

type Props = Pick<Transaction, 'nonce' | 'type' | 'position'> & { queueIndex?: number };

const TxDetailsOther = ({ nonce, type, position, queueIndex }: Props) => {
  const { t: tTx } = useTranslation();
  return (
    <>
      <DetailedInfo.ItemLabel
        hint={ tTx('transactions.other_hint') }
      >
        { tTx('transactions.other') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue multiRow>
        {
          [
            typeof type === 'number' && (
              <Box key="type">
                <span>{ tTx('transactions.txn_type_label') }{ ' ' }</span>
                <span>{ type }</span>
                { type === 2 && <Text as="span" ml={ 1 } color="text.secondary">(EIP-1559)</Text> }
                { type === 3 && <Text as="span" ml={ 1 } color="text.secondary">(EIP-4844)</Text> }
                { type === 4 && <Text as="span" ml={ 1 } color="text.secondary">(EIP-7702)</Text> }
              </Box>
            ),
            queueIndex !== undefined ? (
              <Box key="queueIndex">
                <span>{ tTx('transactions.queue_index_label') }{ ' ' }</span>
                <span>{ queueIndex }</span>
              </Box>
            ) : (
              <Box key="nonce">
                <span>{ tTx('transactions.nonce_label') }{ ' ' }</span>
                <span>{ nonce }</span>
              </Box>
            ),
            position !== null && position !== undefined && (
              <Box key="position">
                <span>{ tTx('transactions.position_label') }{ ' ' }</span>
                <span>{ position }</span>
              </Box>
            ),
          ]
            .filter(Boolean)
            .map((item, index) => (
              <React.Fragment key={ index }>
                { index !== 0 && <TextSeparator/> }
                { item }
              </React.Fragment>
            ))
        }
      </DetailedInfo.ItemValue>
    </>
  );
};

export default TxDetailsOther;
