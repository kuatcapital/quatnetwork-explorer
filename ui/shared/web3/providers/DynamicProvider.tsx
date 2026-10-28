// Modified by Quat Capital, 2026-10-29: own auth notifications follow locale; SDK/API payloads unchanged. GPL-3.0.
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import type { DynamicContextProps, OnAuthSuccess } from '@dynamic-labs/sdk-react-core';
import { DynamicContextProvider, getAuthToken } from '@dynamic-labs/sdk-react-core';
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { UserInfo } from 'types/api/account';

import config from 'configs/app';
import useApiFetch from 'lib/api/useApiFetch';
import { getResourceKey } from 'lib/api/useApiQuery';
import useGetCsrfToken from 'lib/hooks/useGetCsrfToken';
import { getUiErrorMessage, OwnUiMessageError } from 'lib/i18n/uiMessages';
import * as mixpanel from 'lib/mixpanel/index';
import { chains } from 'lib/web3/chains';
import { toaster } from 'toolkit/chakra/toaster';
import { castToString } from 'toolkit/utils/guards';
import useLogout from 'ui/snippets/auth/useLogout';

import WagmiProvider from './WagmiProvider';

const feature = config.features.blockchainInteraction;

const walletConnectors = [
  EthereumWalletConnectors,
];

const overrides: DynamicContextProps['settings']['overrides'] = {
  evmNetworks: chains.map((chain) => {
    const logoUrl = castToString(chain.custom?.logoUrl);
    return {
      chainId: chain.id,
      name: chain.name,
      rpcUrls: chain.rpcUrls.default.http.slice(),
      nativeCurrency: chain.nativeCurrency,
      blockExplorerUrls: chain.blockExplorers ? [ chain.blockExplorers.default.url ] : [],
      networkId: chain.id,
      iconUrls: logoUrl ? [ logoUrl ] : [],
      isTestnet: chain.testnet,
    };
  }),
};

interface Props {
  children: React.ReactNode;
}

const DynamicProvider = ({ children }: Props) => {
  const { t } = useTranslation();

  const apiFetch = useApiFetch();
  const queryClient = useQueryClient();
  const csrfQuery = useGetCsrfToken();
  const onLogout = useLogout();

  const onAuthSuccess: OnAuthSuccess = React.useCallback(async() => {
    try {
      const authToken = getAuthToken();
      const response = await apiFetch<'general:auth_dynamic', UserInfo, unknown>('general:auth_dynamic', {
        fetchParams: {
          headers: {
            Authorization: `Bearer ${ authToken }`,
          },
        },
      });
      if (!('name' in response)) {
        throw new OwnUiMessageError('contracts.unexpected_error', 'Something went wrong');
      }
      queryClient.setQueryData(getResourceKey('general:user_info'), () => response);
      csrfQuery.refetch();
      mixpanel.logEvent(mixpanel.EventTypes.LOGIN, {
        Action: 'Success',
        Source: 'Dynamic',
      });
    } catch (error) {
      toaster.error({
        title: t('common.error'),
        description: getUiErrorMessage(error, t),
      });
    }
  }, [ apiFetch, csrfQuery, queryClient, t ]);

  const settings: DynamicContextProps['settings'] = React.useMemo(() => {
    const environmentId = feature.isEnabled && feature.connectorType === 'dynamic' ? feature.dynamic.environmentId : undefined;

    if (!environmentId) {
      throw new Error('Dynamic environment ID is not set');
    }

    return {
      walletConnectors,
      environmentId,
      useMetamaskSdk: false,
      overrides,
      events: {
        onAuthSuccess,
        onLogout,
      },
    };
  }, [ onAuthSuccess, onLogout ]);

  return (
    <DynamicContextProvider
      settings={ settings }
    >
      <WagmiProvider>
        <DynamicWagmiConnector>
          { children }
        </DynamicWagmiConnector>
      </WagmiProvider>
    </DynamicContextProvider>
  );
};

export default React.memo(DynamicProvider);
