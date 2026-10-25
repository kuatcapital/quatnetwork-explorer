// Modified by Quat Capital, 2026-10-25: runtime transaction interface localization. GPL-3.0.
import {
  Box,
  GridItem,
  Text,
  Spinner,
  Flex,
  chakra,
  VStack,
} from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import type * as tac from '@blockscout/tac-operation-lifecycle-types';
import { SCROLL_L2_BLOCK_STATUSES } from 'types/api/scrollL2';
import type { Transaction } from 'types/api/transaction';
import { ZKEVM_L2_TX_STATUSES } from 'types/api/transaction';
import { ZKSYNC_L2_TX_BATCH_STATUSES } from 'types/api/zkSyncL2';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { formatBigNumber, formatNumber } from 'lib/format/localeNumbers';
import useIsMobile from 'lib/hooks/useIsMobile';
import { useLocale } from 'lib/i18n/provider';
import getNetworkValidatorTitle from 'lib/networks/getNetworkValidatorTitle';
import * as arbitrum from 'lib/rollups/arbitrum';
import { formatZkEvmTxStatus, formatZkSyncL2TxnBatchStatus, layerLabels } from 'lib/rollups/utils';
import { currencyUnits } from 'lib/units';
import { Badge } from 'toolkit/chakra/badge';
import { CollapsibleDetails } from 'toolkit/chakra/collapsible';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import DetailedInfoNativeCoinValue from 'ui/shared/DetailedInfo/DetailedInfoNativeCoinValue';
import DetailedInfoSponsoredItem from 'ui/shared/DetailedInfo/DetailedInfoSponsoredItem';
import DetailedInfoTimestamp from 'ui/shared/DetailedInfo/DetailedInfoTimestamp';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import AddressEntityInterop from 'ui/shared/entities/address/AddressEntityInterop';
import BatchEntityL2 from 'ui/shared/entities/block/BatchEntityL2';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import IconSvg from 'ui/shared/IconSvg';
import LogDecodedInputData from 'ui/shared/logs/LogDecodedInputData';
import RawInputData from 'ui/shared/RawInputData';
import StatusTag from 'ui/shared/statusTag/StatusTag';
import TxStatus from 'ui/shared/statusTag/TxStatus';
import TextSeparator from 'ui/shared/TextSeparator';
import Utilization from 'ui/shared/Utilization/Utilization';
import GasPriceValue from 'ui/shared/value/GasPriceValue';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';
import VerificationSteps from 'ui/shared/verificationSteps/VerificationSteps';
import TxDetailsActions from 'ui/tx/details/txDetailsActions/TxDetailsActions';
import TxDetailsBurntFees from 'ui/tx/details/TxDetailsBurntFees';
import TxDetailsFeePerGas from 'ui/tx/details/TxDetailsFeePerGas';
import TxDetailsGasPrice from 'ui/tx/details/TxDetailsGasPrice';
import TxDetailsOther from 'ui/tx/details/TxDetailsOther';
import TxDetailsTokenTransfers from 'ui/tx/details/TxDetailsTokenTransfers';
import TxDetailsWithdrawalStatusOptimistic from 'ui/tx/details/TxDetailsWithdrawalStatusOptimistic';
import TxRevertReason from 'ui/tx/details/TxRevertReason';
import TxAllowedPeekers from 'ui/tx/TxAllowedPeekers';
import TxExternalTxs from 'ui/tx/TxExternalTxs';
import TxSocketAlert from 'ui/tx/TxSocketAlert';
import ZkSyncL2TxnBatchHashesInfo from 'ui/txnBatches/zkSyncL2/ZkSyncL2TxnBatchHashesInfo';

import { getLocalizedConfirmationDuration } from './confirmationDuration';
import TxDetailsCrossChainMessages from './TxDetailsCrossChainMessages';
import TxDetailsCrossChainTransfers from './TxDetailsCrossChainTransfers';
import TxDetailsGasUsage from './TxDetailsGasUsage';
import TxDetailsInterop from './TxDetailsInterop';
import TxDetailsSetMaxGasLimit from './TxDetailsSetMaxGasLimit';
import TxDetailsTacOperation from './TxDetailsTacOperation';
import TxDetailsTxFee from './TxDetailsTxFee';
import TxDetailsWithdrawalStatusArbitrum from './TxDetailsWithdrawalStatusArbitrum';
import TxInfoScrollFees from './TxInfoScrollFees';

interface Props {
  data: Transaction | undefined;
  tacOperations?: Array<tac.OperationDetails>;
  isLoading: boolean;
  socketStatus?: 'close' | 'error';
  noTxActions?: boolean;
}

