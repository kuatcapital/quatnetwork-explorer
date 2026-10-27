import { HStack } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { MudWorldItem } from 'types/api/mudWorlds';

import { NUMBER_LOCALES } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
// Modified by Quat Capital, 2026-10-27: T18 reviewed literal localization. GPL-3.0.

import { currencyUnits } from 'lib/units';
import { Skeleton } from 'toolkit/chakra/skeleton';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';

type Props = {
  item: MudWorldItem;
  isLoading?: boolean;
};

const MudWorldsListItem = ({
  item,
  isLoading,
}: Props) => {
  const { locale } = useLocale();
  const { t: tQuat } = useTranslation();

  return (
    <ListItemMobile rowGap={ 3 }>
      <AddressEntity
        address={ item.address }
        isLoading={ isLoading }
        fontWeight={ 700 }
        mr={ 2 }
        truncation="constant_long"
      />
      <HStack gap={ 3 } maxW="100%" alignItems="flex-start" textStyle="sm">
        <Skeleton loading={ isLoading } fontWeight={ 500 } flexShrink={ 0 }><span>{ tQuat('suppUi.balance_currency', { currency: currencyUnits.ether }) }</span></Skeleton>
        <NativeCoinValue
          amount={ item.coin_balance }
          noSymbol
          loading={ isLoading }
          color="text.secondary"
        />
      </HStack>
      <HStack gap={ 3 }>
        <Skeleton loading={ isLoading } fontSize="sm" fontWeight={ 500 }>{ tQuat('suppUi.txn_count') }</Skeleton>
        <Skeleton loading={ isLoading } fontSize="sm" color="text.secondary">
          <span>{ Number(item.transactions_count).toLocaleString(NUMBER_LOCALES[locale]) }</span>
        </Skeleton>
      </HStack>
    </ListItemMobile>
  );
};

export default React.memo(MudWorldsListItem);
