// Modified by Quat Capital, 2026-10-26: marketplace, rewards or token info localization. GPL-3.0.
import ERC20Artifact from '@openzeppelin/contracts/build/contracts/ERC20.json';
import NftArtifact from '@openzeppelin/contracts/build/contracts/ERC721.json';
import { waitForTransactionReceipt } from '@wagmi/core';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount, useWriteContract, useSwitchChain } from 'wagmi';

import type { AllowanceType } from 'types/client/revoke';

import useRewardsActivity from 'lib/hooks/useRewardsActivity';
import * as mixpanel from 'lib/mixpanel/index';
import wagmiConfig from 'lib/web3/wagmiConfig';
import { toaster } from 'toolkit/chakra/toaster';

export default function useRevoke() {
  const { t: tEco } = useTranslation();
  const { address: userAddress } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const { trackTransaction, trackTransactionConfirm } = useRewardsActivity();

  return useCallback(async(approval: AllowanceType, chainId: number) => {
    try {
      if (!userAddress) return;

      await switchChainAsync({ chainId });

      const activityResponse = await trackTransaction(userAddress, approval.address, String(chainId));

      const isErc20 = approval.type === 'ERC-20';

      const hash = await writeContractAsync({
        account: userAddress,
        address: approval.address,
        abi: isErc20 ? ERC20Artifact.abi : NftArtifact.abi,
        functionName: isErc20 ? 'approve' : 'setApprovalForAll',
        args: [ approval.spender, isErc20 ? 0 : false ],
        chainId,
      });

      mixpanel.logEvent(mixpanel.EventTypes.WALLET_ACTION, {
        Action: 'Send Transaction',
        Address: userAddress,
        AppId: 'revoke',
        Source: 'Essential dapps',
        ChainId: String(chainId),
      });

      if (activityResponse?.token) {
        await trackTransactionConfirm(hash, activityResponse.token);
      }

      const receipt = await waitForTransactionReceipt(wagmiConfig.config, { hash, chainId });

      if (receipt.status === 'reverted') {
        throw new Error(tEco('marketplaceUI.revoke_failed'));
      }

      toaster.success({
        title: tEco('accountUI.success'),
        description: tEco('marketplaceUI.revoke_success'),
      });

      return true;

    } catch (error) {
      toaster.error({
        title: tEco('accountUI.error'),
        description: (error as Error)?.message || tEco('marketplaceUI.retry_error'),
      });

      return false;
    }
  }, [
    userAddress,
    writeContractAsync,
    switchChainAsync,
    trackTransaction,
    trackTransactionConfirm,
    tEco ]);
}
