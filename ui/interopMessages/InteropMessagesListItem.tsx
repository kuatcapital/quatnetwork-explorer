// Modified by Quat Capital, 2026-10-27: continue runtime RU/KK/EN localization. GPL-3.0.
// Modified by Quat Capital, 2026-10-26: T18 reviewed literal localization. GPL-3.0.
import { Flex, HStack, Text, Grid } from '@chakra-ui/react';
import React from 'react';

import type { InteropMessage } from 'types/api/interop';

import AddressFromToIcon from 'ui/shared/address/AddressFromToIcon';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import AddressEntityInterop from 'ui/shared/entities/address/AddressEntityInterop';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import InteropMessageStatus from 'ui/shared/statusTag/InteropMessageStatus';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';

import InteropMessageAdditionalInfo from './InteropMessageAdditionalInfo';
import InteropMessageDestinationTx from './InteropMessageDestinationTx';
import InteropMessageSourceTx from './InteropMessageSourceTx';
import { useTranslation } from 'react-i18next';


interface Props {
  item: InteropMessage;
  isLoading?: boolean;
}

const InteropMessagesListItem = ({ item, isLoading }: Props) => {
  const { t: tQuat } = useTranslation();

  return (
    <ListItemMobile rowGap={ 2 }>
      <Flex alignItems="center" justifyContent="space-between" w="100%">
        <InteropMessageStatus status={ item.status } isLoading={ isLoading }/>
        <InteropMessageAdditionalInfo payload={ item.payload } isLoading={ isLoading }/>
      </Flex>
      <Flex alignItems="flex-start" flexDirection="column" gap={ 2 } w="100%">
        <HStack w="100%">
          <Text fontWeight={ 500 } flexGrow={ 1 }>#{ item.nonce }</Text>
          <TimeWithTooltip timestamp={ item.timestamp } isLoading={ isLoading } color="text.secondary"/>
        </HStack>
        <Grid templateColumns="120px 1fr" rowGap={ 2 }>
          <Text as="span" color="text.secondary">{ tQuat('l2Ui.source_tx') }</Text>
          <InteropMessageSourceTx { ...item } isLoading={ isLoading }/>
          <Text as="span" color="text.secondary">{ tQuat('l2Ui.destination_tx') }</Text>
          <InteropMessageDestinationTx { ...item } isLoading={ isLoading }/>
        </Grid>
        <Flex gap={ 2 } justifyContent="space-between" mt={ 2 }>
          { item.init_chain !== undefined ? (
            <AddressEntityInterop
              chain={ item.init_chain }
              address={{ hash: item.sender_address_hash }}
              isLoading={ isLoading }
              truncation="constant"
            />
          ) : (
            <AddressEntity address={{ hash: item.sender_address_hash }} isLoading={ isLoading } truncation="constant"/>
          ) }
          <AddressFromToIcon
            isLoading={ isLoading }
            type={ item.init_chain !== undefined ? 'in' : 'out' }
          />
          { item.relay_chain !== undefined ? (
            <AddressEntityInterop
              chain={ item.relay_chain }
              address={{ hash: item.target_address_hash }}
              isLoading={ isLoading }
              truncation="constant"
            />
          ) : (
            <AddressEntity address={{ hash: item.target_address_hash }} isLoading={ isLoading } truncation="constant"/>
          ) }
        </Flex>
      </Flex>
    </ListItemMobile>
  );
};

export default React.memo(InteropMessagesListItem);
