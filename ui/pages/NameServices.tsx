// Modified by Quat Capital, 2026-10-27: complete runtime multichain localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';

import config from 'configs/app';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import Clusters from 'ui/nameServices/directories/Clusters';
import NameDomains from 'ui/nameServices/domains/NameDomains';
import PageTitle from 'ui/shared/Page/PageTitle';

const feature = config.features.nameServices;

const NameServices = () => {
  const { t: tQuat } = useTranslation();
  const tabs: Array<TabItemRegular> = [
    feature.isEnabled && feature.ens.isEnabled && { id: 'domains', title: tQuat('multiUi.domains'), component: <NameDomains/> },
    feature.isEnabled && feature.clusters.isEnabled && { id: 'directories', title: tQuat('multiUi.directories'), component: <Clusters/> },
  ].filter(Boolean);

  return (
    <>
      <PageTitle
        title={ config.meta.seo.enhancedDataEnabled ? tQuat('multiUi.name_services_chain', { chain: config.chain.name }) : tQuat('multiUi.name_lookup') }
        withTextAd
      />
      <RoutedTabs tabs={ tabs }/>
    </>
  );
};

export default NameServices;
