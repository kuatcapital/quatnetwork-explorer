// Modified by Quat Capital, 2026-10-27: complete runtime multichain localization. GPL-3.0.
import { BigNumber } from 'bignumber.js';
import React from 'react';

import type { AddressesItem } from 'types/api/addresses';

import { formatBigNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';

type Props = {
  item: AddressesItem;
  isLoading?: boolean;
};

const AddressesLabelSearchTableItem = ({
  item,
  isLoading,
}: Props) => {
  const { locale } = useLocale();

  return (
    <TableRow>
      <TableCell>
        <AddressEntity
          address={ item }
          isLoading={ isLoading }
          fontWeight={ 700 }
          my="2px"
        />
      </TableCell>
      <TableCell isNumeric>
        <NativeCoinValue
          amount={ item.coin_balance }
          noSymbol
          loading={ isLoading }
          lineHeight="24px"
        />
      </TableCell>
      <TableCell isNumeric>
        <Skeleton loading={ isLoading } display="inline-block" lineHeight="24px">
          { formatBigNumber(BigNumber(item.transactions_count), locale) }
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(AddressesLabelSearchTableItem);
