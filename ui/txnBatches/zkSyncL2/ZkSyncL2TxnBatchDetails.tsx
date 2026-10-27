import type { TFunction } from 'i18next';
// Modified by Quat Capital, 2026-10-27: localized L2 and interop interface. GPL-3.0.
// Modified by Quat Capital, 2026-10-26: T18 reviewed literal localization. GPL-3.0.
import { GridItem } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { ZKSYNC_L2_TX_BATCH_STATUSES, type ZkSyncBatch } from 'types/api/zkSyncL2';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import type { ResourceError } from 'lib/api/resources';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { formatZkSyncL2TxnBatchStatus, layerLabels } from 'lib/rollups/utils';
import { currencyUnits } from 'lib/units';
import { CollapsibleDetails } from 'toolkit/chakra/collapsible';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TruncatedText } from 'toolkit/components/truncation/TruncatedText';
import isCustomAppError from 'ui/shared/AppError/isCustomAppError';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import DetailedInfoTimestamp from 'ui/shared/DetailedInfo/DetailedInfoTimestamp';
import PrevNext from 'ui/shared/PrevNext';
import GasPriceValue from 'ui/shared/value/GasPriceValue';
import VerificationSteps from 'ui/shared/verificationSteps/VerificationSteps';

import ZkSyncL2TxnBatchHashesInfo from './ZkSyncL2TxnBatchHashesInfo';

const rollupFeature = config.features.rollup;

interface Props {
  query: UseQueryResult<ZkSyncBatch, ResourceError>;
}

const ZkSyncL2TxnBatchDetails = ({ query }: Props) => {
  const { t: tQuat } = useTranslation();
  const verificationSteps = React.useMemo(() => ZKSYNC_L2_TX_BATCH_STATUSES.slice(1).map(status => getLocalizedBatchStatus(status, tQuat)), [ tQuat ]);
  const { locale } = useLocale();

  const router = useRouter();

  const { data, isPlaceholderData, isError, error } = query;

  const handlePrevNextClick = React.useCallback((direction: 'prev' | 'next') => {
    if (!data) {
      return;
    }

    const increment = direction === 'next' ? +1 : -1;
    const nextId = String(data.number + increment);

    router.push({ pathname: '/batches/[number]', query: { number: nextId } }, undefined);
  }, [ data, router ]);

  if (isError) {
    if (isCustomAppError(error)) {
      throwOnResourceLoadError({ isError, error });
    }

    return <DataFetchAlert/>;
  }

  if (!data) {
    return null;
  }

  const txNum = data.l2_transactions_count + data.l1_transactions_count;
  const parentChainCurrency = rollupFeature.isEnabled ? rollupFeature.parentChain.currency?.symbol : undefined;

  return (
    <DetailedInfo.Container
      templateColumns={{ base: 'minmax(0, 1fr)', lg: 'minmax(min-content, 200px) minmax(0, 1fr)' }}
    >
      <DetailedInfo.ItemLabel
        hint={ tQuat('l2Ui.batch_number_hint_period', { current: layerLabels.current, parent: layerLabels.parent }) }
        isLoading={ isPlaceholderData }
      >{ tQuat('l2Ui.txn_batch_number') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton loading={ isPlaceholderData }>
          { data.number }
        </Skeleton>
        <PrevNext
          ml={ 6 }
          onClick={ handlePrevNextClick }
          prevLabel={ tQuat('l2Ui.previous_batch') }
          nextLabel={ tQuat('l2Ui.next_batch') }
          isPrevDisabled={ data.number === 0 }
          isLoading={ isPlaceholderData }
        />
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint={ tQuat('l2Ui.batch_status_lifecycle_hint') }
        isLoading={ isPlaceholderData }
      >{ tQuat('common.status') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <VerificationSteps
          steps={ verificationSteps }
          currentStep={ getLocalizedBatchStatus(data.status, tQuat) }
          isLoading={ isPlaceholderData }
        />
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint={ tQuat('l2Ui.batch_produced_hint') }
        isLoading={ isPlaceholderData }
      >{ tQuat('common.timestamp') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        { data.timestamp ? <DetailedInfoTimestamp timestamp={ data.timestamp } isLoading={ isPlaceholderData }/> : tQuat('l2Ui.undefined') }
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint={ tQuat('l2Ui.batch_transactions_hint_period') }
        isLoading={ isPlaceholderData }
      >{ tQuat('common.transactions') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton loading={ isPlaceholderData }>
          <Link href={ route({ pathname: '/batches/[number]', query: { number: data.number.toString(), tab: 'txs' } }) }>
            { tQuat('sectionCounts.transactions', {
              count: txNum,
              value: formatNumber(txNum, locale),
            }) }
          </Link>
        </Skeleton>
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemDivider/>

      <ZkSyncL2TxnBatchHashesInfo isLoading={ isPlaceholderData } data={ data }/>

      <CollapsibleDetails loading={ isPlaceholderData } mt={ 6 } gridColumn={{ base: undefined, lg: '1 / 3' }}>
        <GridItem colSpan={{ base: undefined, lg: 2 }} mt={{ base: 1, lg: 4 }}/>

        <DetailedInfo.ItemLabel
          hint={ tQuat('l2Ui.batch_root_hint', { current: layerLabels.parent, parent: layerLabels.parent }) }
        >{ tQuat('l2Ui.root_hash') }</DetailedInfo.ItemLabel>
        <DetailedInfo.ItemValue
          flexWrap="nowrap"
          alignSelf="flex-start"
        >
          <TruncatedText text={ data.root_hash }/>
          <CopyToClipboard text={ data.root_hash }/>
        </DetailedInfo.ItemValue>

        <DetailedInfo.ItemLabel
          hint={ tQuat('l2Ui.settlement_gas_hint', { parent: layerLabels.parent }) }
        >
          { tQuat('l2Ui.layer_gas_price', { layer: layerLabels.parent }) }</DetailedInfo.ItemLabel>
        <DetailedInfo.ItemValue multiRow>
          <GasPriceValue
            amount={ data.l1_gas_price }
            loading={ isPlaceholderData }
            asset={ parentChainCurrency || currencyUnits.ether }
          />
        </DetailedInfo.ItemValue>

        <DetailedInfo.ItemLabel
          hint={ tQuat('l2Ui.fair_gas_hint') }
        >
          { tQuat('l2Ui.layer_fair_gas', { layer: layerLabels.current }) }</DetailedInfo.ItemLabel>
        <DetailedInfo.ItemValue multiRow>
          <GasPriceValue
            amount={ data.l2_fair_gas_price }
            loading={ isPlaceholderData }
          />
        </DetailedInfo.ItemValue>
      </CollapsibleDetails>
    </DetailedInfo.Container>
  );
};

export default ZkSyncL2TxnBatchDetails;

function getLocalizedBatchStatus(status: string, t: TFunction): string {
  switch (status) {
    case 'Processed on L2': return t('sharedStatus.processed_on', { layer: layerLabels.current });
    case 'Sealed on L2': return t('sharedStatus.sealed_on', { layer: layerLabels.current });
    case 'Sent to L1': return t('sharedStatus.sent_to', { layer: layerLabels.parent });
    case 'Validated on L1': return t('sharedStatus.validated_on', { layer: layerLabels.parent });
    case 'Executed on L1': return t('sharedStatus.executed_on', { layer: layerLabels.parent });
    default: return formatZkSyncL2TxnBatchStatus(status as typeof ZKSYNC_L2_TX_BATCH_STATUSES[number]);
  }
}
