// Modified by Quat Capital, 2026-10-26: known withdrawal status labels; unknown API text unchanged. GPL-3.0.
import { useQueryClient } from '@tanstack/react-query';
import type { TFunction } from 'i18next';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { OptimisticL2WithdrawalsItem, OptimisticL2WithdrawalsResponse } from 'types/api/optimisticL2';

import { getResourceKey } from 'lib/api/useApiQuery';
import { Skeleton } from 'toolkit/chakra/skeleton';

import OptimisticL2ClaimButton from './OptimisticL2ClaimButton';

interface Props {
  data: OptimisticL2WithdrawalsItem;
  isLoading?: boolean;
}

const OptimisticL2WithdrawalsItemStatus = ({ data, isLoading }: Props) => {
  const { t } = useTranslation();

  const queryClient = useQueryClient();

  const handleClaimSuccess = React.useCallback((l1TxHash: string) => {
    queryClient.setQueriesData({
      queryKey: getResourceKey('general:optimistic_l2_withdrawals'),
      exact: false,
      type: 'active',
    },
    (prevData: OptimisticL2WithdrawalsResponse | undefined) => {
      if (!prevData) {
        return;
      }

      const newItems = prevData.items.map((withdrawal) => {
        if (`${ withdrawal.msg_nonce_version }-${ withdrawal.msg_nonce }` === `${ data.msg_nonce_version }-${ data.msg_nonce }`) {
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
        items: newItems,
      };
    });
  }, [ data.msg_nonce, data.msg_nonce_version, queryClient ]);

  if (data.status !== 'Ready for relay') {
    return <Skeleton loading={ isLoading } display="inline-block">{ statusLabel(data.status, t) }</Skeleton>;
  }

  return <OptimisticL2ClaimButton data={ data } from={ data.from } onSuccess={ handleClaimSuccess } source="list"/>;
};

export default React.memo(OptimisticL2WithdrawalsItemStatus);

function statusLabel(status: string, t: TFunction): string {
  switch (status) {
    case 'Waiting for state root': return t('networkTransfers.waiting_state_root');
    case 'Ready to prove': return t('networkTransfers.ready_prove');
    case 'In challenge period': return t('networkTransfers.challenge_period');
    case 'Waiting a game to resolve': return t('networkTransfers.waiting_game');
    case 'Proven': return t('networkTransfers.proven');
    case 'Ready for relay': return t('networkTransfers.ready');
    case 'Relayed': return t('networkTransfers.relayed');
    default: return status;
  }
}
