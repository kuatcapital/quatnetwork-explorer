// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';

import config from 'configs/app';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import TokenTransfersCrossChain from 'ui/crossChain/transfers/TokenTransfersCrossChain';
import PageTitle from 'ui/shared/Page/PageTitle';
import TokenTransfersLocal from 'ui/tokenTransfers/TokenTransfersLocal';

const TokenTransfers = () => {
  const { t: tQuat } = useTranslation();

  const tabs: Array<TabItemRegular> = [
    {
      id: 'local',
      title: tQuat('tokenUi.transfers'),
      component: <TokenTransfersLocal/>,
    },
    config.features.crossChainTxs.isEnabled && {
      id: 'cross_chain',
      title: tQuat('tokenUi.cross_chain_transfers'),
      component: <TokenTransfersCrossChain/>,
    },
  ].filter(Boolean);

  return (
    <>
      <PageTitle
        title={ tQuat('tokenUi.token_transfers') }
        withTextAd
      />
      <RoutedTabs tabs={ tabs }/>
    </>
  );
};

export default TokenTransfers;
