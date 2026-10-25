// Modified by Quat Capital, 2026-10-25: runtime RU/KK/EN navigation. GPL-3.0.
import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { NavItemInternal, NavItem, NavGroupItem } from 'types/client/navigation';

import config from 'configs/app';
import { layerLabels } from 'lib/rollups/utils';

const marketplaceFeature = config.features.marketplace;
const beaconChainFeature = config.features.beaconChain;

interface ReturnType {
  mainNavItems: Array<NavItem | NavGroupItem>;
  accountNavItems: Array<NavItem>;
}

export function isGroupItem(item: NavItem | NavGroupItem): item is NavGroupItem {
  return 'subItems' in item;
}

export function isInternalItem(item: NavItem): item is NavItemInternal {
  return 'nextRoute' in item;
}

export default function useNavItems(): ReturnType {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = router.pathname;
  const query = router.query;
  const tab = query.tab;

  return React.useMemo(() => {
    let blockchainNavItems: Array<NavItem> | Array<Array<NavItem>> = [];

    const topAccounts: NavItem | null = !config.UI.views.address.hiddenViews?.top_accounts ? {
      text: t('navigation.top_accounts'),
      nextRoute: { pathname: '/accounts' as const },
      icon: 'navigation/top_accounts',
      isActive: pathname === '/accounts',
    } : null;
    const blocks: NavItem | null = {
      text: t('common.blocks'),
      nextRoute: { pathname: '/blocks' as const },
      icon: 'navigation/block',
      isActive: pathname === '/blocks' || pathname === '/block/[height_or_hash]' || pathname === '/chain/[chain_slug]/block/[height_or_hash]',
    };
    const txs: NavItem | null = {
      text: t('common.transactions'),
      nextRoute: { pathname: '/txs' as const },
      icon: 'navigation/transactions',
      isActive:
        // sorry, but this is how it was designed
        (pathname === '/txs' && (!config.features.zetachain.isEnabled || !tab || !tab.includes('cctx'))) ||
        pathname === '/tx/[hash]' ||
        pathname === '/chain/[chain_slug]/tx/[hash]',
    };
    const cctxs: NavItem | null = config.features.zetachain.isEnabled ? {
      text: t('navigation.cross_chain_transactions'),
      nextRoute: { pathname: '/txs' as const, query: { tab: 'cctx' } },
      icon: 'navigation/cross_chain_txs',
      isActive: pathname === '/cc/tx/[hash]' || (pathname === '/txs' && tab?.includes('cctx')),
    } : null;
    const operations: NavItem | null = config.features.tac.isEnabled ? {
      text: t('navigation.operations'),
      nextRoute: { pathname: '/operations' as const },
      icon: 'navigation/operation',
      isActive: pathname === '/operations' || pathname === '/operation/[id]',
    } : null;
    const internalTxs: NavItem | null = {
      text: t('common.internal_transactions'),
      nextRoute: { pathname: '/internal-txs' as const },
      icon: 'navigation/internal_txns',
      isActive: pathname === '/internal-txs',
    };
    const userOps: NavItem | null = config.features.userOps.isEnabled ? {
      text: t('navigation.user_operations'),
      nextRoute: { pathname: '/ops' as const },
      icon: 'navigation/user_op',
      isActive: pathname === '/ops' || pathname === '/op/[hash]' || pathname === '/chain/[chain_slug]/op/[hash]',
    } : null;

    const verifiedContracts: NavItem | null =
     {
       text: t('navigation.verified_contracts'),
       nextRoute: { pathname: '/verified-contracts' as const },
       icon: 'navigation/verified_contracts',
       isActive: pathname === '/verified-contracts',
     };
    const nameLookup = config.features.nameServices.isEnabled ? {
      text: t('navigation.name_services'),
      nextRoute: { pathname: '/name-services' as const },
      icon: 'navigation/name_services',
      isActive: pathname.startsWith('/name-services'),
    } : null;
    const validators = config.features.validators.isEnabled ? {
      text: t('common.validators'),
      nextRoute: { pathname: '/validators' as const },
      icon: 'navigation/validator',
      isActive: pathname === '/validators' || pathname === '/validators/[id]',
    } : null;
    const rollupDeposits = {
      text: t('navigation.deposits_layers', { from: layerLabels.parent, to: layerLabels.current }),
      nextRoute: { pathname: '/deposits' as const },
      icon: 'navigation/deposits',
      isActive: pathname === '/deposits',
    };
    const rollupWithdrawals = {
      text: t('navigation.withdrawals_layers', { from: layerLabels.current, to: layerLabels.parent }),
      nextRoute: { pathname: '/withdrawals' as const },
      icon: 'navigation/withdrawals',
      isActive: pathname === '/withdrawals',
    };
    const rollupTxnBatches = {
      text: t('navigation.txn_batches'),
      nextRoute: { pathname: '/batches' as const },
      icon: 'navigation/txn_batches',
      isActive: pathname === '/batches',
    };
    const rollupOutputRoots = {
      text: t('navigation.output_roots'),
      nextRoute: { pathname: '/output-roots' as const },
      icon: 'navigation/output_roots',
      isActive: pathname === '/output-roots',
    };
    const rollupDisputeGames = config.features.faultProofSystem.isEnabled ? {
      text: t('navigation.dispute_games'),
      nextRoute: { pathname: '/dispute-games' as const },
      icon: 'navigation/games',
      isActive: pathname === '/dispute-games',
    } : null;
    const mudWorlds = config.features.mudFramework.isEnabled ? {
      text: t('navigation.mud_worlds'),
      nextRoute: { pathname: '/mud-worlds' as const },
      icon: 'navigation/mud',
      isActive: pathname === '/mud-worlds',
    } : null;
    const epochs = config.features.celo.isEnabled ? {
      text: t('navigation.epochs'),
      nextRoute: { pathname: '/epochs' as const },
      icon: 'navigation/hourglass',
      isActive: pathname.startsWith('/epochs'),
    } : null;

    const rollupFeature = config.features.rollup;

    const rollupInteropMessages = rollupFeature.isEnabled && rollupFeature.interopEnabled ? {
      text: t('navigation.interop_messages'),
      nextRoute: { pathname: '/interop-messages' as const },
      icon: 'navigation/cross_chain_txs',
      isActive: pathname === '/interop-messages',
    } : null;

    if (rollupFeature.isEnabled && (
      rollupFeature.type === 'optimistic' ||
      rollupFeature.type === 'arbitrum' ||
      rollupFeature.type === 'zkEvm' ||
      rollupFeature.type === 'scroll'
    )) {
      blockchainNavItems = [
        [
          txs,
          internalTxs,
          rollupDeposits,
          rollupWithdrawals,
          rollupInteropMessages,
        ].filter(Boolean),
        [
          blocks,
          epochs,
          // currently, transaction batches are not implemented for Celo
          !config.features.celo.isEnabled ? rollupTxnBatches : undefined,
          rollupDisputeGames,
          rollupFeature.outputRootsEnabled ? rollupOutputRoots : undefined,
        ].filter(Boolean),
        [
          userOps,
          topAccounts,
          mudWorlds,
          validators,
          verifiedContracts,
          nameLookup,
        ].filter(Boolean),
      ];
    } else if (rollupFeature.isEnabled && rollupFeature.type === 'shibarium') {
      blockchainNavItems = [
        [
          txs,
          internalTxs,
          rollupDeposits,
          rollupWithdrawals,
        ],
        [
          blocks,
          userOps,
          topAccounts,
          verifiedContracts,
          nameLookup,
        ].filter(Boolean),
      ];
    } else if (rollupFeature.isEnabled && rollupFeature.type === 'zkSync') {
      blockchainNavItems = [
        [
          txs,
          internalTxs,
          userOps,
          blocks,
          rollupTxnBatches,
        ].filter(Boolean),
        [
          topAccounts,
          validators,
          verifiedContracts,
          nameLookup,
        ].filter(Boolean),
      ];
    } else {
      blockchainNavItems = [
        txs,
        operations,
        internalTxs,
        cctxs,
        userOps,
        blocks,
        epochs,
        topAccounts,
        validators,
        verifiedContracts,
        nameLookup,
        beaconChainFeature.isEnabled && !beaconChainFeature.withdrawalsOnly && {
          text: t('navigation.deposits'),
          nextRoute: { pathname: '/deposits' as const },
          icon: 'navigation/deposits',
          isActive: pathname === '/deposits',
        },
        config.features.beaconChain.isEnabled && {
          text: t('navigation.withdrawals'),
          nextRoute: { pathname: '/withdrawals' as const },
          icon: 'navigation/withdrawals',
          isActive: pathname === '/withdrawals',
        },
      ].filter(Boolean);
    }

    const tokensNavItems = [
      {
        text: t('common.tokens'),
        nextRoute: { pathname: '/tokens' as const },
        icon: 'navigation/tokens',
        isActive: pathname === '/tokens' || pathname.startsWith('/token/'),
      },
      {
        text: t('common.token_transfers'),
        nextRoute: { pathname: '/token-transfers' as const },
        icon: 'navigation/token_transfers',
        isActive: pathname === '/token-transfers',
      },
      config.features.pools.isEnabled && {
        text: t('navigation.dex_tracker'),
        nextRoute: { pathname: '/pools' as const },
        icon: 'navigation/dex_tracker',
        isActive: pathname === '/pools' || pathname.startsWith('/pool/'),
      },
    ].filter(Boolean);

    const statsNavItem: NavGroupItem | null = (() => {
      const megaEthFeature = config.features.megaEth;

      const items = [
        config.features.stats.isEnabled && {
          text: t('navigation.chain_stats'),
          nextRoute: { pathname: '/stats' as const },
          icon: 'navigation/chain_stats',
          isActive: pathname.startsWith('/stats'),
        },
        config.features.multichain.isEnabled && {
          text: t('navigation.ecosystems'),
          nextRoute: { pathname: '/ecosystems' as const },
          icon: 'navigation/ecosystems',
          isActive: pathname.startsWith('/ecosystems'),
        },
        megaEthFeature.isEnabled && megaEthFeature.socketUrl.metrics && {
          text: t('navigation.uptime'),
          nextRoute: { pathname: '/uptime' as const },
          icon: 'navigation/uptime',
          isActive: pathname.startsWith('/uptime'),
        },
        config.features.hotContracts.isEnabled && {
          text: t('navigation.hot_contracts'),
          nextRoute: { pathname: '/hot-contracts' as const },
          icon: 'navigation/hot_contracts',
          isActive: pathname.startsWith('/hot-contracts'),
        },
        config.features.gasTracker.isEnabled && {
          text: t('navigation.gas_tracker'),
          nextRoute: { pathname: '/gas-tracker' as const },
          icon: 'navigation/gas_tracker',
          isActive: pathname.startsWith('/gas-tracker'),
        },
      ].filter(Boolean);

      if (items.length === 0) {
        return null;
      }

      return {
        text: t('navigation.charts_stats'),
        nextRoute: { pathname: '/stats' as const },
        icon: 'navigation/stats',
        isActive: items.some(item => isInternalItem(item) && item.isActive),
        subItems: items,
      };
    })();

    const apiNavItem: NavItem | null = config.features.apiDocs.isEnabled ? {
      text: t('navigation.api'),
      nextRoute: { pathname: '/api-docs' as const },
      icon: 'navigation/api_docs',
      isActive: pathname.startsWith('/api-docs'),
    } : null;

    const otherNavItems: Array<NavItem> | Array<Array<NavItem>> = [
      config.features.multichain.isEnabled ? {
        text: t('navigation.verify_contract'),
        url: 'https://vera.blockscout.com',
      } : {
        text: t('navigation.verify_contract'),
        nextRoute: { pathname: '/contract-verification' as const },
        isActive: pathname.startsWith('/contract-verification'),
      },
      config.features.publicTagsSubmission.isEnabled && {
        text: t('navigation.submit_public_tag'),
        nextRoute: { pathname: '/public-tags/submit' as const },
        isActive: pathname.startsWith('/public-tags/submit'),
      },
      rollupFeature.isEnabled && rollupFeature.type === 'arbitrum' && {
        text: t('navigation.txn_withdrawals'),
        nextRoute: { pathname: '/txn-withdrawals' as const },
        isActive: pathname.startsWith('/txn-withdrawals'),
      },
      ...config.UI.navigation.otherLinks,
    ].filter(Boolean);

    const mainNavItems: ReturnType['mainNavItems'] = [
      {
        text: t('navigation.blockchain'),
        icon: 'navigation/blockchain',
        isActive: blockchainNavItems.flat().some(item => isInternalItem(item) && item.isActive),
        subItems: blockchainNavItems,
      },
      {
        text: t('common.tokens'),
        icon: 'navigation/tokens',
        isActive: tokensNavItems.flat().some(item => isInternalItem(item) && item.isActive),
        subItems: tokensNavItems,
      },
      marketplaceFeature.isEnabled ? {
        text: marketplaceFeature.titles.menu_item,
        nextRoute: { pathname: '/apps' as const },
        icon: 'navigation/apps',
        isActive: pathname.startsWith('/app') || pathname.startsWith('/essential-dapps'),
      } : null,
      statsNavItem,
      apiNavItem,
      {
        text: t('navigation.other'),
        icon: 'navigation/other',
        isActive: otherNavItems.flat().some(item => isInternalItem(item) && item.isActive),
        subItems: otherNavItems,
      },
    ].filter(Boolean);

    const accountNavItems: ReturnType['accountNavItems'] = [
      {
        text: t('navigation.watch_list'),
        nextRoute: { pathname: '/account/watchlist' as const },
        icon: 'navigation/watchlist',
        isActive: pathname === '/account/watchlist',
      },
      {
        text: t('navigation.private_tags'),
        nextRoute: { pathname: '/account/tag-address' as const },
        icon: 'navigation/private_tags',
        isActive: pathname === '/account/tag-address',
      },
      {
        text: t('navigation.api_keys'),
        nextRoute: { pathname: '/account/api-key' as const },
        icon: 'navigation/api_keys',
        isActive: pathname === '/account/api-key',
      },
      {
        text: t('navigation.custom_abi'),
        nextRoute: { pathname: '/account/custom-abi' as const },
        icon: 'navigation/custom_abi',
        isActive: pathname === '/account/custom-abi',
      },
      config.features.addressVerification.isEnabled && {
        text: t('navigation.verified_addresses'),
        nextRoute: { pathname: '/account/verified-addresses' as const },
        icon: 'navigation/verified_contracts',
        isActive: pathname === '/account/verified-addresses',
      },
    ].filter(Boolean);

    return { mainNavItems, accountNavItems };
  }, [ pathname, tab, t ]);
}
