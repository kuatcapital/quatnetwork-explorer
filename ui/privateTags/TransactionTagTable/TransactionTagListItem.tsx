// Modified by Quat Capital, 2026-10-26: account interface localization. GPL-3.0.
import { HStack, Text, Flex } from '@chakra-ui/react';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import type { TransactionTag } from 'types/api/account';

import { Tag } from 'toolkit/chakra/tag';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import TableItemActionButtons from 'ui/shared/TableItemActionButtons';

interface Props {
  item: TransactionTag;
  isLoading?: boolean;
  onEditClick: (data: TransactionTag) => void;
  onDeleteClick: (data: TransactionTag) => void;
}

const TransactionTagListItem = ({ item, isLoading, onEditClick, onDeleteClick }: Props) => {
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
        <TxEntity
          hash={ item.transaction_hash }
          isLoading={ isLoading }
          fontWeight={ 600 }
          maxW="100%"
        />
        <HStack gap={ 3 } mt={ 4 }>
          <Text textStyle="sm" fontWeight={ 500 }>{ tAcct('accountUI.private_tag') }</Text>
          <Tag loading={ isLoading } truncated>{ item.name }</Tag>
        </HStack>
      </Flex>
      <TableItemActionButtons onDeleteClick={ onItemDeleteClick } onEditClick={ onItemEditClick } isLoading={ isLoading }/>
    </ListItemMobile>
  );
};

export default React.memo(TransactionTagListItem);
