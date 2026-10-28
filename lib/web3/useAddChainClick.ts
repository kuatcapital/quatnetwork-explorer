// Modified by Quat Capital, 2026-10-29: runtime network-add notifications; wallet messages unchanged. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import { getUiErrorMessage } from 'lib/i18n/uiMessages';
import * as mixpanel from 'lib/mixpanel/index';
import { toaster } from 'toolkit/chakra/toaster';

import useAddChain from './useAddChain';
import useProvider from './useProvider';
import useSwitchChain from './useSwitchChain';

interface Props {
  source: 'Footer' | 'Top bar' | 'Chain widget';
  onSuccess?: () => void;
}

export default function useAddChainClick({ source, onSuccess }: Props) {
  const { t } = useTranslation();
  const { data: { wallet, provider } = {} } = useProvider();
  const addChain = useAddChain();
  const switchChain = useSwitchChain();

  return React.useCallback(async() => {
    if (!wallet || !provider) {
      return;
    }

    try {
      await addChain();
      await switchChain();

      toaster.success({
        title: t('common.success'),
        description: t('coreUi.network_added'),
      });

      mixpanel.logEvent(mixpanel.EventTypes.ADD_TO_WALLET, {
        Target: 'network',
        Wallet: wallet,
        Source: source,
      });

      onSuccess?.();
    } catch (error) {
      toaster.error({
        title: t('common.error'),
        description: getUiErrorMessage(error, t),
      });
    }
  }, [ addChain, provider, wallet, switchChain, source, onSuccess, t ]);
}
