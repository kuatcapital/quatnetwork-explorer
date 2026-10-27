// Modified by Quat Capital, 2026-10-27: translated route titles preserve chain names. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import config from 'configs/app';
import { USER_OPS_ITEM } from 'stubs/userOps';
import { generateListStub } from 'stubs/utils';
import PageTitle from 'ui/shared/Page/PageTitle';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import UserOpsContent from 'ui/userOps/UserOpsContent';

const UserOps = () => {
  const { t } = useTranslation();
  const query = useQueryWithPages({
    resourceName: 'general:user_ops',
    options: {
      placeholderData: generateListStub<'general:user_ops'>(USER_OPS_ITEM, 50, { next_page_params: {
        page_token: '10355938,0x5956a847d8089e254e02e5111cad6992b99ceb9e5c2dc4343fd53002834c4dc6',
        page_size: 50,
      } }),
    },
  });

  return (
    <>
      <PageTitle
        title={ config.meta.seo.enhancedDataEnabled ?
          t('pageUi.chain_user_operations', { chain: config.chain.name }) : t('pageUi.user_operations') }
        withTextAd
      />
      <UserOpsContent query={ query }/>
    </>
  );
};

export default UserOps;
