// Modified by Quat Capital, 2026-10-27: complete runtime multichain localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import { EmptyState } from 'toolkit/chakra/empty-state';
import { ContentLoader } from 'toolkit/components/loaders/ContentLoader';

import SearchResultsList from './SearchResultsList';
import SearchResultsTabAll from './SearchResultsTabAll';
import type { QueryType, SearchQueries } from './utils';

const EMPTY_SEARCH_KEYS: Record<QueryType, string> = {
  addresses: 'multiUi.empty_addresses', tokens: 'multiUi.empty_tokens', blockNumbers: 'multiUi.empty_block_numbers',
  blocks: 'multiUi.empty_blocks', transactions: 'multiUi.empty_transactions', nfts: 'multiUi.empty_nfts', domains: 'multiUi.empty_names',
};

interface Props {
  isLoading: boolean;
  searchTerm: string;
  queries: SearchQueries;
  queryType: QueryType | undefined;
  beforeContent?: React.ReactNode;
}

const SearchResultTabContent = ({ isLoading, searchTerm, queries, queryType, beforeContent }: Props) => {
  const { t: tQuat } = useTranslation();

  const content = (() => {
    if (isLoading) {
      return <ContentLoader maxW="240px"/>;
    }

    if (!searchTerm) {
      return (
        <EmptyState
          title={ tQuat('multiUi.looking') }
          description={ tQuat('multiUi.search_help') }
        />
      );
    }

    const hasResults = queryType ?
      queries[queryType]?.data?.pages?.[0]?.items && queries[queryType]?.data?.pages?.[0]?.items?.length > 0 :
      Object.values(queries).some((query) => query.data?.pages?.[0]?.items?.length > 0);

    if (!hasResults) {
      return (
        <EmptyState
          title={ queryType ? tQuat(EMPTY_SEARCH_KEYS[queryType]) : tQuat('multiUi.no_results') }
          description={ tQuat('multiUi.no_results_hint') }
        />
      );
    }

    switch (queryType) {
      case 'addresses':
      case 'blocks':
      case 'blockNumbers':
      case 'transactions':
      case 'tokens':
      case 'nfts':
      case 'domains':
        return <SearchResultsList queryType={ queryType } query={ queries[queryType] }/>;
      default:
        return <SearchResultsTabAll queries={ queries }/>;
    }
  })();

  return (
    <>
      { beforeContent }
      { content }
    </>
  );
};

export default React.memo(SearchResultTabContent);
