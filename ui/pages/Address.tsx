// Modified by Quat Capital, 2026-10-25: localize address UI. GPL-3.0.
import { Box, Flex, HStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';
import type { EntityTag } from 'ui/shared/EntityTags/types';

import config from 'configs/app';
import getCheckedSummedAddress from 'lib/address/getCheckedSummedAddress';
import useAddressMetadataInfoQuery from 'lib/address/useAddressMetadataInfoQuery';
import useAddressMetadataInitUpdate from 'lib/address/useAddressMetadataInitUpdate';
import useApiQuery from 'lib/api/useApiQuery';
import { useAddressClusters } from 'lib/clusters/useAddressClusters';
import useAddressProfileApiQuery from 'lib/hooks/useAddressProfileApiQuery';
import useIsSafeAddress from 'lib/hooks/useIsSafeAddress';
import getQueryParamString from 'lib/router/getQueryParamString';
import useEtherscanRedirects from 'lib/router/useEtherscanRedirects';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import useFetchXStarScore from 'lib/xStarScore/useFetchXStarScore';
import { ADDRESS_TABS_COUNTERS } from 'stubs/address';
import { USER_OPS_ACCOUNT } from 'stubs/userOps';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import Address3rdPartyWidgets from 'ui/address/Address3rdPartyWidgets';
import useAddress3rdPartyWidgets from 'ui/address/address3rdPartyWidgets/useAddress3rdPartyWidgets';
import AddressAccountHistory from 'ui/address/AddressAccountHistory';
import AddressBlocksValidated from 'ui/address/AddressBlocksValidated';
import AddressCoinBalance from 'ui/address/AddressCoinBalance';
import AddressContract from 'ui/address/AddressContract';
import AddressDeposits from 'ui/address/AddressDeposits';
import AddressDetails from 'ui/address/AddressDetails';
import AddressEpochRewards from 'ui/address/AddressEpochRewards';
import AddressInternalTxs from 'ui/address/AddressInternalTxs';
import AddressLogs from 'ui/address/AddressLogs';
import AddressMud from 'ui/address/AddressMud';
import AddressMultichainInfoButton from 'ui/address/AddressMultichainInfoButton';
import AddressTokens from 'ui/address/AddressTokens';
import AddressTokenTransfers, { ADDRESS_TOKEN_TRANSFERS_TAB_IDS } from 'ui/address/AddressTokenTransfers';
import AddressTxs, { ADDRESS_TXS_TAB_IDS } from 'ui/address/AddressTxs';
import AddressUserOps from 'ui/address/AddressUserOps';
import AddressWithdrawals from 'ui/address/AddressWithdrawals';
import AddressClusters from 'ui/address/clusters/AddressClusters';
import { CONTRACT_TAB_IDS } from 'ui/address/contract/utils';
import AddressAlerts from 'ui/address/details/AddressAlerts';
import AddressFavoriteButton from 'ui/address/details/AddressFavoriteButton';
import AddressQrCode from 'ui/address/details/AddressQrCode';
import AddressEnsDomains from 'ui/address/ensDomains/AddressEnsDomains';
import SolidityscanReport from 'ui/address/SolidityscanReport';
import { useAddressValidationLabels } from 'ui/address/useAddressValidationLabels';
import useAddressCountersQuery from 'ui/address/utils/useAddressCountersQuery';
import useAddressQuery from 'ui/address/utils/useAddressQuery';
import useCheckAddressFormat from 'ui/address/utils/useCheckAddressFormat';
import useCheckDomainNameParam from 'ui/address/utils/useCheckDomainNameParam';
import AccountActionsMenu from 'ui/shared/AccountActionsMenu/AccountActionsMenu';
import TextAd from 'ui/shared/ad/TextAd';
import AddressAddToWallet from 'ui/shared/address/AddressAddToWallet';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import EnsEntity from 'ui/shared/entities/ens/EnsEntity';
import EntityTags from 'ui/shared/EntityTags/EntityTags';
import formatUserTags from 'ui/shared/EntityTags/formatUserTags';
import sortEntityTags from 'ui/shared/EntityTags/sortEntityTags';
import IconSvg from 'ui/shared/IconSvg';
import NetworkExplorers from 'ui/shared/NetworkExplorers';
import PageTitle from 'ui/shared/Page/PageTitle';

const TOKEN_TABS = [ 'tokens_erc20', 'tokens_nfts', 'tokens_nfts_collection', 'tokens_nfts_list' ];
const PREDEFINED_TAG_PRIORITY = 100;

const txInterpretation = config.features.txInterpretation;
const addressProfileAPIFeature = config.features.addressProfileAPI;
const xScoreFeature = config.features.xStarScore;
const nameServicesFeature = config.features.nameServices;
const beaconChainFeature = config.features.beaconChain;

const AddressPageContent = () => {
  const { t: tQuat } = useTranslation();

  const router = useRouter();
  const { blocksTitle } = useAddressValidationLabels();

  const hash = getQueryParamString(router.query.hash);

  const checkDomainName = useCheckDomainNameParam(hash);
  const checkAddressFormat = useCheckAddressFormat(hash);

  useEtherscanRedirects();

  const areQueriesEnabled = !checkDomainName && !checkAddressFormat;
  const addressQuery = useAddressQuery({ hash, isEnabled: areQueriesEnabled });

  const addressTabsCountersQuery = useApiQuery('general:address_tabs_counters', {
    pathParams: { hash },
    queryOptions: {
      enabled: areQueriesEnabled && Boolean(hash),
      placeholderData: ADDRESS_TABS_COUNTERS,
    },
  });

  const countersQuery = useAddressCountersQuery({
    hash,
    isLoading: addressQuery.isPlaceholderData,
    isDegradedData: addressQuery.isDegradedData,
  });

  const userOpsAccountQuery = useApiQuery('general:user_ops_account', {
    pathParams: { hash },
    queryOptions: {
      enabled: areQueriesEnabled && Boolean(hash) && config.features.userOps.isEnabled,
      placeholderData: USER_OPS_ACCOUNT,
    },
  });

  const mudTablesCountQuery = useApiQuery('general:mud_tables_count', {
    pathParams: { hash },
    queryOptions: {
      enabled: config.features.mudFramework.isEnabled && areQueriesEnabled && Boolean(hash),
      placeholderData: 10,
    },
  });

  const addressesForMetadataQuery = React.useMemo(() => ([ hash ].filter(Boolean)), [ hash ]);
  const addressMetadataQuery = useAddressMetadataInfoQuery(addressesForMetadataQuery, areQueriesEnabled);
  const userPropfileApiQuery = useAddressProfileApiQuery(hash, addressProfileAPIFeature.isEnabled && areQueriesEnabled);

  const addressEnsDomainsQuery = useApiQuery('bens:addresses_lookup', {
    queryParams: {
      address: hash,
      protocols: nameServicesFeature.isEnabled && nameServicesFeature.ens.isEnabled ? nameServicesFeature.ens.protocols : undefined,
      resolved_to: true,
      owned_by: true,
      only_active: true,
      order: 'ASC',
    },
    queryOptions: {
      enabled: Boolean(hash) && nameServicesFeature.isEnabled && nameServicesFeature.ens.isEnabled,
    },
  });
  const addressMainDomain = !addressQuery.isPlaceholderData ?
    addressEnsDomainsQuery.data?.items.find((domain) => domain.name === addressQuery.data?.ens_domain_name) :
    undefined;

  const addressClustersQuery = useAddressClusters(hash, areQueriesEnabled);

  const addressType = addressQuery.data?.is_contract && addressQuery.data?.proxy_type !== 'eip7702' ? 'contract' : 'eoa';
  const address3rdPartyWidgets = useAddress3rdPartyWidgets(addressType, addressQuery.isPlaceholderData, areQueriesEnabled);

  const isLoading = addressQuery.isPlaceholderData;
  const isTabsLoading =
    isLoading ||
    addressTabsCountersQuery.isPlaceholderData ||
    (address3rdPartyWidgets.isEnabled && address3rdPartyWidgets.configQuery.isPlaceholderData) ||
    (config.features.userOps.isEnabled && userOpsAccountQuery.isPlaceholderData) ||
    (config.features.mudFramework.isEnabled && mudTablesCountQuery.isPlaceholderData);

  const handleFetchedBytecodeMessage = React.useCallback(() => {
    addressQuery.refetch();
  }, [ addressQuery ]);

  const channel = useSocketChannel({
    topic: `addresses:${ hash?.toLowerCase() }`,
    isDisabled: isTabsLoading || addressQuery.isDegradedData || Boolean(addressQuery.data?.is_contract),
  });
  useSocketMessage({
    channel,
    event: 'fetched_bytecode',
    handler: handleFetchedBytecodeMessage,
  });

  useAddressMetadataInitUpdate({
    address: hash,
    counters: countersQuery.data,
    isEnabled: !countersQuery.isPlaceholderData && !countersQuery.isDegradedData,
  });

  const isSafeAddress = useIsSafeAddress(!addressQuery.isPlaceholderData && addressQuery.data?.is_contract ? addressQuery.data.hash : undefined);

  const xStarQuery = useFetchXStarScore({ hash });

  const tabs: Array<TabItemRegular> = React.useMemo(() => {
    return [
      {
        id: 'index',
        title: tQuat('common.details'),
        component: <AddressDetails addressQuery={ addressQuery } countersQuery={ countersQuery } isLoading={ isTabsLoading }/>,
      },
      addressQuery.data?.is_contract ? {
        id: 'contract',
        title: () => {
          const tabName = addressQuery.data.proxy_type === 'eip7702' ? tQuat('addresses.code') : tQuat('common.contract');

          if (addressQuery.data.is_verified) {
            return (
              <>
                <span>{ tabName }</span>
                <IconSvg name="status/success" boxSize="14px" color="green.500"/>
              </>
            );
          }

          return tabName;
        },
        component: (
          <AddressContract
            addressData={ addressQuery.data }
            isLoading={ isTabsLoading }
            hasMudTab={ Boolean(config.features.mudFramework.isEnabled && mudTablesCountQuery.data && mudTablesCountQuery.data > 0) }
          />
        ),
        subTabs: CONTRACT_TAB_IDS,
      } : undefined,
      config.features.mudFramework.isEnabled && mudTablesCountQuery.data && mudTablesCountQuery.data > 0 && {
        id: 'mud',
        title: 'MUD',
        count: mudTablesCountQuery.data,
        component: <AddressMud shouldRender={ !isTabsLoading } isQueryEnabled={ areQueriesEnabled }/>,
      },
      {
        id: 'txs',
        title: tQuat('common.transactions'),
        count: addressTabsCountersQuery.data?.transactions_count,
        component: <AddressTxs shouldRender={ !isTabsLoading } isQueryEnabled={ areQueriesEnabled }/>,
        subTabs: ADDRESS_TXS_TAB_IDS,
      },
      txInterpretation.isEnabled && txInterpretation.provider === 'noves' ?
        {
          id: 'account_history',
          title: tQuat('addresses.account_history'),
          component: <AddressAccountHistory shouldRender={ !isTabsLoading } isQueryEnabled={ areQueriesEnabled }/>,
        } :
        undefined,
      config.features.userOps.isEnabled && Boolean(userOpsAccountQuery.data?.total_ops) ?
        {
          id: 'user_ops',
          title: tQuat('navigation.user_operations'),
          count: userOpsAccountQuery.data?.total_ops,
          component: <AddressUserOps shouldRender={ !isTabsLoading } isQueryEnabled={ areQueriesEnabled }/>,
        } :
        undefined,
      beaconChainFeature.isEnabled && !beaconChainFeature.withdrawalsOnly && addressTabsCountersQuery.data?.beacon_deposits_count ?
        {
          id: 'deposits',
          title: tQuat('navigation.deposits'),
          count: addressTabsCountersQuery.data?.beacon_deposits_count,
          component: <AddressDeposits shouldRender={ !isTabsLoading } isQueryEnabled={ areQueriesEnabled }/>,
        } :
        undefined,
      config.features.beaconChain.isEnabled && addressTabsCountersQuery.data?.withdrawals_count ?
        {
          id: 'withdrawals',
          title: tQuat('navigation.withdrawals'),
          count: addressTabsCountersQuery.data?.withdrawals_count,
          component: <AddressWithdrawals shouldRender={ !isTabsLoading } isQueryEnabled={ areQueriesEnabled }/>,
        } :
        undefined,
      {
        id: 'token_transfers',
        title: tQuat('common.token_transfers'),
        count: addressTabsCountersQuery.data?.token_transfers_count,
        component: <AddressTokenTransfers shouldRender={ !isTabsLoading } isQueryEnabled={ areQueriesEnabled }/>,
        subTabs: ADDRESS_TOKEN_TRANSFERS_TAB_IDS,
      },
      {
        id: 'tokens',
        title: tQuat('common.tokens'),
        count: addressTabsCountersQuery.data?.token_balances_count,
        component: <AddressTokens shouldRender={ !isTabsLoading } isQueryEnabled={ areQueriesEnabled }/>,
        subTabs: TOKEN_TABS,
      },
      {
        id: 'internal_txns',
        title: tQuat('common.internal_txns'),
        count: addressTabsCountersQuery.data?.internal_transactions_count,
        component: <AddressInternalTxs shouldRender={ !isTabsLoading } isQueryEnabled={ areQueriesEnabled }/>,
      },
      addressTabsCountersQuery.data?.celo_election_rewards_count ? {
        id: 'epoch_rewards',
        title: tQuat('addresses.epoch_rewards'),
        count: addressTabsCountersQuery.data?.celo_election_rewards_count,
        component: <AddressEpochRewards shouldRender={ !isTabsLoading } isQueryEnabled={ areQueriesEnabled }/>,
      } : undefined,
      {
        id: 'coin_balance_history',
        title: tQuat('addresses.coin_balance_history'),
        component: <AddressCoinBalance shouldRender={ !isTabsLoading } isQueryEnabled={ areQueriesEnabled }/>,
      },
      addressTabsCountersQuery.data?.validations_count ?
        {
          id: 'blocks_validated',
          title: blocksTitle,
          count: addressTabsCountersQuery.data?.validations_count,
          component: <AddressBlocksValidated shouldRender={ !isTabsLoading } isQueryEnabled={ areQueriesEnabled }/>,
        } :
        undefined,
      addressTabsCountersQuery.data?.logs_count ?
        {
          id: 'logs',
          title: tQuat('common.logs'),
          count: addressTabsCountersQuery.data?.logs_count,
          component: <AddressLogs shouldRender={ !isTabsLoading } isQueryEnabled={ areQueriesEnabled }/>,
        } :
        undefined,
      (address3rdPartyWidgets.isEnabled && address3rdPartyWidgets.items.length > 0) ? {
        id: 'widgets',
        title: tQuat('addresses.widgets'),
        count: address3rdPartyWidgets.items.length,
        component: (
          <Address3rdPartyWidgets
            addressType={ addressType }
            isLoading={ addressQuery.isPlaceholderData }
            shouldRender={ !isTabsLoading }
            isQueryEnabled={ areQueriesEnabled }
            showAll
          />
        ),
      } : undefined,
    ].filter(Boolean);
  }, [
    addressQuery,
    countersQuery,
    addressTabsCountersQuery.data,
    userOpsAccountQuery.data,
    isTabsLoading,
    areQueriesEnabled,
    mudTablesCountQuery.data,
    address3rdPartyWidgets,
    addressType,
    blocksTitle,
    tQuat,
  ]);

  const usernameApiTag = userPropfileApiQuery.data?.user_profile?.username;

  const tags: Array<EntityTag> = React.useMemo(() => {
    return [
      ...(addressQuery.data?.public_tags?.map((tag) => {
        const isFhe = tag.label.toLowerCase() === 'fhe' || tag.display_name.toLowerCase() === 'fhe';
        return {
          slug: tag.label,
          name: tag.display_name,
          tagType: 'custom' as const,
          ordinal: -1,
          meta: isFhe ? {
            tooltipDescription: tQuat('addresses.fhe_description'),
          } : undefined,
        };
      }) || []),
      addressQuery.data?.celo?.account ? {
        slug: 'celo-account',
        name: tQuat('addresses.celo_account'),
        tagType: 'custom' as const,
        ordinal: PREDEFINED_TAG_PRIORITY,
        meta: {
          bgColor: 'yellow.200',
          textColor: 'black',
        },
      } : undefined,
      !addressQuery.data?.is_contract ? { slug: 'eoa', name: 'EOA', tagType: 'custom' as const, ordinal: PREDEFINED_TAG_PRIORITY } : undefined,
      config.features.validators.isEnabled && addressQuery.data?.has_validated_blocks ?
        { slug: 'validator', name: tQuat('common.validator'), tagType: 'custom' as const, ordinal: PREDEFINED_TAG_PRIORITY } :
        undefined,
      addressQuery.data?.implementations?.length && addressQuery.data?.proxy_type !== 'eip7702' ?
        { slug: 'proxy', name: tQuat('addresses.proxy'), tagType: 'custom' as const, ordinal: PREDEFINED_TAG_PRIORITY } :
        undefined,
      addressQuery.data?.implementations?.length && addressQuery.data?.proxy_type === 'eip7702' ?
        { slug: 'eip7702', name: tQuat('addresses.eoa_code'), tagType: 'custom' as const, ordinal: PREDEFINED_TAG_PRIORITY } :
        undefined,
      addressQuery.data?.token ? { slug: 'token', name: tQuat('common.token'), tagType: 'custom' as const, ordinal: PREDEFINED_TAG_PRIORITY } : undefined,
      isSafeAddress ? { slug: 'safe', name: tQuat('addresses.multisig_safe'), tagType: 'custom' as const, ordinal: -10 } : undefined,
      addressProfileAPIFeature.isEnabled && usernameApiTag ? {
        slug: 'username_api',
        name: usernameApiTag,
        tagType: 'custom' as const,
        ordinal: 11,
        meta: {
          tagIcon: addressProfileAPIFeature.tagIcon,
          bgColor: addressProfileAPIFeature.tagBgColor,
          textColor: addressProfileAPIFeature.tagTextColor,
          tagUrl: addressProfileAPIFeature.tagLinkTemplate ? addressProfileAPIFeature.tagLinkTemplate.replace('{username}', usernameApiTag) : undefined,
        },
      } : undefined,
      config.features.userOps.isEnabled && userOpsAccountQuery.data ?
        { slug: 'user_ops_acc', name: tQuat('addresses.smart_contract_wallet'), tagType: 'custom' as const, ordinal: PREDEFINED_TAG_PRIORITY } :
        undefined,
      config.features.mudFramework.isEnabled && mudTablesCountQuery.data ?
        { slug: 'mud', name: tQuat('addresses.mud_world'), tagType: 'custom' as const, ordinal: PREDEFINED_TAG_PRIORITY } :
        undefined,
      ...formatUserTags(addressQuery.data),
      ...(addressMetadataQuery.data?.addresses?.[hash.toLowerCase()]?.tags.filter(tag => tag.tagType !== 'note') || []),
      !addressQuery.data?.is_contract && xScoreFeature.isEnabled && xStarQuery.data?.data.level ?
        {
          slug: 'xstar',
          name: tQuat('addresses.xhs_level', { level: xStarQuery.data.data.level }),
          tagType: 'custom' as const,
          ordinal: 12,
          meta: {
            tooltipTitle: tQuat('addresses.xstar_levels'),
            tooltipDescription:
              tQuat('addresses.xstar_description'),
            tooltipUrl: xScoreFeature.url,
          },
        } :
        undefined,
    ].filter(Boolean).sort(sortEntityTags);
  }, [
    addressMetadataQuery.data,
    addressQuery.data,
    hash,
    isSafeAddress,
    userOpsAccountQuery.data,
    mudTablesCountQuery.data,
    usernameApiTag,
    xStarQuery.data?.data,
    tQuat,
  ]);

  const titleContentAfter = (
    <EntityTags
      tags={ tags }
      addressHash={ addressQuery.data?.hash }
      isLoading={
        isLoading ||
        (config.features.userOps.isEnabled && userOpsAccountQuery.isPlaceholderData) ||
        (config.features.addressMetadata.isEnabled && addressMetadataQuery.isPending) ||
        (addressProfileAPIFeature.isEnabled && userPropfileApiQuery.isPending) ||
        (xScoreFeature.isEnabled && xStarQuery.isPlaceholderData)
      }
    />
  );

  // API always returns hash in check-summed format except for addresses that are not in the database
  // In this case it returns 404 with empty payload, so we calculate check-summed hash on the client
  const checkSummedHash = React.useMemo(() => {
    if (isLoading) {
      return getCheckedSummedAddress(hash);
    }

    return addressQuery.data?.hash ?? getCheckedSummedAddress(hash);
  }, [ hash, addressQuery.data?.hash, isLoading ]);

  const titleSecondRow = (
    <Flex alignItems="center" w="100%" columnGap={ 2 } rowGap={ 2 } flexWrap={{ base: 'wrap', lg: 'nowrap' }}>
      { addressQuery.data?.ens_domain_name && (
        <EnsEntity
          domain={ addressQuery.data?.ens_domain_name }
          protocol={ !addressEnsDomainsQuery.isPending ? addressMainDomain?.protocol : null }
          variant="subheading"
          mr={ 1 }
          maxW="300px"
        />
      ) }
      <AddressEntity
        address={{
          ...addressQuery.data,
          hash: checkSummedHash,
          name: '',
          ens_domain_name: '',
          implementations: null,
        }}
        isLoading={ isLoading }
        variant="subheading"
        noLink
        isSafeAddress={ isSafeAddress }
        icon={{ color: isSafeAddress ? { _light: 'black', _dark: 'white' } : undefined }}
      />
      { !isLoading && addressQuery.data?.is_contract && addressQuery.data.token &&
        <AddressAddToWallet token={ addressQuery.data.token } variant="button"/> }
      { !isLoading && !addressQuery.data?.is_contract && config.features.account.isEnabled && (
        <AddressFavoriteButton hash={ hash } watchListId={ addressQuery.data?.watchlist_address_id }/>
      ) }
      <AddressQrCode hash={ addressQuery.data?.filecoin?.robust ?? checkSummedHash } isLoading={ isLoading }/>
      <AccountActionsMenu isLoading={ isLoading }/>
      <HStack ml="auto" gap={ 2 }/>
      <AddressMultichainInfoButton loading={ isLoading } addressData={ addressQuery.data }/>
      { !isLoading && addressQuery.data?.is_contract && addressQuery.data?.is_verified && config.UI.views.address.solidityscanEnabled &&
        <SolidityscanReport hash={ hash }/> }
      { !isLoading && nameServicesFeature.isEnabled && nameServicesFeature.ens.isEnabled &&
        <AddressEnsDomains query={ addressEnsDomainsQuery } addressHash={ hash } mainDomainName={ addressQuery.data?.ens_domain_name }/> }
      { !isLoading && nameServicesFeature.isEnabled && nameServicesFeature.clusters.isEnabled &&
        <AddressClusters query={ addressClustersQuery } addressHash={ hash }/> }
      <NetworkExplorers type="address" pathParam={ hash }/>
    </Flex>
  );

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle
        title={ addressQuery.data?.is_contract && addressQuery.data?.proxy_type !== 'eip7702' ?
          tQuat('addresses.contract_details') : tQuat('addresses.address_details') }
        contentAfter={ titleContentAfter }
        secondRow={ titleSecondRow }
        isLoading={ isLoading }
      />
      { !addressMetadataQuery.isPending &&
        <AddressAlerts tags={ addressMetadataQuery.data?.addresses?.[hash.toLowerCase()]?.tags }/> }
      { config.features.metasuites.isEnabled && <Box display="none" id="meta-suites__address" data-ready={ !isLoading }/> }
      <RoutedTabs tabs={ tabs } isLoading={ isTabsLoading }/>
    </>
  );
};

export default AddressPageContent;
