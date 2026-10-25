// Modified by Quat Capital, 2026-10-25: runtime transaction interface localization. GPL-3.0.
import { Grid, Text, Flex, Box } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { InteropTransactionInfo } from 'types/api/transaction';

import config from 'configs/app';
import { layerLabels } from 'lib/rollups/utils';
import { CollapsibleDetails } from 'toolkit/chakra/collapsible';
import InteropMessageDestinationTx from 'ui/interopMessages/InteropMessageDestinationTx';
import InteropMessageSourceTx from 'ui/interopMessages/InteropMessageSourceTx';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import AddressEntityInterop from 'ui/shared/entities/address/AddressEntityInterop';
import InteropMessageStatus from 'ui/shared/statusTag/InteropMessageStatus';

const rollupFeature = config.features.rollup;

type Props = {
  data?: InteropTransactionInfo;
  isLoading: boolean;
};

const TxDetailsInterop = ({ data, isLoading }: Props) => {
  const { t: tTx } = useTranslation();
  const hasInterop = rollupFeature.isEnabled && rollupFeature.interopEnabled;

  if (!hasInterop || !data) {
    return null;
  }

  const details = (
    <Grid
      gridTemplateColumns="100px 1fr"
      textStyle="sm"
      bgColor={{ _light: 'blackAlpha.50', _dark: 'whiteAlpha.50' }}
      px={ 4 }
      py={ 2 }
      mt={ 3 }
      w="100%"
      rowGap={ 4 }
      borderRadius="md"
    >
      <Text color="text.secondary">{ tTx('transactions.message_id') }</Text>
      <Text>{ data.nonce }</Text>
      <Text color="text.secondary">{ tTx('transactions.interop_status') }</Text>
      <Box>
        <InteropMessageStatus status={ data.status }/>
      </Box>
      <Text color="text.secondary">{ tTx('transactions.sender') }</Text>
      { data.init_chain !== undefined ? (
        <AddressEntityInterop
          chain={ data.init_chain }
          address={{ hash: data.sender_address_hash }}
          isLoading={ isLoading }
          truncation="constant"
        />
      ) : (
        <AddressEntity address={{ hash: data.sender_address_hash }} isLoading={ isLoading } truncation="constant"/>
      ) }
      <Text color="text.secondary">{ tTx('transactions.target') }</Text>
      { data.relay_chain !== undefined ? (
        <AddressEntityInterop
          chain={ data.relay_chain }
          address={{ hash: data.target_address_hash }}
          isLoading={ isLoading }
          truncation="constant"
        />
      ) : (
        <AddressEntity address={{ hash: data.target_address_hash }} isLoading={ isLoading } truncation="constant"/>
      ) }
      <Text color="text.secondary">{ tTx('transactions.payload') }</Text>
      <Flex overflow="hidden">
        <Text
          wordBreak="break-all"
          whiteSpace="normal"
          overflow="hidden"
          flex="1"
        >
          { data.payload }
        </Text>
        <CopyToClipboard text={ data.payload }/>
      </Flex>
    </Grid>
  );

  if (data.init_chain !== undefined) {
    return (
      <>
        <DetailedInfo.ItemLabel
          hint={ tTx('transactions.interop_source_hint', { layer: layerLabels.current }) }
          isLoading={ isLoading }
        >
          { tTx('transactions.interop_source_tx') }</DetailedInfo.ItemLabel>
        <DetailedInfo.ItemValue flexWrap="wrap" mt={{ lg: 1 }}>
          <InteropMessageSourceTx { ...data } isLoading={ isLoading }/>
          <CollapsibleDetails variant="secondary" noScroll ml={ 3 }>
            { details }
          </CollapsibleDetails>
        </DetailedInfo.ItemValue>
      </>
    );
  }

  if (data.relay_chain !== undefined) {
    return (
      <>
        <DetailedInfo.ItemLabel
          hint={ tTx('transactions.interop_relay_hint', { layer: layerLabels.current }) }
          isLoading={ isLoading }
        >
          { tTx('transactions.interop_relay_tx') }</DetailedInfo.ItemLabel>
        <DetailedInfo.ItemValue flexWrap="wrap" mt={{ lg: 1 }}>
          <InteropMessageDestinationTx { ...data } isLoading={ isLoading }/>
          <CollapsibleDetails variant="secondary" noScroll ml={ 3 }>
            { details }
          </CollapsibleDetails>
        </DetailedInfo.ItemValue>
      </>
    );
  }
  return null;
};

export default TxDetailsInterop;
