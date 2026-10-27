// Modified by Quat Capital, 2026-10-27: T18 reviewed literal localization. GPL-3.0.
import React from 'react';

import { EmptyState } from 'toolkit/chakra/empty-state';
import { ContentLoader } from 'toolkit/components/loaders/ContentLoader';

import SearchResultsList from './SearchResultsList';
import SearchResultsTabAll from './SearchResultsTabAll';
import type { QueryType, SearchQueries } from './utils';
import { useTranslation } from 'react-i18next';


const EMPTY_SEARCH_NAME_MAP: Record<QueryType, string> = {
  addresses: 'addresses',
  tokens: 'tokens',
  blockNumbers: 'block numbers',
  blocks: 'blocks',
  transactions: 'transactions',
  nfts: 'NFTs',
  domains: 'names',
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
          title={ queryType ? `No ${ EMPTY_SEARCH_NAME_MAP[queryType] } found` : tQuat('multiUi.no_results') }
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
