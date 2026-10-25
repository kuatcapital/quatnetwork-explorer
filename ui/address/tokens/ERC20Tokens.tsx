// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import { Box } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { AddressTokenBalance } from 'types/api/address';
import type { PaginationParams } from 'ui/shared/pagination/types';

import config from 'configs/app';
import useIsMobile from 'lib/hooks/useIsMobile';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/pagination/Pagination';

import ERC20TokensListItem from './ERC20TokensListItem';
import ERC20TokensTable from './ERC20TokensTable';

type Props = {
  items: Array<Pick<AddressTokenBalance, 'token' | 'value'>> | undefined;
  isLoading: boolean;
  pagination: PaginationParams;
  isError: boolean;
  top?: number;
};

const ERC20Tokens = ({ items, isLoading, pagination, isError, top }: Props) => {
  const { t: tQuat } = useTranslation();

  const isMobile = useIsMobile();

  const hasAdditionalTokenTypes = config.chain.additionalTokenTypes.length > 0;

  const actionBar = isMobile && pagination.isVisible && (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  );

  const content = items ? (
    <>
      <Box hideBelow="lg">
        <ERC20TokensTable
          data={ items }
          top={ top ?? (pagination.isVisible ? 72 : 0) }
          isLoading={ isLoading }
          hasAdditionalTokenTypes={ hasAdditionalTokenTypes }/>
      </Box>
      <Box hideFrom="lg">{ items.map((item, index) => (
        <ERC20TokensListItem
          key={ item.token.address_hash + (isLoading ? index : '') }
          { ...item }
          isLoading={ isLoading }
          hasAdditionalTokenTypes={ hasAdditionalTokenTypes }
        />
      )) }
      </Box>
    </>
  ) : null;

  return (
    <DataListDisplay
      isError={ isError }
      itemsNum={ items?.length }
      emptyText={ tQuat('addresses.no_selected_tokens') }
      actionBar={ actionBar }
    >
      { content }
    </DataListDisplay>
  );

};

export default ERC20Tokens;
