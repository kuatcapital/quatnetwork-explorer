// Modified by Quat Capital, 2026-10-27: complete runtime contract-interface localization. GPL-3.0.
// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import { chakra, Spinner, Box } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import type { UseWaitForTransactionReceiptReturnType } from 'wagmi';
import { useWaitForTransactionReceipt } from 'wagmi';

import type { FormSubmitResultWalletClient } from '../types';

import { route } from 'nextjs-routes';

import { Alert } from 'toolkit/chakra/alert';
import { Link } from 'toolkit/chakra/link';

import { localizeContractInteractionError } from '../../localization';
interface Props {
  data: FormSubmitResultWalletClient['data'];
  onSettle: () => void;
}

const ContractMethodResultWalletClient = ({ data, onSettle }: Props) => {
  const txHash = data && 'hash' in data ? data.hash as `0x${ string }` : undefined;
  const txInfo = useWaitForTransactionReceipt({
    hash: txHash,
  });

  return <ContractMethodResultWalletClientDumb data={ data } onSettle={ onSettle } txInfo={ txInfo }/>;
};

export interface PropsDumb {
  data: FormSubmitResultWalletClient['data'];
  onSettle: () => void;
  txInfo: UseWaitForTransactionReceiptReturnType;
}

export const ContractMethodResultWalletClientDumb = ({ data, onSettle, txInfo }: PropsDumb) => {
  const { t: tQuat } = useTranslation();

  const txHash = data && 'hash' in data ? data.hash : undefined;

  React.useEffect(() => {
    if (txInfo.status !== 'pending') {
      onSettle();
    }
  }, [ onSettle, txInfo.status ]);

  if (!data) {
    return null;
  }

  const isErrorResult = 'message' in data;

  const txLink = txHash ? (
    <Link href={ route({ pathname: '/tx/[hash]', query: { hash: txHash } }) }>{ tQuat('contracts.transaction_details') }</Link>
  ) : null;

  const content = (() => {
    if (isErrorResult) {
      return (
        <Alert status="error" textStyle="sm">
          { localizeContractInteractionError(data, tQuat) }
        </Alert>
      );
    }

    switch (txInfo.status) {
      case 'success': {
        return (
          <>
            <span>{ tQuat('contracts.transaction_confirmed') }{ ' ' }</span>
            { txLink }
          </>
        );
      }

      case 'pending': {
        return (
          <>
            <Spinner size="sm" mr={ 3 }/>
            <chakra.span verticalAlign="text-bottom">
              { tQuat('contracts.awaiting_confirmation') }
              { txLink }
            </chakra.span>
          </>
        );
      }

      case 'error': {
        return (
          <Alert status="error" textStyle="sm" descriptionProps={{ flexDir: 'column', alignItems: 'flex-start', rowGap: 1 }}>
            { tQuat('contracts.error_label') }{ ' ' }
            { txInfo.error ? txInfo.error.message : tQuat('contracts.unexpected_error') } { txLink }
          </Alert>
        );
      }
    }
  })();

  return (
    <Box
      textStyle="sm"
      alignItems="center"
      whiteSpace="pre-wrap"
      wordBreak="break-all"
    >
      { content }
    </Box>
  );
};

export default React.memo(ContractMethodResultWalletClient);
