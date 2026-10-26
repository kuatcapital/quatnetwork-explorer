// Modified by Quat Capital, 2026-10-26: account interface localization. GPL-3.0.
import { Flex, HStack, Text } from '@chakra-ui/react';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import type { AddressTag } from 'types/api/account';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tag } from 'toolkit/chakra/tag';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import TableItemActionButtons from 'ui/shared/TableItemActionButtons';

interface Props {
  item: AddressTag;
  onEditClick: (data: AddressTag) => void;
  onDeleteClick: (data: AddressTag) => void;
  isLoading?: boolean;
}

const AddressTagListItem = ({ item, onEditClick, onDeleteClick, isLoading }: Props) => {
  const { t: tAcct } = useTranslation();
  const onItemEditClick = useCallback(() => {
    return onEditClick(item);
  }, [ item, onEditClick ]);

  const onItemDeleteClick = useCallback(() => {
    return onDeleteClick(item);
  }, [ item, onDeleteClick ]);

  return (
    <ListItemMobile>
      <Flex alignItems="flex-start" flexDirection="column" maxW="100%">
        <AddressEntity
          address={ item.address }
          isLoading={ isLoading }
          fontWeight="600"
          w="100%"
        />
        <HStack gap={ 3 } mt={ 4 }>
          <Text textStyle="sm" fontWeight="medium">{ tAcct('accountUI.private_tag') }</Text>
          <Skeleton loading={ isLoading } display="inline-block" borderRadius="sm">
            <Tag>
              { item.name }
            </Tag>
          </Skeleton>
        </HStack>
      </Flex>
      <TableItemActionButtons onDeleteClick={ onItemDeleteClick } onEditClick={ onItemEditClick } isLoading={ isLoading }/>
    </ListItemMobile>
  );
};

export default React.memo(AddressTagListItem);
