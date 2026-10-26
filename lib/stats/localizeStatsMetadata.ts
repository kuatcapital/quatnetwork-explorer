// Modified by Quat Capital, 2026-10-26: localize known stats metadata by stable API id. GPL-3.0.
import type { TFunction } from 'i18next';

interface StatsMetadata {
  id?: string;
  title?: string;
  description?: string;
  units?: string;
}

// Known ids are seeded from upstream mocks/stats/lines.ts and mocks/stats/main.tsx.
// Do not infer identity from a mutable/translated API title.
const METRIC_KEYS: Readonly<Record<string, { title: string; description: string }>> = {
  accountsGrowth: { title: 'statsMetadata.metrics.accountsGrowth.title', description: 'statsMetadata.metrics.accountsGrowth.description' },
  activeAccounts: { title: 'statsMetadata.metrics.activeAccounts.title', description: 'statsMetadata.metrics.activeAccounts.description' },
  newAccounts: { title: 'statsMetadata.metrics.newAccounts.title', description: 'statsMetadata.metrics.newAccounts.description' },
  averageTxnFee: { title: 'statsMetadata.metrics.averageTxnFee.title', description: 'statsMetadata.metrics.averageTxnFee.description' },
  newTxns: { title: 'statsMetadata.metrics.newTxns.title', description: 'statsMetadata.metrics.newTxns.description' },
  txnsFee: { title: 'statsMetadata.metrics.txnsFee.title', description: 'statsMetadata.metrics.txnsFee.description' },
  txnsGrowth: { title: 'statsMetadata.metrics.txnsGrowth.title', description: 'statsMetadata.metrics.txnsGrowth.description' },
  txnsSuccessRate: { title: 'statsMetadata.metrics.txnsSuccessRate.title', description: 'statsMetadata.metrics.txnsSuccessRate.description' },
  averageBlockRewards: { title: 'statsMetadata.metrics.averageBlockRewards.title', description: 'statsMetadata.metrics.averageBlockRewards.description' },
  averageBlockSize: { title: 'statsMetadata.metrics.averageBlockSize.title', description: 'statsMetadata.metrics.averageBlockSize.description' },
  newBlocks: { title: 'statsMetadata.metrics.newBlocks.title', description: 'statsMetadata.metrics.newBlocks.description' },
  newNativeCoinTransfers: {
    title: 'statsMetadata.metrics.newNativeCoinTransfers.title', description: 'statsMetadata.metrics.newNativeCoinTransfers.description',
  },
  averageGasLimit: { title: 'statsMetadata.metrics.averageGasLimit.title', description: 'statsMetadata.metrics.averageGasLimit.description' },
  averageGasPrice: { title: 'statsMetadata.metrics.averageGasPrice.title', description: 'statsMetadata.metrics.averageGasPrice.description' },
  gasUsedGrowth: { title: 'statsMetadata.metrics.gasUsedGrowth.title', description: 'statsMetadata.metrics.gasUsedGrowth.description' },
  newVerifiedContracts: { title: 'statsMetadata.metrics.newVerifiedContracts.title', description: 'statsMetadata.metrics.newVerifiedContracts.description' },
  verifiedContractsGrowth: {
    title: 'statsMetadata.metrics.verifiedContractsGrowth.title', description: 'statsMetadata.metrics.verifiedContractsGrowth.description',
  },
  newTxnsWindow: { title: 'statsMetadata.metrics.newTxnsWindow.title', description: 'statsMetadata.metrics.newTxnsWindow.description' },
  newOperationalTxnsWindow: {
    title: 'statsMetadata.metrics.newOperationalTxnsWindow.title', description: 'statsMetadata.metrics.newOperationalTxnsWindow.description',
  },
  averageBlockTime: { title: 'statsMetadata.metrics.averageBlockTime.title', description: 'statsMetadata.metrics.averageBlockTime.description' },
  totalAddresses: { title: 'statsMetadata.metrics.totalAddresses.title', description: 'statsMetadata.metrics.totalAddresses.description' },
  totalBlocks: { title: 'statsMetadata.metrics.totalBlocks.title', description: 'statsMetadata.metrics.totalBlocks.description' },
  totalTxns: { title: 'statsMetadata.metrics.totalTxns.title', description: 'statsMetadata.metrics.totalTxns.description' },
  yesterdayTxns: { title: 'statsMetadata.metrics.yesterdayTxns.title', description: 'statsMetadata.metrics.yesterdayTxns.description' },
  totalOperationalTxns: { title: 'statsMetadata.metrics.totalOperationalTxns.title', description: 'statsMetadata.metrics.totalOperationalTxns.description' },
  yesterdayOperationalTxns: {
    title: 'statsMetadata.metrics.yesterdayOperationalTxns.title', description: 'statsMetadata.metrics.yesterdayOperationalTxns.description',
  },
};
const SECTION_KEYS: Readonly<Record<string, string>> = {
  accounts: 'statsMetadata.sections.accounts', transactions: 'statsMetadata.sections.transactions',
  blocks: 'statsMetadata.sections.blocks', tokens: 'statsMetadata.sections.tokens',
  gas: 'statsMetadata.sections.gas', contracts: 'statsMetadata.sections.contracts',
};

export function localizeStatsSection<T extends StatsMetadata>(source: T, t: TFunction): T {
  const key = source.id && Object.hasOwn(SECTION_KEYS, source.id) ? SECTION_KEYS[source.id] : undefined;
  return key ? { ...source, title: t(key) } : source;
}

export function localizeStatsUnits(units: string | undefined, t: TFunction): string | undefined {
  switch (units) {
    case 'Bytes': return t('statsMetadata.units.bytes');
    case 's': return t('statsMetadata.units.seconds');
    default: return units;
  }
}

export function localizeStatsMetadata<T extends StatsMetadata>(source: T, t: TFunction, nativeSymbol = 'ETH'): T {
  const keys = source.id && Object.hasOwn(METRIC_KEYS, source.id) ? METRIC_KEYS[source.id] : undefined;
  if (!keys) {
    return source;
  }
  const unit = source.units || (source.id === 'averageGasPrice' ? 'Gwei' : nativeSymbol);
  return {
    ...source,
    title: t(keys.title, { unit }),
    description: t(keys.description, { unit }),
    units: localizeStatsUnits(source.units, t),
  };
}
