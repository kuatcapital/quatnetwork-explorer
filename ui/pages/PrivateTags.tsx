// Modified by Quat Capital, 2026-10-26: account interface localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';

import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import PrivateAddressTags from 'ui/privateTags/PrivateAddressTags';
import PrivateTransactionTags from 'ui/privateTags/PrivateTransactionTags';
import PageTitle from 'ui/shared/Page/PageTitle';
import useRedirectForInvalidAuthToken from 'ui/snippets/auth/useRedirectForInvalidAuthToken';

const PrivateTags = () => {
  const { t: tAcct } = useTranslation();
  const tabs = React.useMemo<Array<TabItemRegular>>(() => [
    { id: 'address', title: tAcct('accountUI.address'), component: <PrivateAddressTags/> },
    { id: 'tx', title: tAcct('accountUI.transaction'), component: <PrivateTransactionTags/> },
  ], [ tAcct ]);
  useRedirectForInvalidAuthToken();

  return (
    <>
      <PageTitle title={ tAcct('accountUI.private_tags') }/>
      <RoutedTabs tabs={ tabs }/>
    </>
  );
};

export default PrivateTags;
