// Modified by Quat Capital, 2026-10-25: localized transaction type badges. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { TransactionType } from 'types/api/transaction';

import type { BadgeProps } from 'toolkit/chakra/badge';
import { Badge } from 'toolkit/chakra/badge';

export interface Props extends BadgeProps {
  types: Array<TransactionType>;
  isLoading?: boolean;
}

const TYPES_ORDER: Array<TransactionType> = [
  'blob_transaction',
  'rootstock_remasc',
  'rootstock_bridge',
  'token_creation',
  'contract_creation',
  'token_transfer',
  'contract_call',
  'coin_transfer',
];

const TxType = ({ types, isLoading, ...rest }: Props) => {
  const { t: tTx } = useTranslation();
  const typeToShow = types.sort((t1, t2) => TYPES_ORDER.indexOf(t1) - TYPES_ORDER.indexOf(t2))[0];

  let label;
  let colorPalette: BadgeProps['colorPalette'];

  switch (typeToShow) {
    case 'contract_call':
      label = tTx('transactions.contract_call');
      colorPalette = 'blue';
      break;
    case 'blob_transaction':
      label = tTx('transactions.blob_txn');
      colorPalette = 'yellow';
      break;
    case 'contract_creation':
      label = tTx('transactions.contract_creation_type');
      colorPalette = 'blue';
      break;
    case 'token_transfer':
      label = tTx('transactions.token_transfer');
      colorPalette = 'orange';
      break;
    case 'token_creation':
      label = tTx('transactions.token_creation');
      colorPalette = 'orange';
      break;
    case 'coin_transfer':
      label = tTx('transactions.coin_transfer');
      colorPalette = 'orange';
      break;
    case 'rootstock_remasc':
      label = 'REMASC';
      colorPalette = 'blue';
      break;
    case 'rootstock_bridge':
      label = tTx('transactions.bridge');
      colorPalette = 'blue';
      break;
    default:
      label = tTx('common.transaction');
      colorPalette = 'purple';
  }

  if (!label) {
    return null;
  }

  return (
    <Badge colorPalette={ colorPalette } loading={ isLoading } { ...rest }>
      { label }
    </Badge>
  );
};

export default TxType;
