// Modified by Quat Capital, 2026-10-26: localize block, gas and statistics UI. GPL-3.0.
import { Box } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import DataListDisplay from 'ui/shared/DataListDisplay';
import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';
import BeaconChainWithdrawalsList from 'ui/withdrawals/beaconChain/BeaconChainWithdrawalsList';
import BeaconChainWithdrawalsTable from 'ui/withdrawals/beaconChain/BeaconChainWithdrawalsTable';

type Props = {
  blockWithdrawalsQuery: QueryWithPagesResult<'general:block_withdrawals'>;
};
const TABS_HEIGHT = 88;

const BlockWithdrawals = ({ blockWithdrawalsQuery }: Props) => {
  const { t } = useTranslation();
  const content = blockWithdrawalsQuery.data?.items ? (
    <>
      <Box hideFrom="lg">
        <BeaconChainWithdrawalsList
          items={ blockWithdrawalsQuery.data.items }
          isLoading={ blockWithdrawalsQuery.isPlaceholderData }
          view="block"
        />
      </Box>
      <Box hideBelow="lg">
        <BeaconChainWithdrawalsTable
          items={ blockWithdrawalsQuery.data.items }
          isLoading={ blockWithdrawalsQuery.isPlaceholderData }
          top={ blockWithdrawalsQuery.pagination.isVisible ? TABS_HEIGHT : 0 }
          view="block"
        />
      </Box>
    </>
  ) : null ;

  return (
    <DataListDisplay
      isError={ blockWithdrawalsQuery.isError }
      itemsNum={ blockWithdrawalsQuery.data?.items?.length }
      emptyText={ t('blockDetails.withdrawals_empty') }
    >
      { content }
    </DataListDisplay>
  );
};

export default BlockWithdrawals;
