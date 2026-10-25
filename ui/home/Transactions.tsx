// Modified by Quat Capital, 2026-10-25: localized homepage transaction tabs (T18, GPL-3.0).
import { HStack } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import config from 'configs/app';
import { layerLabels } from 'lib/rollups/utils';
import { SocketProvider } from 'lib/socket/context';
import { Heading } from 'toolkit/chakra/heading';
import AdaptiveTabs from 'toolkit/components/AdaptiveTabs/AdaptiveTabs';
import LatestOptimisticDeposits from 'ui/home/latestDeposits/LatestOptimisticDeposits';
import LatestTxs from 'ui/home/LatestTxs';
import LatestWatchlistTxs from 'ui/home/LatestWatchlistTxs';
import LatestZetaChainCCTXs from 'ui/home/latestZetaChainCCTX/LatestZetaChainCCTXs';
import FallbackRpcIcon from 'ui/shared/fallbacks/FallbackRpcIcon';
import useAuth from 'ui/snippets/auth/useIsAuth';

import { useHomeRpcDataContext } from './fallbacks/rpcDataContext';
import LatestCrossChainTxs from './latestCrossChainTxs/LatestCrossChainTxs';
import LatestArbitrumDeposits from './latestDeposits/LatestArbitrumDeposits';

const rollupFeature = config.features.rollup;
const zetachainFeature = config.features.zetachain;
const crossChainTxsFeature = config.features.crossChainTxs;

const Transactions = () => {
  const { t } = useTranslation();
  const isAuth = useAuth();
  const rpcDataContext = useHomeRpcDataContext();
  const isRpcData = rpcDataContext.isEnabled && !rpcDataContext.isLoading && !rpcDataContext.isError && rpcDataContext.subscriptions.includes('latest-txs');

  if ((rollupFeature.isEnabled && (rollupFeature.type === 'optimistic' || rollupFeature.type === 'arbitrum')) || isAuth || zetachainFeature.isEnabled) {
    const tabs = [
      zetachainFeature.isEnabled && {
        id: 'cctx',
        title: t('home.cross_chain'),
        component: (
          <SocketProvider url={ config.apis.zetachain?.socketEndpoint } name="zetachain">
            <LatestZetaChainCCTXs/>
          </SocketProvider>
        ),
      },
      { id: 'txn', title: zetachainFeature.isEnabled ? 'ZetaChain EVM' : t('home.latest_txn'), component: <LatestTxs/> },
      rollupFeature.isEnabled && rollupFeature.type === 'optimistic' &&
        { id: 'deposits', title: t('home.deposits_layers', { from: layerLabels.parent, to: layerLabels.current }), component: <LatestOptimisticDeposits/> },
      rollupFeature.isEnabled && rollupFeature.type === 'arbitrum' &&
        { id: 'deposits', title: t('home.deposits_layers', { from: layerLabels.parent, to: layerLabels.current }), component: <LatestArbitrumDeposits/> },
      isAuth && { id: 'watchlist', title: t('navigation.watch_list'), component: <LatestWatchlistTxs/> },
    ].filter(Boolean);
    return (
      <>
        <HStack mb={ 3 }>
          <Heading level="3" >{ t('common.transactions') }</Heading>
          { isRpcData && <FallbackRpcIcon/> }
        </HStack>
        <AdaptiveTabs tabs={ tabs } unmountOnExit={ false } listProps={{ mb: 3 }}/>
      </>
    );
  }

  if (crossChainTxsFeature.isEnabled) {
    const tabs = [
      { id: 'txs', title: t('home.txns'), component: <LatestTxs/> },
      { id: 'cross_chain_txs', title: t('home.cross_chain_txns'), component: <LatestCrossChainTxs/> },
    ];

    return (
      <>
        <HStack mb={ 3 }>
          <Heading level="3" >{ t('home.latest_transactions') }</Heading>
          { isRpcData && <FallbackRpcIcon/> }
        </HStack>
        <AdaptiveTabs tabs={ tabs } unmountOnExit={ false } listProps={{ mb: 3 }}/>
      </>
    );
  }

  return (
    <>
      <HStack mb={ 3 }>
        <Heading level="3" >{ t('home.latest_transactions') }</Heading>
        { isRpcData && <FallbackRpcIcon/> }
      </HStack>
      <LatestTxs/>
    </>
  );
};

export default Transactions;
