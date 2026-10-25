// Modified by Quat Capital, 2026-10-25: runtime transaction interface localization. GPL-3.0.
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { AddressParam } from 'types/api/addressParams';
import type { OptimisticL2WithdrawalStatus } from 'types/api/optimisticL2';
import type { OpWithdrawal, Transaction } from 'types/api/transaction';

import config from 'configs/app';
import { getResourceKey } from 'lib/api/useApiQuery';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import VerificationSteps from 'ui/shared/verificationSteps/VerificationSteps';
import OptimisticL2ClaimButton, { canClaimDirectlyGuard } from 'ui/withdrawals/optimisticL2/OptimisticL2ClaimButton';

interface Props {
  data: OpWithdrawal;
  from: AddressParam;
  txHash: string;
}

const WITHDRAWAL_STATUS_STEPS: Array<OptimisticL2WithdrawalStatus> = [
  'Waiting for state root',
  'Ready to prove',
  'In challenge period',
  'Ready for relay',
  'Relayed',
];

const WITHDRAWAL_STATUS_ORDER_PROVEN: Array<OptimisticL2WithdrawalStatus> = [
  'Waiting for state root',
  'Ready to prove',
  'Proven',
  'Relayed',
];

const WITHDRAWAL_STATUS_ORDER_GAME: Array<OptimisticL2WithdrawalStatus> = [
  'Waiting for state root',
  'Ready to prove',
  'Waiting a game to resolve',
  'In challenge period',
  'Ready for relay',
  'Relayed',
];

const rollupFeature = config.features.rollup;
const WITHDRAWAL_STATUS_KEYS: Record<string, string> = {
  'Waiting for state root': 'transactions.waiting_state_root',
  'Ready to prove': 'transactions.ready_prove',
  'In challenge period': 'transactions.challenge_period',
  'Ready for relay': 'transactions.ready_relay',
  'Waiting a game to resolve': 'transactions.waiting_dispute',
  Proven: 'transactions.proven',
  Relayed: 'transactions.relayed',
};

const TxDetailsWithdrawalStatusOptimistic = ({ data, from, txHash }: Props) => {
  const { t: tTx } = useTranslation();
  const queryClient = useQueryClient();

  const handleClaimSuccess = React.useCallback((l1TxHash: string) => {
    queryClient.setQueryData(
      getResourceKey('general:tx', { pathParams: { hash: txHash } }),
      (prevData: Transaction | undefined) => {
        if (!prevData) {
          return;
        }

        const newWithdrawals = prevData.op_withdrawals?.map((withdrawal) => {
          if (withdrawal.nonce === data.nonce) {
            return {
              ...withdrawal,
              l1_transaction_hash: l1TxHash,
              status: 'Relayed',
            };
          }
          return withdrawal;
        });

        return {
          ...prevData,
          op_withdrawals: newWithdrawals,
        };
      });
  }, [ data.nonce, queryClient, txHash ]);

  if (!data.status || !rollupFeature.isEnabled || rollupFeature.type !== 'optimistic') {
    return null;
  }

  const canClaimDirectly = canClaimDirectlyGuard(data);
  const hasRightSlot = data.status === 'Ready for relay' && (rollupFeature.L2WithdrawalUrl || canClaimDirectly);

  const rightSlot = hasRightSlot ?
    <OptimisticL2ClaimButton data={ data } from={ from } onSuccess={ handleClaimSuccess } source="tx"/> :
    null;

  const steps = (() => {
    switch (data.status) {
      case 'Ready for relay':
        return hasRightSlot ? WITHDRAWAL_STATUS_STEPS.slice(0, -1) : WITHDRAWAL_STATUS_STEPS;
      case 'Proven':
        return WITHDRAWAL_STATUS_ORDER_PROVEN;
      case 'Waiting a game to resolve':
        return WITHDRAWAL_STATUS_ORDER_GAME;
      case 'Relayed': {
        if (data.l1_transaction_hash) {
          return WITHDRAWAL_STATUS_STEPS.map((status) => {
            return status === 'Relayed' ? {
              content: <TxEntityL1 hash={ data.l1_transaction_hash } truncation="constant" text={ tTx('transactions.relayed') } noIcon noCopy/>,
              label: status,
            } : status;
          });
        }

        return WITHDRAWAL_STATUS_STEPS;
      }

      default:
        return WITHDRAWAL_STATUS_STEPS;
    }
  })();

  const localizedSteps = steps.map(step => typeof step === 'string' ? {
    label: step,
    content: tTx(WITHDRAWAL_STATUS_KEYS[step]),
  } : step);

  return (
    <VerificationSteps
      steps={ localizedSteps }
      currentStep={ data.status }
      rightSlot={ rightSlot }
    />
  );
};

export default React.memo(TxDetailsWithdrawalStatusOptimistic);
