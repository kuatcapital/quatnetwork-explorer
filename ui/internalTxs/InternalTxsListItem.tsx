// Modified by Quat Capital, 2026-10-25: runtime transaction interface localization. GPL-3.0.
import { Flex, HStack } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { InternalTransaction } from 'types/api/internalTransaction';
import type { ClusterChainConfig } from 'types/multichain';

import { currencyUnits } from 'lib/units';
import { Badge } from 'toolkit/chakra/badge';
import { Skeleton } from 'toolkit/chakra/skeleton';
import AddressFromTo from 'ui/shared/address/AddressFromTo';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import TxStatus from 'ui/shared/statusTag/TxStatus';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';
import { TX_INTERNALS_ITEMS } from 'ui/tx/internals/utils';

type Props = InternalTransaction & { currentAddress?: string; isLoading?: boolean; showBlockInfo?: boolean; chainData?: ClusterChainConfig };

const InternalTxsListItem = ({
  type,
  from,
  to,
  value,
  success,
  error,
  created_contract: createdContract,
  transaction_hash: txnHash,
  block_number: blockNumber,
  timestamp,
  currentAddress,
  isLoading,
  showBlockInfo = true,
  chainData,
}: Props) => {
  const { t: tTx } = useTranslation();
  const titleKey = TX_INTERNALS_ITEMS.find(({ id }) => id === type)?.titleKey;
  const typeTitle = titleKey ? tTx(titleKey) : undefined;
  const toData = to ? to : createdContract;

  return (
    <ListItemMobile rowGap={ 3 }>
      <Flex columnGap={ 2 }>
        { typeTitle && <Badge colorPalette="cyan" loading={ isLoading }>{ typeTitle }</Badge> }
        { !success && <TxStatus status="error" errorText={ error } isLoading={ isLoading }/> }
      </Flex>
      <Flex justifyContent="space-between" width="100%">
        <TxEntity
          hash={ txnHash }
          isLoading={ isLoading }
          fontWeight={ 700 }
          truncation="constant_long"
          chain={ chainData }
        />
        <TimeWithTooltip
          timestamp={ timestamp }
          isLoading={ isLoading }
          color="text.secondary"
          fontWeight="400"
          fontSize="sm"
        />
      </Flex>
      { showBlockInfo && (
        <HStack gap={ 1 }>
          <Skeleton loading={ isLoading } fontSize="sm" fontWeight={ 500 }>{ tTx('common.block') }</Skeleton>
          <BlockEntity
            isLoading={ isLoading }
            number={ blockNumber }
            noIcon
            textStyle="sm"
          />
        </HStack>
      ) }
      <AddressFromTo
        from={ from }
        to={ toData }
        current={ currentAddress }
        isLoading={ isLoading }
        w="100%"
      />
      <HStack gap={ 3 }>
        <Skeleton loading={ isLoading } fontSize="sm" fontWeight={ 500 }>{ tTx('transactions.value_amount') }{ ' ' }{ currencyUnits.ether }</Skeleton>
        <NativeCoinValue
          amount={ value }
          noSymbol
          accuracy={ 0 }
          loading={ isLoading }
          minW={ 6 }
          fontSize="sm"
          color="text.secondary"
        />
      </HStack>
    </ListItemMobile>
  );
};

export default InternalTxsListItem;
