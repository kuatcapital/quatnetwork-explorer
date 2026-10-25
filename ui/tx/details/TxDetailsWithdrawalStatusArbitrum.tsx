// Modified by Quat Capital, 2026-10-25: runtime transaction interface localization. GPL-3.0.
import { Text } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { ArbitrumTransactionMessageStatus, Transaction } from 'types/api/transaction';

import { route } from 'nextjs-routes';

import { layerLabels } from 'lib/rollups/utils';
import { Link } from 'toolkit/chakra/link';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import VerificationSteps from 'ui/shared/verificationSteps/VerificationSteps';

const WITHDRAWAL_STATUS_STEPS: Array<ArbitrumTransactionMessageStatus> = [
  'Syncing with base layer',
  'Settlement pending',
  'Waiting for confirmation',
  'Ready for relay',
  'Relayed',
];

const WITHDRAWAL_STATUS_KEYS: Record<string, string> = {
  'Syncing with base layer': 'transactions.syncing_base_layer',
  'Settlement pending': 'transactions.settlement_pending',
  'Waiting for confirmation': 'transactions.waiting_confirmation',
  'Ready for relay': 'transactions.ready_relay',
  Relayed: 'transactions.relayed',
};

interface Props {
  data: Transaction;
}

const TxDetailsWithdrawalStatusArbitrum = ({ data }: Props) => {
  const { t: tTx } = useTranslation();

  const steps = React.useMemo(() => {
    if (!data.arbitrum?.message_related_info) {
      return [];
    }

    switch (data.arbitrum.message_related_info.message_status) {
      case 'Ready for relay':
      case 'Relayed': {
        const lastElementIndex = data.arbitrum.message_related_info.message_status === 'Relayed' ? Infinity : -1;

        return WITHDRAWAL_STATUS_STEPS.slice(0, lastElementIndex).map((step, index, array) => {
          if (index !== array.length - 1) {
            return { label: step, content: tTx(WITHDRAWAL_STATUS_KEYS[step]) };
          }

          return {
            content: (
              <Link
                href={ route({ pathname: '/txn-withdrawals', query: { q: data.hash } }) }
              >
                { tTx(WITHDRAWAL_STATUS_KEYS[step]) }
              </Link>
            ),
            label: step,
          };
        });
      }

      default:
        return WITHDRAWAL_STATUS_STEPS.map(step => ({ label: step, content: tTx(WITHDRAWAL_STATUS_KEYS[step]) }));
    }
  }, [ data.arbitrum?.message_related_info, data.hash, tTx ]);

  if (!data.arbitrum || !data.arbitrum?.contains_message || !data.arbitrum?.message_related_info) {
    return null;
  }

  if (data.arbitrum.contains_message === 'outcoming') {
    return (
      <>
        <DetailedInfo.ItemLabel
          hint={ tTx('transactions.progress_hint') }
        >
          { tTx('transactions.withdrawal_status') }</DetailedInfo.ItemLabel>
        <DetailedInfo.ItemValue>
          { data.arbitrum.message_related_info.message_status ? (
            <VerificationSteps
              steps={ steps }
              currentStep={ data.arbitrum.message_related_info.message_status }
            />
          ) : <Text color="text.secondary">{ tTx('transactions.could_not_determine') }</Text> }
        </DetailedInfo.ItemValue>
      </>
    );
  }
  return (
    <>
      <DetailedInfo.ItemLabel
        hint={ tTx('transactions.originating_hash_hint') }
      >
        { tTx('transactions.originating_hash', { layer: layerLabels.parent }) }
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        { data.arbitrum.message_related_info.associated_l1_transaction_hash ?
          <TxEntityL1 hash={ data.arbitrum.message_related_info.associated_l1_transaction_hash }/> :
          <Text color="text.secondary">{ tTx('transactions.waiting_confirmation') }</Text>
        }
      </DetailedInfo.ItemValue>
    </>
  );
};

export default React.memo(TxDetailsWithdrawalStatusArbitrum);
