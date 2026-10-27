// Modified by Quat Capital, 2026-10-27: complete runtime multichain localization. GPL-3.0.
import type { JsxStyleProps } from '@chakra-ui/react';
import { chakra, Grid, HStack } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { InterchainMessage } from '@blockscout/interchain-indexer-types';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import dayjs from 'lib/date/dayjs';
import { useLocale } from 'lib/i18n/provider';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { mdash } from 'toolkit/utils/htmlEntities';
import CrossChainBridgeLink from 'ui/shared/crossChain/CrossChainBridgeLink';
import CrossChainFromToTag from 'ui/shared/crossChain/CrossChainFromToTag';
import AddressEntityInterchain from 'ui/shared/entities/address/AddressEntityInterchain';
import CrossChainMessageEntity from 'ui/shared/entities/crossChainMessage/CrossChainMessageEntity';
import TxEntityInterchain from 'ui/shared/entities/tx/TxEntityInterchain';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import CrossChainTxsStatusTag from 'ui/shared/statusTag/CrossChainTxsStatusTag';
import TextSeparator from 'ui/shared/TextSeparator';
import Time from 'ui/shared/time/Time';
import TokenValueInterchain from 'ui/shared/value/TokenValueInterchain';

interface Props extends JsxStyleProps {
  data: InterchainMessage;
  isLoading?: boolean;
  currentAddress?: string;
}

const TransactionsCrossChainListItem = ({ data, isLoading, rowGap = 3, currentAddress, ...rest }: Props) => {
  const { locale } = useLocale();

  const { t: tQuat } = useTranslation();

  const timestamp = data.send_timestamp || data.receive_timestamp;
  const firstTransfer = data.transfers.length > 0 ? data.transfers[0] : null;
  const txHashWithTransfers = (() => {
    if (data.transfers.length === 0) {
      return;
    }

    if (config.chain.id === data.source_chain?.id) {
      return data.source_transaction_hash;
    }

    if (config.chain.id === data.destination_chain?.id) {
      return data.destination_transaction_hash;
    }
  })();

  const dashElement = <chakra.span color="text.secondary">{ mdash }</chakra.span>;

  return (
    <ListItemMobile rowGap={ rowGap } { ...rest }>
      <HStack>
        <CrossChainTxsStatusTag status={ data.status } loading={ isLoading } mode="full"/>
        { currentAddress && (
          <CrossChainFromToTag
            type={ data.sender?.hash.toLowerCase() === currentAddress.toLowerCase() && config.chain.id === data.source_chain?.id ? 'out' : 'in' }
            isLoading={ isLoading }
          />
        ) }
      </HStack>
      <CrossChainMessageEntity
        id={ data.message_id }
        isLoading={ isLoading }
        fontWeight={ 600 }
        noIcon={ false }
        truncation="dynamic"
        w="100%"
      />
      { timestamp && (
        <Skeleton loading={ isLoading } display="flex" alignItems="center" color="text.secondary">
          <div>{ dayjs(timestamp).locale(locale).fromNow() }</div>
          <TextSeparator/>
          <Time timestamp={ timestamp } format="lll_s"/>
        </Skeleton>
      ) }
      <Grid templateColumns="120px minmax(0, 1fr)" columnGap={ 2 } rowGap={ rowGap }>
        <Skeleton loading={ isLoading }>{ tQuat('transactions.source_tx') }</Skeleton>
        { data.source_transaction_hash ? (
          <TxEntityInterchain
            chain={ data.source_chain }
            hash={ data.source_transaction_hash }
            isLoading={ isLoading }
          />
        ) : dashElement }
        <Skeleton loading={ isLoading }>{ tQuat('transactions.destination_tx') }</Skeleton>
        { data.destination_transaction_hash ? (
          <TxEntityInterchain
            chain={ data.destination_chain }
            hash={ data.destination_transaction_hash }
            isLoading={ isLoading }
          />
        ) : dashElement }
        <Skeleton loading={ isLoading }>{ tQuat('multiUi.message_sender') }</Skeleton>
        { data.sender ? (
          <AddressEntityInterchain
            chain={ data.source_chain }
            address={ data.sender }
            isLoading={ isLoading }
            noIcon
            currentAddress={ currentAddress }
          />
        ) : dashElement }
        <Skeleton loading={ isLoading }>{ tQuat('multiUi.transfers_short') }</Skeleton>
        { txHashWithTransfers ? (
          <Link
            href={ route({ pathname: '/tx/[hash]', query: { hash: txHashWithTransfers, tab: 'token_transfers_cross_chain' } }) }
            loading={ isLoading }
          >
            { data.transfers.length }
          </Link>
        ) : (
          <Skeleton loading={ isLoading } color="text.secondary">{ data.transfers.length }</Skeleton>
        ) }
        <Skeleton loading={ isLoading }>{ tQuat('transactions.sender') }</Skeleton>
        { firstTransfer?.sender ? (
          <AddressEntityInterchain
            chain={ data.source_chain }
            address={ firstTransfer.sender }
            isLoading={ isLoading }
            noIcon
            currentAddress={ currentAddress }
          />
        ) : dashElement }
        <Skeleton loading={ isLoading }>{ tQuat('multiUi.source_token') }</Skeleton>
        { firstTransfer?.source_token ? (
          <TokenValueInterchain
            token={ firstTransfer.source_token }
            amount={ firstTransfer.source_amount }
            chain={ firstTransfer.source_chain }
            loading={ isLoading }
          />
        ) : dashElement }
        <Skeleton loading={ isLoading }>{ tQuat('multiUi.recipient') }</Skeleton>
        { firstTransfer?.recipient ? (
          <AddressEntityInterchain
            chain={ data.destination_chain }
            address={ firstTransfer.recipient }
            isLoading={ isLoading }
            noIcon
            currentAddress={ currentAddress }
          />
        ) : dashElement }
        <Skeleton loading={ isLoading }>{ tQuat('multiUi.target_token') }</Skeleton>
        { firstTransfer?.destination_token ? (
          <TokenValueInterchain
            token={ firstTransfer.destination_token }
            amount={ firstTransfer.destination_amount }
            chain={ firstTransfer.destination_chain }
            loading={ isLoading }
          />
        ) : dashElement }
        <Skeleton loading={ isLoading }>{ tQuat('multiUi.protocol') }</Skeleton>
        { data.bridge ? (
          <CrossChainBridgeLink data={ data.bridge } isLoading={ isLoading }/>
        ) : dashElement }
      </Grid>
    </ListItemMobile>
  );
};

export default React.memo(TransactionsCrossChainListItem);
