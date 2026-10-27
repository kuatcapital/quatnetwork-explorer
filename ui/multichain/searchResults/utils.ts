// Modified by Quat Capital, 2026-10-27: runtime multichain localization. GPL-3.0.
import type { TFunction } from 'i18next';
import type { ReturnType } from 'lib/api/useApiInfiniteQuery';

export interface SearchQueries {
  addresses: ReturnType<'multichainAggregator:search_addresses'>;
  tokens: ReturnType<'multichainAggregator:search_tokens'>;
  blockNumbers: ReturnType<'multichainAggregator:search_block_numbers'>;
  blocks: ReturnType<'multichainAggregator:search_blocks'>;
  transactions: ReturnType<'multichainAggregator:search_transactions'>;
  nfts: ReturnType<'multichainAggregator:search_nfts'>;
  domains: ReturnType<'multichainAggregator:search_domains'>;
}

export type QueryType = keyof SearchQueries;

export const SEARCH_TABS_NAMES: Record<QueryType, string> = {
  tokens: 'Tokens (ERC-20)',
  nfts: 'NFTs (ERC-721 & 1155)',
  addresses: 'Addresses',
  blockNumbers: 'Block numbers',
  blocks: 'Blocks',
  transactions: 'Transactions',
  domains: 'Names',
};

export const SEARCH_TABS_IDS: Record<QueryType, string> = {
  addresses: 'addresses',
  tokens: 'tokens',
  blockNumbers: 'block_numbers',
  blocks: 'blocks',
  transactions: 'transactions',
  nfts: 'nfts',
  domains: 'names',
};

export function getSearchTabsNames(t: TFunction): Record<QueryType, string> {
  return {
    tokens: t('multiUi.search_tokens'),
    nfts: t('multiUi.search_nfts'),
    addresses: t('common.addresses'),
    blockNumbers: t('multiUi.block_numbers'),
    blocks: t('common.blocks'),
    transactions: t('common.transactions'),
    domains: t('search.categories.names'),
  };
}
