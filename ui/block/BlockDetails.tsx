// Modified by Quat Capital, 2026-10-26: runtime translation and locale formatting. GPL-3.0.
import { GridItem, Text, Box } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { useRouter } from 'next/router';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { ARBITRUM_L2_TX_BATCH_STATUSES } from 'types/api/arbitrumL2';
import { ZKSYNC_L2_TX_BATCH_STATUSES } from 'types/api/zkSyncL2';

import { route, routeParams } from 'nextjs/routes';

import config from 'configs/app';
import getBlockReward from 'lib/block/getBlockReward';
import { useMultichainContext } from 'lib/contexts/multichain';
import { formatBigNumber, formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import getNetworkValidatorTitle from 'lib/networks/getNetworkValidatorTitle';
import * as arbitrum from 'lib/rollups/arbitrum';
import { layerLabels } from 'lib/rollups/utils';
import getQueryParamString from 'lib/router/getQueryParamString';
import { CollapsibleDetails } from 'toolkit/chakra/collapsible';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import { ZERO } from 'toolkit/utils/consts';
import { space } from 'toolkit/utils/htmlEntities';
import OptimisticL2TxnBatchDA from 'ui/shared/batch/OptimisticL2TxnBatchDA';
import BlockGasUsed from 'ui/shared/block/BlockGasUsed';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import DetailedInfoTimestamp from 'ui/shared/DetailedInfo/DetailedInfoTimestamp';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import BatchEntityL2 from 'ui/shared/entities/block/BatchEntityL2';
import BlockEntityL1 from 'ui/shared/entities/block/BlockEntityL1';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import IconSvg from 'ui/shared/IconSvg';
import PrevNext from 'ui/shared/PrevNext';
import RawDataSnippet from 'ui/shared/RawDataSnippet';
import StatusTag from 'ui/shared/statusTag/StatusTag';
import Utilization from 'ui/shared/Utilization/Utilization';
import GasPriceValue from 'ui/shared/value/GasPriceValue';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';
import { WEI } from 'ui/shared/value/utils';
import VerificationSteps from 'ui/shared/verificationSteps/VerificationSteps';
import ZkSyncL2TxnBatchHashesInfo from 'ui/txnBatches/zkSyncL2/ZkSyncL2TxnBatchHashesInfo';

import BlockDetailsBaseFeeCelo from './details/BlockDetailsBaseFeeCelo';
import BlockDetailsBlobInfo from './details/BlockDetailsBlobInfo';
import BlockDetailsZilliqaQuorumCertificate from './details/BlockDetailsZilliqaQuorumCertificate';
import type { BlockQuery } from './useBlockQuery';

interface Props {
  query: BlockQuery;
}

const rollupFeature = config.features.rollup;

const BlockDetails = ({ query }: Props) => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const router = useRouter();
  const heightOrHash = getQueryParamString(router.query.height_or_hash);
  const multichainContext = useMultichainContext();

  const { data, isPlaceholderData } = query;

  const handlePrevNextClick = React.useCallback((direction: 'prev' | 'next') => {
    if (!data) {
      return;
    }

    const increment = direction === 'next' ? +1 : -1;
    const nextId = String(data.height + increment);

    router.push(routeParams({ pathname: '/block/[height_or_hash]', query: { height_or_hash: nextId } }, { chain: multichainContext?.chain }));
  }, [ data, multichainContext, router ]);

  if (!data) {
    return null;
  }

  const { totalReward, staticReward, burntFees, txFees } = getBlockReward(data);

  const validatorTitles = {
    validator: t('common.validator'), miner: t('home.miner'), poster: t('home.poster'),
    sequencer: t('home.sequencer'), 'fee recipient': t('home.fee_recipient'),
  };
  const validatorTitle = validatorTitles[getNetworkValidatorTitle()];
  const zkSyncStepLabels = {
    'Processed on L2': t('transactions.step_processed_layer', { current: layerLabels.current }),
    'Sealed on L2': t('transactions.step_sealed_layer', { current: layerLabels.current }),
    'Sent to L1': t('transactions.step_sent_parent', { parent: layerLabels.parent }),
    'Validated on L1': t('transactions.step_validated_parent', { parent: layerLabels.parent }),
    'Executed on L1': t('transactions.step_executed_parent', { parent: layerLabels.parent }),
  };
  const zkSyncSteps = ZKSYNC_L2_TX_BATCH_STATUSES.map(status => zkSyncStepLabels[status]);
  const parentChainName = rollupFeature.isEnabled ? rollupFeature.parentChain.name : layerLabels.parent;
  const arbitrumStepLabels = {
    'Processed on rollup': t('transactions.step_processed_rollup'),
    'Sent to base': t('transactions.step_sent_chain', { chain: parentChainName }),
    'Confirmed on base': t('transactions.step_confirmed_chain', { chain: parentChainName }),
  };
  const arbitrumSteps = ARBITRUM_L2_TX_BATCH_STATUSES.map(status => arbitrumStepLabels[status]);

  const rewardBreakDown = (() => {
    if (rollupFeature.isEnabled || totalReward.isEqualTo(ZERO) || txFees.isEqualTo(ZERO) || burntFees.isEqualTo(ZERO)) {
      return null;
    }

    if (isPlaceholderData) {
      return <Skeleton loading w="525px" h="20px"/>;
    }

    return (
      <Text color="text.secondary" whiteSpace="break-spaces">
        <Tooltip content={ t('blockDetails.static_reward') }>
          <span>{ formatBigNumber(staticReward.dividedBy(WEI), locale) }</span>
        </Tooltip>
        { !txFees.isEqualTo(ZERO) && (
          <>
            { space }+{ space }
            <Tooltip content={ t('blockDetails.tx_fees') }>
              <span>{ formatBigNumber(txFees.dividedBy(WEI), locale) }</span>
            </Tooltip>
          </>
        ) }
        { !burntFees.isEqualTo(ZERO) && (
          <>
            { space }-{ space }
            <Tooltip content={ t('blockDetails.burnt_fees') }>
              <span>{ formatBigNumber(burntFees.dividedBy(WEI), locale) }</span>
            </Tooltip>
          </>
        ) }
      </Text>
    );
  })();

  const hasBlobTxs = Boolean(config.features.dataAvailability.isEnabled && data.blob_transactions_count);
  const txsNum = (
    <Trans
      i18nKey={ hasBlobTxs ? 'blockDetails.transactions_blobs_sentence' : 'blockDetails.transactions_sentence' }
      values={{
        transactions: t('blockDetails.tx_count', { count: data.transactions_count, value: formatNumber(data.transactions_count, locale) }),
        blobs: t('blockDetails.blob_count', { count: data.blob_transactions_count || 0, value: formatNumber(data.blob_transactions_count || 0, locale) }),
      }}
      components={{
        txs: <Link href={ route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: heightOrHash, tab: 'txs' } }, multichainContext) }/>,
        blobs: <Link href={ route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: heightOrHash, tab: 'blob_txs' } }, multichainContext) }/>,
      }}
    />
  );
  const blockHeightLabels = {
    reorg: t('blockDetails.reorg_height'),
    uncle: t('blockDetails.uncle_height'),
    block: t('blockDetails.height'),
  };
  const blockHeightLabel = blockHeightLabels[data.type];

  return (
    <DetailedInfo.Container templateColumns={{ base: 'minmax(0, 1fr)', lg: 'minmax(min-content, 200px) minmax(0, 1fr)' }} >
      <DetailedInfo.ItemLabel
        hint={ t('blockDetails.height_hint') }
        isLoading={ isPlaceholderData }
      >
        { blockHeightLabel }
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton loading={ isPlaceholderData }>
          { formatNumber(data.height, locale) }
        </Skeleton>
        { data.height === 0 && <Text whiteSpace="pre"> { t('blockDetails.genesis') }</Text> }
        <PrevNext
          ml={ 6 }
          onClick={ handlePrevNextClick }
          prevLabel={ t('blockDetails.previous') }
          nextLabel={ t('blockDetails.next') }
          isPrevDisabled={ data.height === 0 }
          isLoading={ isPlaceholderData }
        />
      </DetailedInfo.ItemValue>

      { rollupFeature.isEnabled && rollupFeature.type === 'arbitrum' && data.arbitrum && (
        <>
          <DetailedInfo.ItemLabel
            hint={ t('blockDetails.layer_height_hint', { parent: layerLabels.parent, current: layerLabels.current }) }
            isLoading={ isPlaceholderData }
          >
            { t('blockDetails.layer_height', { layer: layerLabels.parent }) }
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <BlockEntityL1 isLoading={ isPlaceholderData } number={ data.arbitrum.l1_block_number }/>
          </DetailedInfo.ItemValue>
        </>
      ) }

      { rollupFeature.isEnabled && rollupFeature.type === 'arbitrum' && data.arbitrum && !config.UI.views.block.hiddenFields?.batch && (
        <>
          <DetailedInfo.ItemLabel
            hint={ t('blockDetails.batch_number') }
            isLoading={ isPlaceholderData }
          >
            { t('blockDetails.batch') } </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            { data.arbitrum.batch_number ?
              <BatchEntityL2 isLoading={ isPlaceholderData } number={ data.arbitrum.batch_number }/> :
              <Skeleton loading={ isPlaceholderData }>{ t('blockDetails.pending') }</Skeleton> }
          </DetailedInfo.ItemValue>
        </>
      ) }

      { rollupFeature.isEnabled && rollupFeature.type === 'optimistic' && data.optimism && !config.UI.views.block.hiddenFields?.batch && (
        <>
          <DetailedInfo.ItemLabel
            hint={ t('blockDetails.batch_number') }
            isLoading={ isPlaceholderData }
          >
            { t('blockDetails.batch') } </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue columnGap={ 3 }>
            { data.optimism.number ?
              <BatchEntityL2 isLoading={ isPlaceholderData } number={ data.optimism.number }/> :
              <Skeleton loading={ isPlaceholderData }>{ t('blockDetails.pending') }</Skeleton> }
            { data.optimism.batch_data_container && (
              <OptimisticL2TxnBatchDA
                container={ data.optimism.batch_data_container }
                isLoading={ isPlaceholderData }
              />
            ) }
          </DetailedInfo.ItemValue>
        </>
      ) }

      { typeof data.size === 'number' && (
        <>
          <DetailedInfo.ItemLabel
            hint={ t('blockDetails.size_hint') }
            isLoading={ isPlaceholderData }
          >
            { t('blockDetails.size') } </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <Skeleton loading={ isPlaceholderData }>
              { formatNumber(data.size, locale) }
            </Skeleton>
          </DetailedInfo.ItemValue>
        </>
      ) }

      <DetailedInfo.ItemLabel
        hint={ t('blockDetails.timestamp_hint') }
        isLoading={ isPlaceholderData }
      >
        { t('blockDetails.timestamp') } </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <DetailedInfoTimestamp timestamp={ data.timestamp } isLoading={ isPlaceholderData }/>
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint={ t('blockDetails.transactions_hint') }
        isLoading={ isPlaceholderData }
      >
        { t('blockDetails.transactions') } </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton loading={ isPlaceholderData }>
          { txsNum }
        </Skeleton>
      </DetailedInfo.ItemValue>

      { config.features.beaconChain.isEnabled && Boolean(data.withdrawals_count) && (
        <>
          <DetailedInfo.ItemLabel
            hint={ t('blockDetails.withdrawals_hint') }
            isLoading={ isPlaceholderData }
          >
            { t('blockDetails.withdrawals') } </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <Skeleton loading={ isPlaceholderData }>
              <Link href={ route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: heightOrHash, tab: 'withdrawals' } }, multichainContext) }>
                { t('blockDetails.withdrawal_count', { count: data.withdrawals_count || 0, value: formatNumber(data.withdrawals_count || 0, locale) }) }
              </Link>
            </Skeleton>
          </DetailedInfo.ItemValue>
        </>
      ) }

      { rollupFeature.isEnabled && rollupFeature.type === 'zkSync' && data.zksync && !config.UI.views.block.hiddenFields?.batch && (
        <>
          <DetailedInfo.ItemLabel
            hint={ t('blockDetails.batch_number') }
            isLoading={ isPlaceholderData }
          >
            { t('blockDetails.batch') } </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            { data.zksync.batch_number ?
              <BatchEntityL2 isLoading={ isPlaceholderData } number={ data.zksync.batch_number }/> :
              <Skeleton loading={ isPlaceholderData }>{ t('blockDetails.pending') }</Skeleton> }
          </DetailedInfo.ItemValue>
        </>
      ) }
      { !config.UI.views.block.hiddenFields?.L1_status && rollupFeature.isEnabled &&
        ((rollupFeature.type === 'zkSync' && data.zksync) || (rollupFeature.type === 'arbitrum' && data.arbitrum)) &&
      (
        <>
          <DetailedInfo.ItemLabel
            hint={ t('blockDetails.status_hint') }
            isLoading={ isPlaceholderData }
          >
            { t('blockDetails.status') } </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            { rollupFeature.type === 'zkSync' && data.zksync && (
              <VerificationSteps
                steps={ zkSyncSteps }
                currentStep={ zkSyncStepLabels[data.zksync.status] }
                isLoading={ isPlaceholderData }
              />
            ) }
            { rollupFeature.type === 'arbitrum' && data.arbitrum && (
              <VerificationSteps
                steps={ arbitrumSteps }
                currentStep={ arbitrumStepLabels[data.arbitrum.status] }
                currentStepPending={ arbitrum.getVerificationStepStatus(data.arbitrum) === 'pending' }
                isLoading={ isPlaceholderData }
              />
            ) }
          </DetailedInfo.ItemValue>
        </>
      ) }

      { !config.UI.views.block.hiddenFields?.miner && (
        <>
          <DetailedInfo.ItemLabel
            hint={ t('blockDetails.producer_hint') }
            isLoading={ isPlaceholderData }
          >
            { validatorTitle }
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <AddressEntity
              address={ data.miner }
              isLoading={ isPlaceholderData }
            />
          </DetailedInfo.ItemValue>
        </>
      ) }

      { rollupFeature.isEnabled && rollupFeature.type === 'arbitrum' &&
        (data.arbitrum?.commitment_transaction.hash || data.arbitrum?.confirmation_transaction.hash) &&
      (
        <>
          <DetailedInfo.ItemDivider/>
          { data.arbitrum?.commitment_transaction.hash && (
            <>
              <DetailedInfo.ItemLabel
                hint={ t('blockDetails.commitment_hint', { layer: layerLabels.parent }) }
                isLoading={ isPlaceholderData }
              >
                { t('blockDetails.commitment') } </DetailedInfo.ItemLabel>
              <DetailedInfo.ItemValue>
                <TxEntityL1 hash={ data.arbitrum?.commitment_transaction.hash } isLoading={ isPlaceholderData }/>
                { data.arbitrum?.commitment_transaction.status === 'finalized' && <StatusTag type="ok" text={ t('blockDetails.finalized') } ml={ 2 }/> }
              </DetailedInfo.ItemValue>
            </>
          ) }
          { data.arbitrum?.confirmation_transaction.hash && (
            <>
              <DetailedInfo.ItemLabel
                hint={ t('blockDetails.confirmation_hint', { layer: layerLabels.parent }) }
                isLoading={ isPlaceholderData }
              >
                { t('blockDetails.confirmation') } </DetailedInfo.ItemLabel>
              <DetailedInfo.ItemValue>
                <TxEntityL1 hash={ data.arbitrum?.confirmation_transaction.hash } isLoading={ isPlaceholderData }/>
                { data.arbitrum?.commitment_transaction.status === 'finalized' && <StatusTag type="ok" text={ t('blockDetails.finalized') } ml={ 2 }/> }
              </DetailedInfo.ItemValue>
            </>
          ) }
        </>
      ) }

      { !rollupFeature.isEnabled && !totalReward.isEqualTo(ZERO) && !config.UI.views.block.hiddenFields?.total_reward && (
        <>
          <DetailedInfo.ItemLabel
            hint={
              t('blockDetails.reward_hint', { validator: validatorTitle, currency: config.chain.currency.symbol || t('blockDetails.native_token') })
            }
            isLoading={ isPlaceholderData }
          >
            { t('blockDetails.reward') } </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue columnGap={ 1 } multiRow>
            <NativeCoinValue amount={ totalReward.toString() } accuracy={ 0 } loading={ isPlaceholderData }/>
            { rewardBreakDown }
          </DetailedInfo.ItemValue>
        </>
      ) }

      { data.rewards
        ?.filter(({ type }) => type !== 'Validator Reward' && type !== 'Miner Reward')
        .map(({ type, reward }) => (
          <React.Fragment key={ type }>
            <DetailedInfo.ItemLabel
              hint={ t('blockDetails.distributed_hint', { validator: validatorTitle }) }
            >
              { type }
            </DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue>
              <NativeCoinValue amount={ reward.toString() } accuracy={ 0 }/>
            </DetailedInfo.ItemValue>
          </React.Fragment>
        ))
      }

      { typeof data.zilliqa?.view === 'number' && (
        <>
          <DetailedInfo.ItemLabel
            hint={ t('blockDetails.view_hint') }
            isLoading={ isPlaceholderData }
          >
            { t('blockDetails.view') } </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <Skeleton loading={ isPlaceholderData }>
              { formatNumber(data.zilliqa.view, locale) }
            </Skeleton>
          </DetailedInfo.ItemValue>
        </>
      ) }

      <DetailedInfo.ItemDivider/>

      { data.celo?.base_fee && <BlockDetailsBaseFeeCelo data={ data.celo.base_fee }/> }

      <DetailedInfo.ItemLabel
        hint={ t('blockDetails.gas_used_hint') }
        isLoading={ isPlaceholderData }
      >
        { t('blockDetails.gas_used') } </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton loading={ isPlaceholderData }>
          { formatBigNumber(BigNumber(data.gas_used || 0), locale) }
        </Skeleton>
        <BlockGasUsed
          gasUsed={ data.gas_used || undefined }
          gasLimit={ data.gas_limit }
          isLoading={ isPlaceholderData }
          ml={ 4 }
          gasTarget={ data.gas_target_percentage || undefined }
        />
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint={ t('blockDetails.gas_limit_hint') }
        isLoading={ isPlaceholderData }
      >
        { t('blockDetails.gas_limit') } </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton loading={ isPlaceholderData }>
          { formatBigNumber(BigNumber(data.gas_limit), locale) }
        </Skeleton>
      </DetailedInfo.ItemValue>

      { data.minimum_gas_price && (
        <>
          <DetailedInfo.ItemLabel
            hint={ t('blockDetails.minimum_gas_hint') }
            isLoading={ isPlaceholderData }
          >
            { t('blockDetails.minimum_gas') } </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <NativeCoinValue amount={ data.minimum_gas_price } units="gwei" loading={ isPlaceholderData }/>
          </DetailedInfo.ItemValue>
        </>
      ) }

      { data.base_fee_per_gas && (
        <>
          <DetailedInfo.ItemLabel
            hint={ t('blockDetails.base_fee_hint') }
            isLoading={ isPlaceholderData }
          >
            { t('blockDetails.base_fee') } </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue multiRow>
            <GasPriceValue
              amount={ data.base_fee_per_gas }
              loading={ isPlaceholderData }
            />
          </DetailedInfo.ItemValue>
        </>
      ) }

      { !config.UI.views.block.hiddenFields?.burnt_fees && !burntFees.isEqualTo(ZERO) && (
        <>
          <DetailedInfo.ItemLabel
            hint={
              t('blockDetails.burnt_hint', { currency: config.chain.currency.symbol || t('blockDetails.native_token') })
            }
            isLoading={ isPlaceholderData }
          >
            { t('blockDetails.burnt_fees') } </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue multiRow>
            <NativeCoinValue
              amount={ burntFees.toString() }
              accuracy={ 0 }
              loading={ isPlaceholderData }
              startElement={ <IconSvg name="flame" boxSize={ 5 } mr={{ base: 1, lg: 2 }} color="icon.primary" isLoading={ isPlaceholderData }/> }
              mr={ 4 }
            />
            { !txFees.isEqualTo(ZERO) && (
              <Tooltip content={ t('blockDetails.burnt_ratio') }>
                <Utilization
                  value={ burntFees.dividedBy(txFees).toNumber() }
                  isLoading={ isPlaceholderData }
                />
              </Tooltip>
            ) }
          </DetailedInfo.ItemValue>
        </>
      ) }

      { data.priority_fee !== null && BigNumber(data.priority_fee).gt(ZERO) && (
        <>
          <DetailedInfo.ItemLabel
            hint={ t('blockDetails.priority_hint') }
            isLoading={ isPlaceholderData }
          >
            { t('blockDetails.priority') } </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <NativeCoinValue amount={ data.priority_fee.toString() } accuracy={ 0 } loading={ isPlaceholderData }/>
          </DetailedInfo.ItemValue>
        </>
      ) }

      { /* ADDITIONAL INFO */ }
      <CollapsibleDetails loading={ isPlaceholderData } mt={ 6 } gridColumn={{ base: undefined, lg: '1 / 3' }}>
        <GridItem colSpan={{ base: undefined, lg: 2 }} mt={{ base: 1, lg: 4 }}/>

        { rollupFeature.isEnabled && rollupFeature.type === 'zkSync' && data.zksync &&
              <ZkSyncL2TxnBatchHashesInfo data={ data.zksync } isLoading={ isPlaceholderData }/> }

        { !isPlaceholderData && <BlockDetailsBlobInfo data={ data }/> }

        { data.bitcoin_merged_mining_header && (
          <>
            <DetailedInfo.ItemLabel
              hint={ t('blockDetails.bitcoin_header_hint') }
            >
              { t('blockDetails.bitcoin_header') } </DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue
              flexWrap="nowrap"
              alignSelf="flex-start"
            >
              <Box whiteSpace="nowrap" overflow="hidden">
                <HashStringShortenDynamic hash={ data.bitcoin_merged_mining_header }/>
              </Box>
              <CopyToClipboard text={ data.bitcoin_merged_mining_header }/>
            </DetailedInfo.ItemValue>
          </>
        ) }

        { data.bitcoin_merged_mining_coinbase_transaction && (
          <>
            <DetailedInfo.ItemLabel
              hint={ t('blockDetails.coinbase_hint') }
            >
              { t('blockDetails.coinbase') } </DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue>
              <RawDataSnippet
                data={ data.bitcoin_merged_mining_coinbase_transaction }
                isLoading={ isPlaceholderData }
                showCopy={ false }
                textareaMaxHeight="100px"
              />
            </DetailedInfo.ItemValue>
          </>
        ) }

        { data.bitcoin_merged_mining_merkle_proof && (
          <>
            <DetailedInfo.ItemLabel
              hint={ t('blockDetails.merkle_hint') }
            >
              { t('blockDetails.merkle') } </DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue>
              <RawDataSnippet
                data={ data.bitcoin_merged_mining_merkle_proof }
                isLoading={ isPlaceholderData }
                showCopy={ false }
                textareaMaxHeight="100px"
              />
            </DetailedInfo.ItemValue>
          </>
        ) }

        { data.hash_for_merged_mining && (
          <>
            <DetailedInfo.ItemLabel
              hint={ t('blockDetails.merged_hash_hint') }
            >
              { t('blockDetails.merged_hash') } </DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue
              flexWrap="nowrap"
              alignSelf="flex-start"
            >
              <Box whiteSpace="nowrap" overflow="hidden">
                <HashStringShortenDynamic hash={ data.hash_for_merged_mining }/>
              </Box>
              <CopyToClipboard text={ data.hash_for_merged_mining }/>
            </DetailedInfo.ItemValue>
          </>
        ) }

        { data.difficulty && (
          <>
            <DetailedInfo.ItemLabel
              hint={ t('blockDetails.difficulty_hint', { validator: validatorTitle }) }
            >
              { t('blockDetails.difficulty') } </DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue>
              <Box overflow="hidden">
                <HashStringShortenDynamic hash={ formatBigNumber(BigNumber(data.difficulty), locale) }/>
              </Box>
            </DetailedInfo.ItemValue>
          </>
        ) }
        { data.total_difficulty && (
          <>
            <DetailedInfo.ItemLabel
              hint={ t('blockDetails.total_difficulty_hint') }
            >
              { t('blockDetails.total_difficulty') } </DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue>
              <Box overflow="hidden">
                <HashStringShortenDynamic hash={ formatBigNumber(BigNumber(data.total_difficulty), locale) }/>
              </Box>
            </DetailedInfo.ItemValue>
          </>
        ) }

        <DetailedInfo.ItemDivider/>

        <DetailedInfo.ItemLabel
          hint={ t('blockDetails.hash_hint') }
        >
          { t('blockDetails.hash') } </DetailedInfo.ItemLabel>
        <DetailedInfo.ItemValue flexWrap="nowrap">
          <Box overflow="hidden" >
            <HashStringShortenDynamic hash={ data.hash }/>
          </Box>
          <CopyToClipboard text={ data.hash }/>
        </DetailedInfo.ItemValue>

        { data.height > 0 && (
          <>
            <DetailedInfo.ItemLabel
              hint={ t('blockDetails.parent_hash_hint') }
            >
              { t('blockDetails.parent_hash') } </DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue flexWrap="nowrap">
              <Link
                href={ route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: String(data.height - 1) } }, multichainContext) }
                overflow="hidden"
                whiteSpace="nowrap"
              >
                <HashStringShortenDynamic
                  hash={ data.parent_hash }
                />
              </Link>
              <CopyToClipboard text={ data.parent_hash }/>
            </DetailedInfo.ItemValue>
          </>
        ) }

        { rollupFeature.isEnabled && rollupFeature.type === 'arbitrum' && data.arbitrum && data.arbitrum.send_count && (
          <>
            <DetailedInfo.ItemLabel
              hint={ t('blockDetails.send_count_hint', { current: layerLabels.current, parent: layerLabels.parent }) }
              isLoading={ isPlaceholderData }
            >
              { t('blockDetails.send_count') } </DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue>
              { formatNumber(data.arbitrum.send_count, locale) }
            </DetailedInfo.ItemValue>

            <DetailedInfo.ItemLabel
              hint={ t('blockDetails.send_root_hint', { current: layerLabels.current, parent: layerLabels.parent }) }
              isLoading={ isPlaceholderData }
            >
              { t('blockDetails.send_root') } </DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue>
              { data.arbitrum.send_root }
            </DetailedInfo.ItemValue>

            <DetailedInfo.ItemLabel
              hint={ t('blockDetails.delayed_hint', { current: layerLabels.current, parent: layerLabels.parent }) }
              isLoading={ isPlaceholderData }
            >
              { t('blockDetails.delayed') } </DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue>
              { formatNumber(data.arbitrum.delayed_messages, locale) }
            </DetailedInfo.ItemValue>
          </>
        ) }

        { !config.UI.views.block.hiddenFields?.nonce && (
          <>
            <DetailedInfo.ItemLabel
              hint={ t('blockDetails.nonce_hint') }
            >
              { t('blockDetails.nonce') } </DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue>
              { data.nonce }
            </DetailedInfo.ItemValue>
          </>
        ) }

        { data.zilliqa && (
          <>
            <DetailedInfo.ItemDivider/>
            <BlockDetailsZilliqaQuorumCertificate data={ data.zilliqa?.quorum_certificate }/>
            { data.zilliqa?.aggregate_quorum_certificate && (
              <>
                <GridItem colSpan={{ base: undefined, lg: 2 }} mt={{ base: 1, lg: 2 }}/>
                <BlockDetailsZilliqaQuorumCertificate data={ data.zilliqa?.aggregate_quorum_certificate }/>
              </>
            ) }
          </>
        ) }
      </CollapsibleDetails>

    </DetailedInfo.Container>
  );
};

export default BlockDetails;
