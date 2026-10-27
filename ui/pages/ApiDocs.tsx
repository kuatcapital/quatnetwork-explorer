// Modified by Quat Capital, 2026-10-27: localized documentation page labels. GPL-3.0.
import { Text } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';

import config from 'configs/app';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import EthRpcApi from 'ui/apiDocs/EthRpcApi';
import GraphQL from 'ui/apiDocs/GraphQL';
import RestApi from 'ui/apiDocs/RestApi';
import RpcApi from 'ui/apiDocs/RpcApi';
import AlertWithExternalHtml from 'ui/shared/alerts/AlertWithExternalHtml';
import PageTitle from 'ui/shared/Page/PageTitle';

const feature = config.features.apiDocs;

const ApiDocs = () => {
  const { t } = useTranslation();

  const tabs: Array<TabItemRegular> = [
    { id: 'rest_api', title: 'REST API', component: <RestApi/> },
    { id: 'eth_rpc_api', title: 'ETH RPC API', component: <EthRpcApi/> },
    { id: 'rpc_api', title: t('pageUi.rpc_endpoints'), component: <RpcApi/> },
    { id: 'graphql_api', title: 'GraphQL API', component: <GraphQL/> },
  ].filter(({ id }) => feature.isEnabled && feature.tabs.includes(id));

  return (
    <>
      <PageTitle
        title={ config.meta.seo.enhancedDataEnabled ?
          t('pageUi.chain_api_documentation', { chain: config.chain.name }) : t('pageUi.api_documentation') }
      />
      { feature.isEnabled && feature.alertMessage ? <AlertWithExternalHtml html={ feature.alertMessage } status="info" showIcon mb={ 6 }/> : null }
      { tabs.length > 0 ? <RoutedTabs tabs={ tabs }/> : <Text>{ t('pageUi.no_api_documentation') }</Text> }
    </>
  );
};

export default React.memo(ApiDocs);
