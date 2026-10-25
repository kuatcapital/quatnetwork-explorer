// Modified by Quat Capital, 2026-10-25: keep internal-call IDs separate from display translations. GPL-3.0.
import type { TxInternalsType } from 'types/api/internalTransaction';

export type Sort = 'value-asc' | 'value-desc' | 'gas-limit-asc' | 'gas-limit-desc' | 'default';
export type SortField = 'value' | 'gas-limit';

interface TxInternalsTypeItem {
  titleKey: string;
  id: TxInternalsType;
}

export const TX_INTERNALS_ITEMS: Array<TxInternalsTypeItem> = [
  { titleKey: 'transactions.internal_call', id: 'call' },
  { titleKey: 'transactions.internal_delegate', id: 'delegatecall' },
  { titleKey: 'transactions.internal_static', id: 'staticcall' },
  { titleKey: 'transactions.internal_create', id: 'create' },
  { titleKey: 'transactions.internal_create2', id: 'create2' },
  { titleKey: 'transactions.internal_self_destruct', id: 'selfdestruct' },
  { titleKey: 'home.reward', id: 'reward' },
];
