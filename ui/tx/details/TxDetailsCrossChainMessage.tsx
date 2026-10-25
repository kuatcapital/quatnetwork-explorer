// Modified by Quat Capital, 2026-10-25: runtime transaction interface localization. GPL-3.0.
import { chakra, HStack } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { InterchainMessage } from '@blockscout/interchain-indexer-types';

import config from 'configs/app';
import { mdash } from 'toolkit/utils/htmlEntities';
import * as DetailedInfoItemBreakdown from 'ui/shared/DetailedInfo/DetailedInfoItemBreakdown';
import DetailedInfoTimestamp from 'ui/shared/DetailedInfo/DetailedInfoTimestamp';
import AddressEntityInterchain from 'ui/shared/entities/address/AddressEntityInterchain';
import CrossChainMessageEntity from 'ui/shared/entities/crossChainMessage/CrossChainMessageEntity';
import TxEntityInterchain from 'ui/shared/entities/tx/TxEntityInterchain';
import ChainLabel from 'ui/shared/externalChains/ChainLabel';
import CrossChainTxsStatusTag from 'ui/shared/statusTag/CrossChainTxsStatusTag';

interface Props {
  data: InterchainMessage;
  isLoading: boolean;
}

const TxDetailsCrossChainMessage = ({ data, isLoading }: Props) => {
  const { t: tTx } = useTranslation();

  return (
    <HStack columnGap={ 3 } rowGap={ 0 } flexWrap="wrap">
      <CrossChainMessageEntity id={ data.message_id } isLoading={ isLoading }/>
      <DetailedInfoItemBreakdown.Container loading={ isLoading }>
        <DetailedInfoItemBreakdown.Row
          label={ tTx('common.timestamp') }
        >
          <DetailedInfoTimestamp
            timestamp={ data.receive_timestamp || data.send_timestamp }
            isLoading={ isLoading }
            flexWrap={{ base: 'wrap', lg: 'nowrap' }}
          />
        </DetailedInfoItemBreakdown.Row>
        <DetailedInfoItemBreakdown.Row
          label={ tTx('common.status') }
          alignSelf="center"
        >
          <CrossChainTxsStatusTag status={ data.status } loading={ isLoading } mode="full"/>
        </DetailedInfoItemBreakdown.Row>
        { data.source_chain && data.source_chain?.id !== config.chain.id && (
          <DetailedInfoItemBreakdown.Row
            label={ tTx('transactions.source_chain') }
          >
            <ChainLabel
              data={ data.source_chain }
              isLoading={ isLoading }
              fallback={ <chakra.span color="text.secondary">{ mdash }</chakra.span> }
            />
          </DetailedInfoItemBreakdown.Row>
        ) }
        { data.source_transaction_hash && data.source_chain && data.source_chain?.id !== config.chain.id && (
          <DetailedInfoItemBreakdown.Row
            label={ tTx('transactions.source_tx') }
          >
            <TxEntityInterchain
              chain={ data.source_chain }
              hash={ data.source_transaction_hash }
              isLoading={ isLoading }
              noIcon
            />
          </DetailedInfoItemBreakdown.Row>
        ) }
        { data.destination_chain && data.destination_chain?.id !== config.chain.id && (
          <DetailedInfoItemBreakdown.Row
            label={ tTx('transactions.destination_chain') }
          >
            <ChainLabel
              data={ data.destination_chain }
              isLoading={ isLoading }
              fallback={ <chakra.span color="text.secondary">{ mdash }</chakra.span> }
            />
          </DetailedInfoItemBreakdown.Row>
        ) }
        { data.destination_transaction_hash && data.destination_chain && data.destination_chain?.id !== config.chain.id && (
          <DetailedInfoItemBreakdown.Row
            label={ tTx('transactions.destination_tx') }
          >
            <TxEntityInterchain
              chain={ data.destination_chain }
              hash={ data.destination_transaction_hash }
              isLoading={ isLoading }
              noIcon
            />
          </DetailedInfoItemBreakdown.Row>
        ) }
        { data.sender && (
          <DetailedInfoItemBreakdown.Row
            label={ tTx('transactions.sender') }
          >
            <AddressEntityInterchain
              chain={ data.source_chain }
              address={ data.sender }
              isLoading={ isLoading }
              noIcon
            />
          </DetailedInfoItemBreakdown.Row>
        ) }
        { data.recipient && (
          <DetailedInfoItemBreakdown.Row
            label={ tTx('transactions.target') }
          >
            <AddressEntityInterchain
              chain={ data.destination_chain }
              address={ data.recipient }
              isLoading={ isLoading }
              noIcon
            />
          </DetailedInfoItemBreakdown.Row>
        ) }
      </DetailedInfoItemBreakdown.Container>
    </HStack>
  );
};

export default React.memo(TxDetailsCrossChainMessage);
