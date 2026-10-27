// Modified by Quat Capital, 2026-10-27: reactive operation page labels. GPL-3.0.
import { inRange } from 'es-toolkit';
import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';
import type { Log } from 'types/api/log';
import type { TokenTransfer } from 'types/api/tokenTransfer';

import useApiQuery from 'lib/api/useApiQuery';
import throwOnAbsentParamError from 'lib/errors/throwOnAbsentParamError';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import getQueryParamString from 'lib/router/getQueryParamString';
import { USER_OP } from 'stubs/userOps';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import TextAd from 'ui/shared/ad/TextAd';
import PageTitle from 'ui/shared/Page/PageTitle';
import TxLogs from 'ui/tx/TxLogs';
import TxTokenTransfer from 'ui/tx/TxTokenTransfer';
import useTxQuery from 'ui/tx/useTxQuery';
import UserOpDetails from 'ui/userOp/UserOpDetails';
import UserOpRaw from 'ui/userOp/UserOpRaw';
import UserOpSubHeading from 'ui/userOp/UserOpSubHeading';

const UserOp = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const hash = getQueryParamString(router.query.hash);

  const userOpQuery = useApiQuery('general:user_op', {
    pathParams: { hash },
    queryOptions: {
      enabled: Boolean(hash),
      placeholderData: USER_OP,
    },
  });

  const txQuery = useTxQuery({ hash: userOpQuery.data?.transaction_hash, isEnabled: !userOpQuery.isPlaceholderData });

  const filterTokenTransfersByLogIndex = React.useCallback((tt: TokenTransfer) => {
    if (!userOpQuery.data) {
      return true;
    } else {
      if (!userOpQuery.data.user_logs_start_index || !userOpQuery.data.user_logs_count) {
        return false;
      }
      if (inRange(
        Number(tt.log_index),
        userOpQuery.data?.user_logs_start_index,
        userOpQuery.data?.user_logs_start_index + userOpQuery.data?.user_logs_count,
      )) {
        return true;
      }
      return false;
    }
  }, [ userOpQuery.data ]);

  const filterLogsByLogIndex = React.useCallback((log: Log) => {
    if (!userOpQuery.data) {
      return true;
    } else {
      if (!userOpQuery.data.user_logs_start_index || !userOpQuery.data.user_logs_count) {
        return false;
      }
      if (inRange(log.index, userOpQuery.data?.user_logs_start_index, userOpQuery.data?.user_logs_start_index + userOpQuery.data?.user_logs_count)) {
        return true;
      }
      return false;
    }
  }, [ userOpQuery.data ]);

  const tabs: Array<TabItemRegular> = React.useMemo(() => ([
    { id: 'index', title: t('common.details'), component: <UserOpDetails query={ userOpQuery }/> },
    {
      id: 'token_transfers',
      title: t('common.token_transfers'),
      component: <TxTokenTransfer txQuery={ txQuery } tokenTransferFilter={ filterTokenTransfersByLogIndex }/>,
    },
    { id: 'logs', title: t('common.logs'), component: <TxLogs txQuery={ txQuery } logsFilter={ filterLogsByLogIndex }/> },
    { id: 'raw', title: t('sharedUi.raw'), component: <UserOpRaw rawData={ userOpQuery.data?.raw } isLoading={ userOpQuery.isPlaceholderData }/> },
  ]), [ userOpQuery, txQuery, filterTokenTransfersByLogIndex, filterLogsByLogIndex, t ]);

  throwOnAbsentParamError(hash);
  throwOnResourceLoadError(userOpQuery);

  const titleSecondRow = <UserOpSubHeading hash={ hash }/>;

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle
        title={ t('pageUi.user_operation_details') }
        secondRow={ titleSecondRow }
      />
      <RoutedTabs tabs={ tabs } isLoading={ userOpQuery.isPlaceholderData }/>
    </>
  );
};

export default UserOp;
