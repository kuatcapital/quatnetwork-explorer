// Modified by Quat Capital, 2026-10-27: complete runtime multichain localization. GPL-3.0.
// Modified by Quat Capital, 2026-10-26: T18 reviewed literal localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { InterchainMessage } from '@blockscout/interchain-indexer-types';
import { MessageStatus } from '@blockscout/interchain-indexer-types';

import DetailedInfoTimestamp from 'ui/shared/DetailedInfo/DetailedInfoTimestamp';
import TxEntityInterchain from 'ui/shared/entities/tx/TxEntityInterchain';
import ChainLabel from 'ui/shared/externalChains/ChainLabel';
import { Root, Item, Trigger, ItemContent, ItemBody, ItemRow } from 'ui/shared/lifecycle/LifecycleAccordion';

interface Props {
  data: InterchainMessage;
  isLoading?: boolean;
}

const TxCrossChainDetailsLifecycle = ({ data, isLoading }: Props) => {
  const { t: tQuat } = useTranslation();

  const isError = data.status === MessageStatus.MESSAGE_STATUS_FAILED;

  const firstStepContent = (() => {
    if (!data.source_transaction_hash) {
      return <Trigger status="unfinalized" text={ tQuat('multiUi.initiated') } isFirst isLast isLoading={ isLoading } isDisabled/>;
    }

    const isLast = isError && !data.destination_transaction_hash;

    return (
      <>
        <Trigger
          status={ isLast && isError ? 'error' : 'success' }
          text={ tQuat('multiUi.initiated') }
          isFirst
          isLast={ isLast }
          isLoading={ isLoading }
        />
        <ItemContent isLast={ isLast }>
          <ItemBody>
            <ItemRow label={ tQuat('transactions.chain') }>
              <ChainLabel data={ data.source_chain } isLoading={ isLoading } py="6px"/>
            </ItemRow>
            <ItemRow label={ tQuat('common.transaction') }>
              <TxEntityInterchain
                chain={ data.source_chain }
                hash={ data.source_transaction_hash }
                isLoading={ isLoading }
                noIcon
                py="6px"
              />
            </ItemRow>
            <ItemRow label={ tQuat('common.timestamp') }>
              <DetailedInfoTimestamp
                timestamp={ data.send_timestamp }
                isLoading={ isLoading }
                flexWrap={{ base: 'wrap', lg: 'nowrap' }}
                py="6px"
              />
            </ItemRow>
          </ItemBody>
        </ItemContent>
      </>
    );
  })();

  const secondStepContent = (() => {
    if (!data.destination_transaction_hash) {
      if (isError) {
        return null;
      }
      return <Trigger status="unfinalized" text={ tQuat('multiUi.completed') } isFirst={ false } isLast isLoading={ isLoading } isDisabled/>;
    }

    return (
      <>
        <Trigger
          status={ isError ? 'error' : 'success' }
          text={ tQuat('multiUi.completed') }
          isFirst={ false }
          isLast
          isLoading={ isLoading }
        />
        <ItemContent isLast>
          <ItemBody>
            <ItemRow label={ tQuat('transactions.chain') }>
              <ChainLabel data={ data.destination_chain } isLoading={ isLoading } py="6px"/>
            </ItemRow>
            <ItemRow label={ tQuat('common.transaction') }>
              <TxEntityInterchain
                chain={ data.destination_chain }
                hash={ data.destination_transaction_hash }
                isLoading={ isLoading }
                noIcon
                py="6px"
              />
            </ItemRow>
            { data.receive_timestamp && (
              <ItemRow label={ tQuat('common.timestamp') }>
                <DetailedInfoTimestamp
                  timestamp={ data.receive_timestamp }
                  isLoading={ isLoading }
                  flexWrap={{ base: 'wrap', lg: 'nowrap' }}
                  py="6px"
                />
              </ItemRow>
            ) }
          </ItemBody>
        </ItemContent>
      </>
    );
  })();

  return (
    <Root>
      <Item value="initiated">
        { firstStepContent }
      </Item>
      <Item value="completed">
        { secondStepContent }
      </Item>
    </Root>
  );
};

export default React.memo(TxCrossChainDetailsLifecycle);
