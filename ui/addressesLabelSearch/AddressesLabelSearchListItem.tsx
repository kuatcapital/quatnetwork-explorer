// Modified by Quat Capital, 2026-10-27: T18 reviewed literal localization. GPL-3.0.
import { HStack } from '@chakra-ui/react';
import React from 'react';

import type { AddressesItem } from 'types/api/addresses';

import { currencyUnits } from 'lib/units';
import { Skeleton } from 'toolkit/chakra/skeleton';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';
import { useTranslation } from 'react-i18next';


type Props = {
  item: AddressesItem;
  isLoading?: boolean;
};

const AddressesLabelSearchListItem = ({
  item,
  isLoading,
}: Props) => {
  const { t: tQuat } = useTranslation();


  return (
    <ListItemMobile rowGap={ 3 }>
      <AddressEntity
        address={ item }
        isLoading={ isLoading }
        fontWeight={ 700 }
        w="100%"
      />
      <HStack gap={ 3 } maxW="100%" alignItems="flex-start">
        <Skeleton loading={ isLoading } fontSize="sm" fontWeight={ 500 } flexShrink={ 0 }>{ `Balance ${ currencyUnits.ether }` }</Skeleton>
        <NativeCoinValue
          amount={ item.coin_balance }
          noSymbol
          loading={ isLoading }
          fontSize="sm"
          color="text.secondary"
        />
      </HStack>
      <HStack gap={ 3 }>
        <Skeleton loading={ isLoading } fontSize="sm" fontWeight={ 500 }>{ tQuat('addresses.transaction_count') }</Skeleton>
        <Skeleton loading={ isLoading } fontSize="sm" color="text.secondary">
          <span>{ Number(item.transactions_count).toLocaleString() }</span>
        </Skeleton>
      </HStack>
    </ListItemMobile>
  );
};

export default React.memo(AddressesLabelSearchListItem);
