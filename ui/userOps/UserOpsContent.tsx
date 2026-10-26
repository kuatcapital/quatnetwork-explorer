// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import { Box } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/pagination/Pagination';
import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';
import UserOpsListItem from 'ui/userOps/UserOpsListItem';
import UserOpsTable from 'ui/userOps/UserOpsTable';

type Props = {
  query: QueryWithPagesResult<'general:user_ops'>;
  showTx?: boolean;
  showSender?: boolean;
};

const UserOpsContent = ({ query, showTx = true, showSender = true }: Props) => {
  const { t: tQuat } = useTranslation();

  if (query.isError) {
    return <DataFetchAlert/>;
  }

  const content = query.data?.items ? (
    <>
      <Box hideBelow="lg">
        <UserOpsTable
          items={ query.data.items }
          top={ query.pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
          isLoading={ query.isPlaceholderData }
          showTx={ showTx }
          showSender={ showSender }
        />
      </Box>
      <Box hideFrom="lg">
        { query.data.items.map((item, index) => (
          <UserOpsListItem
            key={ item.hash + (query.isPlaceholderData ? String(index) : '') }
            item={ item }
            isLoading={ query.isPlaceholderData }
            showTx={ showTx }
            showSender={ showSender }
          />
        )) }
      </Box>
    </>
  ) : null;

  const actionBar = query.pagination.isVisible ? (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...query.pagination }/>
    </ActionBar>
  ) : null;

  return (
    <DataListDisplay
      isError={ query.isError }
      itemsNum={ query.data?.items?.length }
      emptyText={ tQuat('operationsUi.empty') }
      actionBar={ actionBar }
    >
      { content }
    </DataListDisplay>
  );
};

export default UserOpsContent;
