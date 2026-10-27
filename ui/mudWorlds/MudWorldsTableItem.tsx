// Modified by Quat Capital, 2026-10-27: selected-locale MUD transaction counts. GPL-3.0.
import React from 'react';

import type { MudWorldItem } from 'types/api/mudWorlds';

import { NUMBER_LOCALES } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';

type Props = { item: MudWorldItem; isLoading?: boolean };

const MudWorldsTableItem = ({ item, isLoading }: Props) => {
  const { locale } = useLocale();
  return (
    <TableRow>
      <TableCell verticalAlign="middle">
        <AddressEntity address={ item.address } isLoading={ isLoading } fontWeight={ 700 }/>
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
          { Number(item.transactions_count).toLocaleString(NUMBER_LOCALES[locale]) }
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default MudWorldsTableItem;
