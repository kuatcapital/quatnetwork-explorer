// Modified by Quat Capital, 2026-10-26: reactive labels with stable filter ids and values. GPL-3.0.
import type { TFunction } from 'i18next';

import type { AdvancedFilterAge } from 'types/api/advancedFilter';
import type { TokenInfo } from 'types/api/token';
import type { ClusterChainConfig } from 'types/multichain';

import config from 'configs/app';
import { getTokenTypes } from 'lib/token/tokenTypes';

export type ColumnsIds = 'tx_hash' | 'type' | 'method' | 'age' | 'from' | 'or_and' | 'to' | 'amount' | 'asset' | 'fee';

type TxTableColumn = {
  id: ColumnsIds;
  name: string;
  width: string;
  isNumeric?: boolean;
};

export const TABLE_COLUMNS: Array<TxTableColumn> = [
  {
    id: 'tx_hash',
    name: 'Tx hash',
    width: '180px',
  },
  {
    id: 'type',
    name: 'Type',
    width: '160px',
  },
  {
    id: 'method',
    name: 'Method',
    width: '160px',
  },
  {
    id: 'age',
    name: 'Age',
    width: '190px',
  },
  {
    id: 'from',
    name: 'From',
    width: '160px',
  },
  {
    id: 'or_and',
    name: '',
    width: '65px',
  },
  {
    id: 'to',
    name: 'To',
    width: '160px',
  },
  {
    id: 'amount',
    name: 'Amount',
    isNumeric: true,
    width: '150px',
  },
  {
    id: 'asset',
    name: 'Asset',
    width: '120px',
  },
  {
    id: 'fee',
    name: 'Fee',
    isNumeric: true,
    width: '120px',
  },
] as const;

export const getAdvancedFilterTypes = (
  chainConfig?: Array<ClusterChainConfig['app_config']> | ClusterChainConfig['app_config'], withAll = false, t?: TFunction,
) => {
  return [
    ...(withAll ? [ {
      id: 'all',
      name: t ? t('common.all') : 'All',
    } ] : []),
    {
      id: 'coin_transfer',
      name: t ? t('advancedFilterUi.coin_transfer') : 'Coin Transfer',
    },
    ...Object.entries(getTokenTypes(false, chainConfig))
      .map(([ id, name ]) => ({
        id,
        name: t ? t('advancedFilterUi.token_transfer', { type: name }) : `${ name } Transfer`,
      })),
    {
      id: 'contract_creation',
      name: t ? t('advancedFilterUi.contract_creation') : 'Contract Creation',
    },
    {
      id: 'contract_interaction',
      name: t ? t('advancedFilterUi.contract_interaction') : 'Contract Interaction',
    },
  ];
};

export const NATIVE_TOKEN = {
  name: config.chain.currency.name || '',
  icon_url: '',
  symbol: config.chain.currency.symbol || '',
  address_hash: 'native',
  type: 'ERC-20' as const,
} as TokenInfo;

export function getTableColumns(t: TFunction): Array<TxTableColumn> {
  const labels: Record<ColumnsIds, string> = {
    tx_hash: t('advancedFilterUi.tx_hash'),
    type: t('common.type'),
    method: t('common.method'),
    age: t('common.age'),
    from: t('common.from'),
    or_and: '',
    to: t('common.to'),
    amount: t('common.amount'),
    asset: t('advancedFilterUi.asset'),
    fee: t('common.fee'),
  };
  return TABLE_COLUMNS.map(column => ({ ...column, name: labels[column.id] }));
}

export function getAdvancedFilterAgeLabel(age: AdvancedFilterAge, t: TFunction): string {
  switch (age) {
    case '1h': return t('advancedFilterUi.age_1h');
    case '24h': return t('advancedFilterUi.age_24h');
    case '7d': return t('advancedFilterUi.age_7d');
    case '1m': return t('advancedFilterUi.age_1m');
    case '3m': return t('advancedFilterUi.age_3m');
    case '6m': return t('advancedFilterUi.age_6m');
  }
}