const externalTxFeature = config.features.externalTxs;
const rollupFeature = config.features.rollup;
const VALIDATOR_TITLE_KEYS: Readonly<Record<string, string>> = {
  miner: 'transactions.miner', validator: 'common.validator', poster: 'home.poster',
  sequencer: 'home.sequencer', 'fee recipient': 'home.fee_recipient',
};
const ARBITRUM_STATUS_KEYS = [
  'transactions.step_processed_rollup', 'transactions.step_sent_chain', 'transactions.step_confirmed_chain',
] as const;
const ZKSYNC_STATUS_KEYS = [
  'transactions.step_processed_layer', 'transactions.step_sealed_layer', 'transactions.step_sent_parent',
  'transactions.step_validated_parent', 'transactions.step_executed_parent',
] as const;
const SCROLL_STATUS_KEYS: Record<typeof SCROLL_L2_BLOCK_STATUSES[number], string> = {
  'Confirmed by Sequencer': 'transactions.step_sequencer',
  Committed: 'transactions.step_committed',
  Finalized: 'transactions.finalized',
};

const TxInfo = ({ data, tacOperations, isLoading, socketStatus, noTxActions }: Props) => {
  const { locale } = useLocale();
  const { t: tTx } = useTranslation();
  const [ isExpanded, setIsExpanded ] = React.useState(false);

  const isMobile = useIsMobile();

  const externalTxsQuery = useApiQuery('general:tx_external_transactions', {
    pathParams: {
      hash: data?.hash,
    },
    queryOptions: {
      enabled: externalTxFeature.isEnabled,
      placeholderData: [ '1', '2', '3' ],
    },
  });

  const handleCutLinkClick = React.useCallback(() => {
    setIsExpanded((flag) => !flag);
  }, []);

  const showAssociatedL1Tx = React.useCallback(() => {
    setIsExpanded(true);
  }, []);

  if (!data) {
    return null;
  }

  const addressFromTags = [
    ...data.from.private_tags || [],
    ...data.from.public_tags || [],
    ...data.from.watchlist_names || [],
  ].map((tag) => <Badge key={ tag.label }>{ tag.display_name }</Badge>);

  const toAddress = data.to ? data.to : data.created_contract;
  const addressToTags = [
    ...toAddress?.private_tags || [],
    ...toAddress?.public_tags || [],
    ...toAddress?.watchlist_names || [],
  ].map((tag) => <Badge key={ tag.label }>{ tag.display_name }</Badge>);

  const executionSuccessBadge = toAddress?.is_contract && data.result === 'success' ? (
    <Tooltip content="Contract execution completed">
      <chakra.span display="inline-flex" ml={ 2 } mr={ 1 }>
        <IconSvg name="status/success" boxSize={ 4 } color={{ _light: 'blackAlpha.800', _dark: 'whiteAlpha.800' }} cursor="pointer"/>
      </chakra.span>
    </Tooltip>
  ) : null;
  const executionFailedBadge = toAddress?.is_contract && Boolean(data.status) && data.result !== 'success' ? (
    <Tooltip content="Error occurred during contract execution">
      <chakra.span display="inline-flex" ml={ 2 } mr={ 1 }>
        <IconSvg name="status/error" boxSize={ 4 } color="text.error" cursor="pointer"/>
      </chakra.span>
    </Tooltip>
  ) : null;

  const hasInterop = rollupFeature.isEnabled && rollupFeature.interopEnabled && data.op_interop_messages && data.op_interop_messages.length > 0;

  return (
    <DetailedInfo.Container templateColumns={{ base: 'minmax(0, 1fr)', lg: 'minmax(215px, auto) minmax(0, 1fr)' }}>

      { config.features.metasuites.isEnabled && (
        <>
          <Box display="none" as="p" id="meta-suites__tx-info-label" data-status={ data.status } data-ready={ !isLoading }/>
          <Box display="none" as="p" id="meta-suites__tx-info-value"/>
          <DetailedInfo.ItemDivider display="none" as="p" id="meta-suites__details-info-item-divider"/>
        </>
      ) }

      { socketStatus && (
        <GridItem colSpan={{ base: undefined, lg: 2 }} mb={ 2 }>
          <TxSocketAlert status={ socketStatus }/>
        </GridItem>
      ) }

      { tacOperations && tacOperations.length > 0 && <TxDetailsTacOperation tacOperations={ tacOperations } isLoading={ isLoading } txHash={ data.hash }/> }

      { data.op_interop_messages ? data.op_interop_messages.map((message) => (
        <TxDetailsInterop key={ message.nonce } data={ message } isLoading={ isLoading }/>
      )) : null }

      { config.features.crossChainTxs.isEnabled && <TxDetailsCrossChainMessages hash={ data.hash } isLoading={ isLoading }/> }

      <DetailedInfo.ItemLabel
        hint={ tTx('transactions.hash_hint') }
        isLoading={ isLoading }
      >
        { tTx('common.transaction_hash') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue multiRow={ config.features.externalTxs.isEnabled && externalTxsQuery.data && externalTxsQuery.data.length > 0 }>
        <Flex flexWrap="nowrap" alignItems="center" overflow="hidden">
          { data.status === null && <Spinner mr={ 2 } size="sm" flexShrink={ 0 }/> }
          <Skeleton loading={ isLoading } overflow="hidden">
            <HashStringShortenDynamic hash={ data.hash }/>
          </Skeleton>
          <CopyToClipboard text={ data.hash } isLoading={ isLoading }/>
          { config.features.metasuites.isEnabled && (
            <>
              <TextSeparator flexShrink={ 0 } display="none" id="meta-suites__tx-explorer-separator"/>
              <Box display="none" flexShrink={ 0 } id="meta-suites__tx-explorer-link"/>
            </>
          ) }
        </Flex>
        { config.features.externalTxs.isEnabled && externalTxsQuery.data && externalTxsQuery.data.length > 0 && (
          <Skeleton loading={ isLoading || externalTxsQuery.isPlaceholderData } display={{ base: 'block', lg: 'inline-flex' }} alignItems="center">
            { !isMobile && <TextSeparator flexShrink={ 0 }/> }
            <TxExternalTxs data={ externalTxsQuery.data }/>
          </Skeleton>
        ) }
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint={ tTx('transactions.status_hint') }
        isLoading={ isLoading }
      >
        {
          rollupFeature.isEnabled &&
          (rollupFeature.type === 'zkEvm' || rollupFeature.type === 'zkSync' || rollupFeature.type === 'arbitrum' || rollupFeature.type === 'scroll') ?
            tTx('transactions.layer_status_method', { layer: layerLabels.current }) :
            tTx('transactions.status_method')
        }
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <TxStatus status={ data.status } errorText={ data.status === 'error' ? data.result : undefined } isLoading={ isLoading }/>
        { data.method && (
          <Badge colorPalette={ data.method === 'Multicall' ? 'teal' : 'gray' } loading={ isLoading } truncated ml={ 3 }>
            { data.method }
          </Badge>
        ) }
        { data.arbitrum?.contains_message && (
          <Skeleton loading={ isLoading } onClick={ showAssociatedL1Tx }>
            <Link truncate ml={ 3 }>
              { data.arbitrum?.contains_message === 'incoming' ? tTx('transactions.incoming_message') : tTx('transactions.outgoing_message') }
            </Link>
          </Skeleton>
        ) }
      </DetailedInfo.ItemValue>

      { rollupFeature.isEnabled && rollupFeature.type === 'optimistic' && data.op_withdrawals && data.op_withdrawals.length > 0 &&
      !config.UI.views.tx.hiddenFields?.L1_status && (
        <>
          <DetailedInfo.ItemLabel
            hint={ tTx('transactions.progress_hint') }
          >
            { tTx('transactions.withdrawal_status') }</DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <Flex flexDir="column" rowGap={ 2 }>
              { data.op_withdrawals.map((withdrawal) => (
                <Box key={ withdrawal.nonce }>
                  <Box mb={ 2 } py={{ base: '5px', lg: 1 }}>
                    <span>{ tTx('transactions.nonce_label') }{ ' ' }</span>
                    <chakra.span fontWeight={ 600 }>{ withdrawal.nonce }</chakra.span>
                  </Box>
                  <TxDetailsWithdrawalStatusOptimistic data={ withdrawal } txHash={ data.hash } from={ data.from }/>
                </Box>
              )) }
            </Flex>
          </DetailedInfo.ItemValue>
        </>
      ) }

      { data.zkevm_status && !config.UI.views.tx.hiddenFields?.L1_status && (
        <>
          <DetailedInfo.ItemLabel
            hint={ tTx('transactions.confirmation_path_hint', { layer: layerLabels.parent }) }
            isLoading={ isLoading }
          >
            { tTx('transactions.confirmation_status') }</DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <VerificationSteps
              currentStep={ formatZkEvmTxStatus(data.zkevm_status) }
              steps={ ZKEVM_L2_TX_STATUSES.map(status => ({
                label: formatZkEvmTxStatus(status),
                content: tTx(status === 'L1 Confirmed' ? 'transactions.step_confirmed_layer' : 'transactions.step_sequencer', { layer: layerLabels.parent }),
              })) }
              isLoading={ isLoading }
            />
          </DetailedInfo.ItemValue>
        </>
      ) }

      { data.arbitrum?.status && !config.UI.views.tx.hiddenFields?.L1_status && (
        <>
          <DetailedInfo.ItemLabel
            hint={ tTx('transactions.confirmation_path_hint', { layer: layerLabels.parent }) }
            isLoading={ isLoading }
          >
            { tTx('transactions.layer_status', { layer: layerLabels.parent }) }
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <VerificationSteps
              currentStep={ arbitrum.VERIFICATION_STEPS_MAP[data.arbitrum.status] }
              currentStepPending={ arbitrum.getVerificationStepStatus(data.arbitrum) === 'pending' }
              steps={ arbitrum.verificationSteps.map((label, index) => ({
                label,
                content: tTx(ARBITRUM_STATUS_KEYS[index], {
                  chain: rollupFeature.isEnabled ? rollupFeature.parentChain.name || layerLabels.parent : layerLabels.parent,
                }),
              })) }
              isLoading={ isLoading }
            />
          </DetailedInfo.ItemValue>
        </>
      ) }

      { data.revert_reason && (
        <>
          <DetailedInfo.ItemLabel
            hint={ tTx('transactions.revert_reason_hint') }
          >
            { tTx('transactions.revert_reason') }</DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue flexWrap="wrap" mt={{ base: '5px', lg: '4px' }}>
            <TxRevertReason { ...data.revert_reason }/>
          </DetailedInfo.ItemValue>
        </>
      ) }

      { data.zksync && !config.UI.views.tx.hiddenFields?.L1_status && (
        <>
          <DetailedInfo.ItemLabel
            hint={ tTx('transactions.batch_lifecycle_hint') }
            isLoading={ isLoading }
          >
            { tTx('transactions.layer_status', { layer: layerLabels.parent }) }
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <VerificationSteps
              steps={ ZKSYNC_L2_TX_BATCH_STATUSES.map((status, index) => ({
                label: formatZkSyncL2TxnBatchStatus(status),
                content: tTx(ZKSYNC_STATUS_KEYS[index], { current: layerLabels.current, parent: layerLabels.parent }),
              })) }
              currentStep={ formatZkSyncL2TxnBatchStatus(data.zksync.status) }
              isLoading={ isLoading }
            />
          </DetailedInfo.ItemValue>
        </>
      ) }

      <DetailedInfo.ItemLabel
        hint={ tTx('transactions.block_number_hint') }
        isLoading={ isLoading }
      >
        { tTx('common.block') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue multiRow={ Boolean(data.scroll?.l2_block_status) }>
        { data.block_number === null ?
          <Text>{ tTx('common.pending') }</Text> : (
            <BlockEntity
              isLoading={ isLoading }
              number={ data.block_number }
              noIcon
            />
          ) }
        { Boolean(data.confirmations) && (
          <>
            <TextSeparator/>
            <Skeleton loading={ isLoading } color="text.secondary">
              <span>{ tTx('transactions.block_confirmation_count', {
                count: data.confirmations ?? 0,
                value: formatNumber(data.confirmations ?? 0, locale),
              }) }</span>
            </Skeleton>
          </>
        ) }
        { data.scroll?.l2_block_status && (
          <>
            <TextSeparator/>
            <VerificationSteps
              steps={ SCROLL_L2_BLOCK_STATUSES.map(label => ({ label, content: tTx(SCROLL_STATUS_KEYS[label]) })) }
              currentStep={ data.scroll.l2_block_status }
              isLoading={ isLoading }
            />
          </>
        ) }
      </DetailedInfo.ItemValue>

      { data.zkevm_batch_number && !config.UI.views.tx.hiddenFields?.batch && (
        <>
          <DetailedInfo.ItemLabel
            hint={ tTx('transactions.batch_index_hint') }
            isLoading={ isLoading }
          >
            { tTx('transactions.txn_batch') }</DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <BatchEntityL2
              isLoading={ isLoading }
              number={ data.zkevm_batch_number }
            />
          </DetailedInfo.ItemValue>
        </>
      ) }

      { data.zksync && !config.UI.views.tx.hiddenFields?.batch && (
        <>
          <DetailedInfo.ItemLabel
            hint={ tTx('transactions.batch_number_hint') }
            isLoading={ isLoading }
          >
            { tTx('transactions.batch') }</DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            { data.zksync.batch_number ? (
              <BatchEntityL2
                isLoading={ isLoading }
                number={ data.zksync.batch_number }
              />
            ) : <Skeleton loading={ isLoading }>{ tTx('common.pending') }</Skeleton> }
          </DetailedInfo.ItemValue>
        </>
      ) }

      { data.arbitrum && !config.UI.views.tx.hiddenFields?.batch && (
        <>
          <DetailedInfo.ItemLabel
            hint={ tTx('transactions.batch_containing_hint') }
            isLoading={ isLoading }
          >
            { tTx('transactions.batch') }</DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            { data.arbitrum.batch_number ?
              <BatchEntityL2 isLoading={ isLoading } number={ data.arbitrum.batch_number }/> :
              <Skeleton loading={ isLoading }>{ tTx('common.pending') }</Skeleton> }
          </DetailedInfo.ItemValue>
        </>
      ) }

      { data.timestamp && (
        <>
          <DetailedInfo.ItemLabel
            hint={ tTx('transactions.timestamp_hint') }
            isLoading={ isLoading }
          >
            { tTx('common.timestamp') }</DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue multiRow>
            <DetailedInfoTimestamp timestamp={ data.timestamp } isLoading={ isLoading }/>
            { data.confirmation_duration && (
              <Flex alignItems="center">
                <TextSeparator hideBelow="lg"/>
                <Skeleton loading={ isLoading } color="text.secondary">
                  <span>{ getLocalizedConfirmationDuration(data.confirmation_duration, tTx, locale) }</span>
                </Skeleton>
              </Flex>
            ) }
          </DetailedInfo.ItemValue>
        </>
      ) }

      { data.execution_node && (
        <>
          <DetailedInfo.ItemLabel
            hint={ tTx('transactions.kettle_hint') }
            isLoading={ isLoading }
          >
            { tTx('transactions.kettle') }</DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <AddressEntity
              address={ data.execution_node }
              href={ route({ pathname: '/txs/kettle/[hash]', query: { hash: data.execution_node.hash } }) }
            />
          </DetailedInfo.ItemValue>
        </>
      ) }

      { data.allowed_peekers && data.allowed_peekers.length > 0 && (
        <TxAllowedPeekers items={ data.allowed_peekers }/>
      ) }

      <DetailedInfoSponsoredItem isLoading={ isLoading }/>

      <DetailedInfo.ItemDivider/>

      { !noTxActions && <TxDetailsActions hash={ data.hash } actions={ data.actions } isTxDataLoading={ isLoading }/> }

      <DetailedInfo.ItemLabel
        hint={ tTx('transactions.sender_hint') }
        isLoading={ isLoading }
      >
        { tTx('common.from') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue columnGap={ 3 }>
        <AddressEntity
          address={ data.from }
          isLoading={ isLoading }
        />
        { data.from.name && <Text>{ data.from.name }</Text> }
        { addressFromTags.length > 0 && (
          <Flex columnGap={ 3 }>
            { addressFromTags }
          </Flex>
        ) }
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint={ tTx('transactions.receiver_hint') }
        isLoading={ isLoading }
      >
        { data.to?.is_contract ? tTx('transactions.interacted_contract') : tTx('common.to') }
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue
        flexWrap={{ base: 'wrap', lg: 'nowrap' }}
        columnGap={ 3 }
      >
        { toAddress ? (
          <>
            { data.to && data.to.hash ? (
              <Flex flexWrap="nowrap" alignItems="center" maxW="100%">
                <AddressEntity
                  address={ toAddress }
                  isLoading={ isLoading }
                />
                { executionSuccessBadge }
                { executionFailedBadge }
              </Flex>
            ) : (
              <Flex width="100%" whiteSpace="pre" alignItems="center" flexShrink={ 0 }>
                <Trans
                  t={ tTx }
                  i18nKey="transactions.contract_created"
                  components={{ address: <AddressEntity address={ toAddress } isLoading={ isLoading } noIcon/> }}
                />
                { executionSuccessBadge }
                { executionFailedBadge }
              </Flex>
            ) }
            { addressToTags.length > 0 && (
              <Flex columnGap={ 3 }>
                { addressToTags }
              </Flex>
            ) }
          </>
        ) : (
          <span>{ tTx('transactions.contract_creation') }</span>
        ) }
      </DetailedInfo.ItemValue>

      { data.token_transfers && <TxDetailsTokenTransfers data={ data.token_transfers } txHash={ data.hash } isOverflow={ data.token_transfers_overflow }/> }

      { config.features.crossChainTxs.isEnabled && <TxDetailsCrossChainTransfers hash={ data.hash } isLoading={ isLoading }/> }

      { hasInterop && data.op_interop_messages?.some(message => message.target_address_hash) && (
        <>
          <DetailedInfo.ItemLabel
            isLoading={ isLoading }
            hint={ tTx('transactions.interop_target_hint') }
          >
            { tTx('transactions.interop_target') }</DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <VStack gap={ 2 } w="100%" overflow="hidden" alignItems="flex-start">
              { data.op_interop_messages
                .filter((message) => message.target_address_hash)
                .map((message) => {
                  return message.relay_chain !== undefined ? (
                    <AddressEntityInterop
                      chain={ message.relay_chain }
                      address={{ hash: message.target_address_hash }}
                      isLoading={ isLoading }
                      truncation="dynamic"
                      w="100%"
                    />
                  ) : (
                    <AddressEntity address={{ hash: message.target_address_hash }} isLoading={ isLoading } truncation="dynamic" w="100%"/>
                  );
                }) }
            </VStack>
          </DetailedInfo.ItemValue>
        </>
      ) }

      <DetailedInfo.ItemDivider/>

      { (data.arbitrum?.commitment_transaction.hash || data.arbitrum?.confirmation_transaction.hash) &&
      (
        <>
          { data.arbitrum?.commitment_transaction.hash && (
            <>
              <DetailedInfo.ItemLabel
                hint={ tTx('transactions.batch_commitment_hint', { layer: layerLabels.parent }) }
                isLoading={ isLoading }
              >
                { tTx('transactions.commitment_tx') }</DetailedInfo.ItemLabel>
              <DetailedInfo.ItemValue>
                <TxEntityL1 hash={ data.arbitrum?.commitment_transaction.hash } isLoading={ isLoading }/>
                { data.arbitrum?.commitment_transaction.status === 'finalized' && <StatusTag type="ok" text={ tTx('transactions.finalized') } ml={ 2 }/> }
              </DetailedInfo.ItemValue>
            </>
          ) }
          { data.arbitrum?.confirmation_transaction.hash && (
            <>
              <DetailedInfo.ItemLabel
                hint={ tTx('transactions.batch_confirmation_hint', { layer: layerLabels.parent }) }
                isLoading={ isLoading }
              >
                { tTx('transactions.confirmation_tx') }</DetailedInfo.ItemLabel>
              <DetailedInfo.ItemValue>
                <TxEntityL1 hash={ data.arbitrum?.confirmation_transaction.hash } isLoading={ isLoading }/>
                { data.arbitrum?.commitment_transaction.status === 'finalized' && <StatusTag type="ok" text={ tTx('transactions.finalized') } ml={ 2 }/> }
              </DetailedInfo.ItemValue>
            </>
          ) }
          <DetailedInfo.ItemDivider/>
        </>
      ) }

      { data.zkevm_sequence_hash && (
        <>
          <DetailedInfo.ItemLabel
            isLoading={ isLoading }
          >
            { tTx('transactions.sequence_hash') }</DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue flexWrap="nowrap">
            <Skeleton loading={ isLoading } overflow="hidden">
              <HashStringShortenDynamic hash={ data.zkevm_sequence_hash }/>
            </Skeleton>
            <CopyToClipboard text={ data.zkevm_sequence_hash } isLoading={ isLoading }/>
          </DetailedInfo.ItemValue>
        </>

      ) }

      { data.zkevm_verify_hash && (
        <>
          <DetailedInfo.ItemLabel
            isLoading={ isLoading }
          >
            { tTx('transactions.verify_hash') }</DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue flexWrap="nowrap">
            <Skeleton loading={ isLoading } overflow="hidden">
              <HashStringShortenDynamic hash={ data.zkevm_verify_hash }/>
            </Skeleton>
            <CopyToClipboard text={ data.zkevm_verify_hash } isLoading={ isLoading }/>
          </DetailedInfo.ItemValue>
        </>
      ) }

      { (data.zkevm_batch_number || data.zkevm_verify_hash) && <DetailedInfo.ItemDivider/> }

      { !config.UI.views.tx.hiddenFields?.value && (
        <>
          <DetailedInfo.ItemLabel
            hint={ tTx('transactions.value_hint') }
            isLoading={ isLoading }
          >
            { tTx('transactions.value_amount') }</DetailedInfo.ItemLabel>
          <DetailedInfoNativeCoinValue
            amount={ data.value }
            exchangeRate={ data.exchange_rate }
            historicalExchangeRate={ data.historic_exchange_rate }
            hasExchangeRateToggle
            loading={ isLoading }
          />
        </>
      ) }

      <TxDetailsTxFee isLoading={ isLoading } data={ data }/>

      { rollupFeature.isEnabled && rollupFeature.type === 'optimistic' && data.operator_fee && (
        <>
          <DetailedInfo.ItemLabel
            hint={ tTx('transactions.operator_fee_hint') }
          >
            { tTx('transactions.operator_fee') }</DetailedInfo.ItemLabel>
          <DetailedInfoNativeCoinValue
            amount={ data.operator_fee }
            exchangeRate={ data.exchange_rate }
            historicalExchangeRate={ data.historic_exchange_rate }
            hasExchangeRateToggle
            loading={ isLoading }
          />
        </>
      ) }

      { rollupFeature.isEnabled && rollupFeature.type === 'arbitrum' && data.arbitrum && (
        <>
          <DetailedInfo.ItemLabel
            hint={ tTx('transactions.poster_fee_hint', { layer: layerLabels.parent }) }
            isLoading={ isLoading }
          >
            { tTx('transactions.poster_fee') }</DetailedInfo.ItemLabel>
          <DetailedInfoNativeCoinValue
            amount={ data.arbitrum.poster_fee }
            exchangeRate={ data.exchange_rate }
            historicalExchangeRate={ data.historic_exchange_rate }
            hasExchangeRateToggle
            loading={ isLoading }
          />

          <DetailedInfo.ItemLabel
            hint={ tTx('transactions.network_fee_hint', { layer: layerLabels.current }) }
            isLoading={ isLoading }
          >
            { tTx('transactions.network_fee') }</DetailedInfo.ItemLabel>
          <DetailedInfoNativeCoinValue
            amount={ data.arbitrum.network_fee }
            exchangeRate={ data.exchange_rate }
            historicalExchangeRate={ data.historic_exchange_rate }
            hasExchangeRateToggle
            loading={ isLoading }
          />
        </>
      ) }

      <TxDetailsGasPrice gasPrice={ data.gas_price } gasToken={ data.celo?.gas_token } isLoading={ isLoading }/>

      <TxDetailsFeePerGas txFee={ data.fee.value } gasUsed={ data.gas_used } isLoading={ isLoading }/>

      { !config.UI.views.tx.additionalFields?.set_max_gas_limit && <TxDetailsGasUsage isLoading={ isLoading } data={ data }/> }

      { rollupFeature.isEnabled && rollupFeature.type === 'arbitrum' && data.arbitrum && data.gas_used && (
        <>
          <DetailedInfo.ItemLabel
            hint={ tTx('transactions.gas_data_charges_hint', { current: layerLabels.current, parent: layerLabels.parent }) }
            isLoading={ isLoading }
          >
            { tTx('transactions.gas_used_layer', { layer: layerLabels.parent }) }
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <Skeleton loading={ isLoading }>{ formatBigNumber(BigNumber(data.arbitrum.gas_used_for_l1 || 0), locale) }</Skeleton>
            <TextSeparator/>
            <Utilization
              ml={ 4 }
              value={ BigNumber(data.arbitrum.gas_used_for_l1 || 0).dividedBy(BigNumber(data.gas_used)).toNumber() }
              isLoading={ isLoading }
            />
          </DetailedInfo.ItemValue>

          <DetailedInfo.ItemLabel
            hint={ tTx('transactions.gas_execution_hint', { layer: layerLabels.current }) }
            isLoading={ isLoading }
          >
            { tTx('transactions.gas_used_layer', { layer: layerLabels.current }) }
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <Skeleton loading={ isLoading }>{ formatBigNumber(BigNumber(data.arbitrum.gas_used_for_l2 || 0), locale) }</Skeleton>
            <TextSeparator/>
            <Utilization
              ml={ 4 }
              value={ BigNumber(data.arbitrum.gas_used_for_l2 || 0).dividedBy(BigNumber(data.gas_used)).toNumber() }
              isLoading={ isLoading }
            />
          </DetailedInfo.ItemValue>
        </>
      ) }

      { data.scroll?.l1_gas_used !== undefined && (
        <>
          <DetailedInfo.ItemLabel
            hint={ tTx('transactions.total_gas_layer_hint', { layer: layerLabels.parent }) }
            isLoading={ isLoading }
          >
            { tTx('transactions.layer_gas_used', { layer: layerLabels.parent }) }</DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <Skeleton loading={ isLoading }>{ formatBigNumber(BigNumber(data.scroll?.l1_gas_used || 0), locale) }</Skeleton>
          </DetailedInfo.ItemValue>
        </>
      ) }

      { !config.UI.views.tx.hiddenFields?.gas_fees &&
            (data.base_fee_per_gas || data.max_fee_per_gas || data.max_priority_fee_per_gas) && (
        <>
          <DetailedInfo.ItemLabel
            hint={ tTx('transactions.gas_fee_hint', { validator: tTx(VALIDATOR_TITLE_KEYS[getNetworkValidatorTitle()] || 'common.validator') }) }
            isLoading={ isLoading }
          >
            { tTx('transactions.gas_fees', { unit: currencyUnits.gwei }) }
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue multiRow>
            { data.base_fee_per_gas && (
              <NativeCoinValue
                amount={ data.base_fee_per_gas }
                units="gwei"
                unitsTooltip="wei"
                noSymbol
                loading={ isLoading }
                startElement={ tTx('transactions.base_prefix') }
                endElement={ (data.max_fee_per_gas || data.max_priority_fee_per_gas) && <TextSeparator/> }
              />
            ) }
            { data.max_fee_per_gas && (
              <NativeCoinValue
                amount={ data.max_fee_per_gas }
                units="gwei"
                unitsTooltip="wei"
                noSymbol
                loading={ isLoading }
                startElement={ tTx('transactions.max_label') }
                endElement={ data.max_priority_fee_per_gas && <TextSeparator/> }
              />
            ) }
            { data.max_priority_fee_per_gas && (
              <NativeCoinValue
                amount={ data.max_priority_fee_per_gas }
                units="gwei"
                unitsTooltip="wei"
                noSymbol
                loading={ isLoading }
                startElement={ tTx('transactions.max_priority_prefix') }
              />
            ) }
          </DetailedInfo.ItemValue>
        </>
      ) }

      <TxDetailsBurntFees data={ data } isLoading={ isLoading }/>

      { rollupFeature.isEnabled && rollupFeature.type === 'optimistic' && (
        <>
          { data.l1_gas_used && (
            <>
              <DetailedInfo.ItemLabel
                hint={ tTx('transactions.layer_gas_tx_hint', { layer: layerLabels.parent }) }
                isLoading={ isLoading }
              >
                { tTx('transactions.layer_tx_gas', { layer: layerLabels.parent }) }
              </DetailedInfo.ItemLabel>
              <DetailedInfo.ItemValue>
                <Text>{ formatBigNumber(BigNumber(data.l1_gas_used), locale) }</Text>
              </DetailedInfo.ItemValue>
            </>
          ) }

          { data.l1_gas_price && (
            <>
              <DetailedInfo.ItemLabel
                hint={ tTx('transactions.layer_gas_price', { layer: layerLabels.parent }) }
                isLoading={ isLoading }
              >
                { tTx('transactions.layer_gas_price', { layer: layerLabels.parent }) }
              </DetailedInfo.ItemLabel>
              <GasPriceValue
                amount={ data.l1_gas_price }
                asset={ rollupFeature.parentChain.currency?.symbol || currencyUnits.ether }
                loading={ isLoading }
              />
            </>
          ) }

          { data.l1_fee && (
            <>
              <DetailedInfo.ItemLabel

                hint={ tTx('transactions.data_fee_hint', { parent: layerLabels.parent, current: layerLabels.current }) }
                isLoading={ isLoading }
              >
                { tTx('transactions.layer_fee', { layer: layerLabels.parent }) }
              </DetailedInfo.ItemLabel>
              <DetailedInfoNativeCoinValue
                amount={ data.l1_fee }
                asset={ rollupFeature.parentChain.currency?.symbol || currencyUnits.ether }
                decimals={ rollupFeature.parentChain.currency?.decimals ?? config.chain.currency.decimals }
                exchangeRate={ data.exchange_rate }
                historicalExchangeRate={ data.historic_exchange_rate }
                hasExchangeRateToggle
                loading={ isLoading }
              />
            </>
          ) }

          { data.l1_fee_scalar && (
            <>
              <DetailedInfo.ItemLabel
                hint={ tTx('transactions.fee_scalar_hint', { layer: layerLabels.parent }) }
                isLoading={ isLoading }
              >
                { tTx('transactions.layer_fee_scalar', { layer: layerLabels.parent }) }
              </DetailedInfo.ItemLabel>
              <DetailedInfo.ItemValue>
                <Text>{ data.l1_fee_scalar }</Text>
              </DetailedInfo.ItemValue>
            </>
          ) }
        </>
      ) }
      <TxInfoScrollFees data={ data } isLoading={ isLoading }/>

      <CollapsibleDetails loading={ isLoading } mt={ 6 } gridColumn={{ base: undefined, lg: '1 / 3' }} isExpanded={ isExpanded } onClick={ handleCutLinkClick }>
        <GridItem colSpan={{ base: undefined, lg: 2 }} mt={{ base: 1, lg: 4 }}/>

        <TxDetailsSetMaxGasLimit data={ data }/>

        <TxDetailsWithdrawalStatusArbitrum data={ data }/>

        { (data.blob_gas_used || data.max_fee_per_blob_gas || data.blob_gas_price) && (
          <>
            { data.blob_gas_used && data.blob_gas_price && (
              <>
                <DetailedInfo.ItemLabel
                  hint={ tTx('transactions.blob_fee_hint') }
                >
                  { tTx('transactions.blob_fee') }</DetailedInfo.ItemLabel>
                <DetailedInfoNativeCoinValue
                  amount={ BigNumber(data.blob_gas_used).multipliedBy(data.blob_gas_price).toString() }
                  noSymbol={ config.UI.views.tx.hiddenFields?.fee_currency }
                  exchangeRate={ data.exchange_rate }
                  historicalExchangeRate={ data.historic_exchange_rate }
                  hasExchangeRateToggle
                  loading={ isLoading }
                />
              </>
            ) }

            { data.blob_gas_used && (
              <>
                <DetailedInfo.ItemLabel
                  hint={ tTx('transactions.blob_gas_hint') }
                >
                  { tTx('transactions.blob_gas_usage') }</DetailedInfo.ItemLabel>
                <DetailedInfo.ItemValue>
                  { formatBigNumber(BigNumber(data.blob_gas_used), locale) }
                </DetailedInfo.ItemValue>
              </>
            ) }

            { (data.max_fee_per_blob_gas || data.blob_gas_price) && (
              <>
                <DetailedInfo.ItemLabel
                  hint={ tTx('transactions.blob_amount_hint', { currency: currencyUnits.ether }) }
                >
                  { tTx('transactions.blob_gas_fees', { unit: currencyUnits.gwei }) }
                </DetailedInfo.ItemLabel>
                <DetailedInfo.ItemValue>
                  { data.blob_gas_price && (
                    <NativeCoinValue
                      amount={ data.blob_gas_price }
                      units="gwei"
                      unitsTooltip="wei"
                      noSymbol
                      loading={ isLoading }
                      fontWeight="600"
                    />
                  ) }
                  { (data.max_fee_per_blob_gas && data.blob_gas_price) && <TextSeparator/> }
                  { data.max_fee_per_blob_gas && (
                    <NativeCoinValue
                      amount={ data.max_fee_per_blob_gas }
                      units="gwei"
                      unitsTooltip="wei"
                      noSymbol
                      loading={ isLoading }
                      startElement={ tTx('transactions.max_label') }
                      fontWeight="600"
                    />
                  ) }
                </DetailedInfo.ItemValue>
              </>
            ) }
            <DetailedInfo.ItemDivider/>
          </>
        ) }

        <TxDetailsOther nonce={ data.nonce } type={ data.type } position={ data.position } queueIndex={ data.scroll?.queue_index }/>

        <DetailedInfo.ItemLabel
          hint={ tTx('transactions.input_hint') }
          mb={{ base: 1, lg: 0 }}
        >
          { tTx('transactions.raw_input') }</DetailedInfo.ItemLabel>
        <DetailedInfo.ItemValue>
          <RawInputData hex={ data.raw_input } defaultDataType={ data.zilliqa?.is_scilla ? 'UTF-8' : 'Hex' }/>
        </DetailedInfo.ItemValue>

        { data.decoded_input && (
          <>
            <DetailedInfo.ItemLabel
              hint={ tTx('transactions.decoded_input') }
            >
              { tTx('transactions.decoded_input') }</DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue flexWrap="wrap" mt={{ base: '5px', lg: '4px' }}>
              <LogDecodedInputData data={ data.decoded_input }/>
            </DetailedInfo.ItemValue>
          </>
        ) }

        { data.zksync && <ZkSyncL2TxnBatchHashesInfo data={ data.zksync } isLoading={ isLoading }/> }
      </CollapsibleDetails>
    </DetailedInfo.Container>
  );
};

export default TxInfo;
