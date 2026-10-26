// Modified by Quat Capital, 2026-10-26: localize validators, epochs and transfers. GPL-3.0.
import { chakra } from '@chakra-ui/react';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { Abi } from 'viem';
import { useSwitchChain, useWaitForTransactionReceipt, useWalletClient } from 'wagmi';

import type { OptimisticL2WithdrawalClaimInfo } from 'types/api/optimisticL2';

import config from 'configs/app';
import capitalizeFirstLetter from 'lib/capitalizeFirstLetter';
import getErrorMessage from 'lib/errors/getErrorMessage';
import getErrorObjPayload from 'lib/errors/getErrorObjPayload';
import getErrorProp from 'lib/errors/getErrorProp';
import useWeb3Wallet from 'lib/web3/useWallet';
import { Button } from 'toolkit/chakra/button';
import { DialogBody, DialogContent, DialogHeader, DialogRoot } from 'toolkit/chakra/dialog';
import { toaster } from 'toolkit/chakra/toaster';
import { FormFieldAddress } from 'toolkit/components/forms/fields/FormFieldAddress';

const rollupFeature = config.features.rollup;
const parentChain = rollupFeature.isEnabled ? rollupFeature.parentChain : undefined;

const FINALIZE_WITHDRAWAL_ABI = {
  inputs: [
    {
      components: [
        { internalType: 'uint256', name: 'nonce', type: 'uint256' },
        { internalType: 'address', name: 'sender', type: 'address' },
        { internalType: 'address', name: 'target', type: 'address' },
        { internalType: 'uint256', name: 'value', type: 'uint256' },
        { internalType: 'uint256', name: 'gasLimit', type: 'uint256' },
        { internalType: 'bytes', name: 'data', type: 'bytes' },
      ],
      internalType: 'struct Types.WithdrawalTransaction',
      name: '_tx',
      type: 'tuple',
    },
    { internalType: 'address', name: '_proofSubmitter', type: 'address' },
  ],
  name: 'finalizeWithdrawalTransactionExternalProof',
  outputs: [],
  stateMutability: 'nonpayable',
  type: 'function',
};

interface FormFields {
  address: string;
}

interface Props {
  data: OptimisticL2WithdrawalClaimInfo;
  onOpenChange: ({ open }: { open: boolean }) => void;
  proofSubmitterAddress?: string;
  onSuccess: (txHash: string) => void;
}

const OptimisticL2ClaimModal = ({ data, onOpenChange, proofSubmitterAddress, onSuccess }: Props) => {
  const { t } = useTranslation();

  const [ txHash, setTxHash ] = React.useState<`0x${ string }` | undefined>(undefined);

  const { connect: connectWeb3Wallet, isConnected: isWeb3WalletConnected, isOpen: isWeb3WalletOpen } = useWeb3Wallet({ source: 'Smart contracts' });
  const { switchChainAsync } = useSwitchChain();
  const { data: walletClient } = useWalletClient({ chainId: parentChain?.id ? Number(parentChain.id) : undefined });

  const { status: txStatus, error: txError, isLoading: isTxPending } = useWaitForTransactionReceipt({
    hash: txHash,
    chainId: parentChain?.id ? Number(parentChain.id) : undefined,
    query: { enabled: Boolean(txHash) },
  });

  const formApi = useForm<FormFields>({
    mode: 'onBlur',
    defaultValues: {
      address: proofSubmitterAddress,
    },
  });

  const showErrorToast = React.useCallback((error: unknown) => {
    const apiError = getErrorObjPayload<{ message: string }>(error);
    const errorMessage = apiError?.message || getErrorProp(error, 'shortMessage') || getErrorMessage(error) || t('networkTransfers.unexpected_error');
    const message = capitalizeFirstLetter(errorMessage);
    toaster.error({
      title: t('networkTransfers.error'),
      description: message,
    });
  }, [ t ]);

  const onFormSubmit: SubmitHandler<FormFields> = React.useCallback(async(formData) => {
    try {
      if (!rollupFeature.isEnabled || !parentChain) {
        throw new Error(t('networkTransfers.feature_disabled'));
      }

      await switchChainAsync({ chainId: Number(parentChain.id) });

      if (!walletClient) {
        throw new Error(t('networkTransfers.wallet_undefined'));
      }

      if (
        data.portal_contract_address_hash === null ||
        data.msg_sender_address_hash === null ||
        data.msg_target_address_hash === null ||
        data.msg_data === null ||
        data.msg_gas_limit === null ||
        data.msg_nonce_raw === null ||
        data.msg_value === null
      ) {
        throw new Error(t('networkTransfers.invalid_data'));
      }

      const args = [
        [
          data.msg_nonce_raw,
          data.msg_sender_address_hash,
          data.msg_target_address_hash,
          data.msg_value,
          data.msg_gas_limit,
          data.msg_data,
        ],
        formData.address,
      ];

      const hash = await walletClient.writeContract({
        args,
        abi: [ FINALIZE_WITHDRAWAL_ABI ] as Abi,
        functionName: FINALIZE_WITHDRAWAL_ABI.name,
        address: data.portal_contract_address_hash as `0x${ string }`,
      });

      setTxHash(hash);

    } catch (error) {
      showErrorToast(error);
    }
  }, [ walletClient, switchChainAsync, data, showErrorToast, t ]);

  React.useEffect(() => {
    if (!txHash) {
      return;
    }

    switch (txStatus) {
      case 'success': {
        onOpenChange({ open: false });
        onSuccess(txHash);
        break;
      }
      case 'error': {
        showErrorToast(txError);
        break;
      }
    }
  }, [ onSuccess, txStatus, showErrorToast, txError, txHash, onOpenChange ]);

  return (
    <DialogRoot
      open
      onOpenChange={ onOpenChange }
      size={{ lgDown: 'full', lg: 'md' }}
      trapFocus={ false }
      preventScroll={ false }
      modal={ false }
      closeOnInteractOutside={ false }
    >
      <DialogContent>
        <DialogHeader>
          { t('networkTransfers.claim_title') }</DialogHeader>
        <DialogBody>
          <FormProvider { ...formApi }>
            <chakra.form
              noValidate
              onSubmit={ formApi.handleSubmit(onFormSubmit) }
            >
              <p>{ t('networkTransfers.claim_address_hint') }</p>
              <FormFieldAddress<FormFields>
                name="address"
                required
                placeholder={ t('networkTransfers.address_placeholder') }
                bgColor="dialog.bg"
                mt={ 6 }
              />
              { isWeb3WalletConnected ? (
                <Button
                  mt={ 6 }
                  type="submit"
                  disabled={ formApi.formState.isSubmitting || isTxPending }
                  loading={ formApi.formState.isSubmitting || isTxPending }
                  loadingText={ t('networkTransfers.claim') }
                >
                  { t('networkTransfers.claim') }</Button>
              ) : (
                <Button
                  mt={ 6 }
                  onClick={ connectWeb3Wallet }
                  disabled={ isWeb3WalletOpen }
                  loading={ isWeb3WalletOpen }
                  loadingText={ t('networkTransfers.connect_wallet') }
                >
                  { t('networkTransfers.connect_wallet') }</Button>
              ) }
            </chakra.form>
          </FormProvider>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default React.memo(OptimisticL2ClaimModal);
