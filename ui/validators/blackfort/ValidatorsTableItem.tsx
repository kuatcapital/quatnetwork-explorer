// Modified by Quat Capital, 2026-10-26: explicit locale presentation; API values unchanged. GPL-3.0.
import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { ValidatorBlackfort } from 'types/api/validators';

import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import { TruncatedText } from 'toolkit/components/truncation/TruncatedText';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';

interface Props {
  data: ValidatorBlackfort;
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
        <Flex>
          <TruncatedText text={ data.name } loading={ isLoading }/>
        </Flex>
      </TableCell>
      <TableCell verticalAlign="middle" isNumeric>
        <Skeleton loading={ isLoading }>
          { `${ formatNumber(data.commission / 100, locale) }%` }
        </Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle" isNumeric>
        <NativeCoinValue
          amount={ data.self_bonded_amount }
          loading={ isLoading }
          noSymbol
        />
      </TableCell>
      <TableCell verticalAlign="middle" isNumeric>
        <NativeCoinValue
          amount={ data.delegated_amount }
          loading={ isLoading }
          noSymbol
        />
      </TableCell>
    </TableRow>
  );
};

export default React.memo(ValidatorsTableItem);
