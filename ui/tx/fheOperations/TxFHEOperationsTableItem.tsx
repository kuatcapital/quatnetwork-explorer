// Modified by Quat Capital, 2026-10-25: runtime transaction interface localization. GPL-3.0.
import { Text } from '@chakra-ui/react';
import { capitalize } from 'es-toolkit';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { FheOperation } from 'types/api/fheOperations';

import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { Badge } from 'toolkit/chakra/badge';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import { getTypeColor } from 'ui/tx/fheOperations/utils';

type Props = FheOperation & { isLoading?: boolean };

const TxFHEOperationsTableItem = (props: Props) => {
  const { locale } = useLocale();
  const { t: tTx } = useTranslation();
  const { log_index: logIndex, operation, type, fhe_type: fheType, is_scalar: isScalar, hcu_cost: hcuCost, hcu_depth: hcuDepth, caller, isLoading } = props;
  const hcuDepthValue = hcuDepth;

  return (
    <TableRow>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading }>
          { logIndex }
        </Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading }>
          { operation }
        </Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle">
        <Badge colorPalette={ getTypeColor(type) } loading={ isLoading }>
          { capitalize(type) }
        </Badge>
      </TableCell>
      <TableCell verticalAlign="middle">
        <Badge colorPalette="gray" loading={ isLoading }>
          { fheType }
        </Badge>
      </TableCell>
      <TableCell verticalAlign="middle">
        <Badge colorPalette="gray" loading={ isLoading }>
          { isScalar ? tTx('transactions.scalar') : tTx('transactions.non_scalar') }
        </Badge>
      </TableCell>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading }>
          { formatNumber(hcuCost, locale) }
        </Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading } color="text.secondary">
          { formatNumber(hcuDepthValue, locale) }
        </Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle">
        { caller && caller.hash ? (
          <AddressEntity
            address={ caller }
            truncation="dynamic"
            isLoading={ isLoading }
          />
        ) : (
          <Text color="text.secondary">—</Text>
        ) }
      </TableCell>
    </TableRow>
  );
};

export default React.memo(TxFHEOperationsTableItem);
