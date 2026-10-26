// Modified by Quat Capital, 2026-10-26: explicit locale presentation; API values unchanged. GPL-3.0.
import React from 'react';

import type { ValidatorStability } from 'types/api/validators';

import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import ValidatorStatus from 'ui/shared/statusTag/ValidatorStabilityStatus';

interface Props {
  data: ValidatorStability;
  isLoading?: boolean;
}

const ValidatorsTableItem = ({ data, isLoading }: Props) => {
  const { locale } = useLocale();
  return (
    <TableRow>
      <TableCell verticalAlign="middle">
        <AddressEntity
          address={ data.address }
          isLoading={ isLoading }
          truncation="constant"
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        <ValidatorStatus state={ data.state } isLoading={ isLoading }/>
      </TableCell>
      <TableCell verticalAlign="middle" isNumeric>
        <Skeleton loading={ isLoading }>
          { formatNumber(data.blocks_validated_count, locale) }
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(ValidatorsTableItem);
