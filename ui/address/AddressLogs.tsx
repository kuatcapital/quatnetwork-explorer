// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'react-i18next';

import useIsMounted from 'lib/hooks/useIsMounted';
import getQueryParamString from 'lib/router/getQueryParamString';
import { LOG } from 'stubs/log';
import { generateListStub } from 'stubs/utils';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import LogItem from 'ui/shared/logs/LogItem';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

import AddressCsvExportLink from './AddressCsvExportLink';
import useAddressQuery from './utils/useAddressQuery';

type Props = {
  shouldRender?: boolean;
  isQueryEnabled?: boolean;
};

const AddressLogs = ({ shouldRender = true, isQueryEnabled = true }: Props) => {
  const { t: tQuat } = useTranslation();

  const router = useRouter();
  const isMounted = useIsMounted();

  const hash = getQueryParamString(router.query.hash);
  const { data, isPlaceholderData, isError, pagination } = useQueryWithPages({
    resourceName: 'general:address_logs',
    pathParams: { hash },
    options: {
      enabled: isQueryEnabled,
      placeholderData: generateListStub<'general:address_logs'>(LOG, 3, { next_page_params: {
        block_number: 9005750,
        index: 42,
        items_count: 50,
        transaction_index: 23,
      } }),
    },
  });

  const addressQuery = useAddressQuery({ hash });

  const actionBar = (
    <ActionBar mt={ -6 } showShadow justifyContent={{ base: 'space-between', lg: 'end' }}>
      <AddressCsvExportLink
        address={ hash }
        isLoading={ pagination.isLoading }
        params={{ type: 'logs' }}
      />
      <Pagination ml={{ base: 0, lg: 8 }} { ...pagination }/>
    </ActionBar>
  );

  if (!isMounted || !shouldRender) {
    return null;
  }

  const content = data?.items ? data.items.map((item, index) => (
    <LogItem
      key={ index }
      { ...item }
      type="address"
      isLoading={ isPlaceholderData }
      defaultDataType={ addressQuery.data?.zilliqa?.is_scilla_contract ? 'UTF-8' : undefined }
    />
  )) : null;

  return (
    <DataListDisplay
      isError={ isError }
      itemsNum={ data?.items?.length }
      emptyText={ tQuat('addresses.no_logs') }
      actionBar={ actionBar }
    >
      { content }
    </DataListDisplay>
  );
};

export default AddressLogs;
