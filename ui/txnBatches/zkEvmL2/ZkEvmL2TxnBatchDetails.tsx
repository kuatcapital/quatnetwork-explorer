import type { TFunction } from 'i18next';
// Modified by Quat Capital, 2026-10-27: localized L2 and interop interface. GPL-3.0.
// Modified by Quat Capital, 2026-10-26: T18 reviewed literal localization. GPL-3.0.
import { Text } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { ZKEVM_L2_TX_BATCH_STATUSES } from 'types/api/zkEvmL2';
import type { ZkEvmL2TxnBatch } from 'types/api/zkEvmL2';

import { route } from 'nextjs-routes';

import type { ResourceError } from 'lib/api/resources';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { formatZkEvmL2TxnBatchStatus, layerLabels } from 'lib/rollups/utils';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import isCustomAppError from 'ui/shared/AppError/isCustomAppError';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import DetailedInfoTimestamp from 'ui/shared/DetailedInfo/DetailedInfoTimestamp';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import PrevNext from 'ui/shared/PrevNext';
import VerificationSteps from 'ui/shared/verificationSteps/VerificationSteps';



interface Props {
  query: UseQueryResult<ZkEvmL2TxnBatch, ResourceError>;
}

const ZkEvmL2TxnBatchDetails = ({ query }: Props) => {
  const { t: tQuat } = useTranslation();
  const verificationSteps = React.useMemo(() => ZKEVM_L2_TX_BATCH_STATUSES.map(status => getLocalizedBatchStatus(status, tQuat)), [ tQuat ]);
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

  return (
    <DetailedInfo.Container
      templateColumns={{ base: 'minmax(0, 1fr)', lg: 'minmax(min-content, 200px) minmax(0, 1fr)' }}
    >
      <DetailedInfo.ItemLabel
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
        isLoading={ isPlaceholderData }
      >{ tQuat('common.timestamp') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        { data.timestamp ? <DetailedInfoTimestamp timestamp={ data.timestamp } isLoading={ isPlaceholderData }/> : tQuat('l2Ui.undefined') }
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        isLoading={ isPlaceholderData }
      >{ tQuat('transactions.verify_hash') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        { data.verify_transaction_hash ? (
          <TxEntityL1
            isLoading={ isPlaceholderData }
            hash={ data.verify_transaction_hash }
            maxW="100%"
            noCopy
          />
        ) : <Text>{ tQuat('common.pending') }</Text> }
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        isLoading={ isPlaceholderData }
      >{ tQuat('common.transactions') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton loading={ isPlaceholderData }>
          <Link href={ route({ pathname: '/batches/[number]', query: { number: data.number.toString(), tab: 'txs' } }) }>
            { tQuat('sectionCounts.transactions', {
              count: data.transactions.length,
              value: formatNumber(data.transactions.length, locale),
            }) }
          </Link>
        </Skeleton>
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemDivider/>

      <DetailedInfo.ItemLabel
        isLoading={ isPlaceholderData }
      >{ tQuat('l2Ui.global_exit_root') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue
        flexWrap="nowrap"
      >
        <Skeleton loading={ isPlaceholderData } overflow="hidden">
          <HashStringShortenDynamic hash={ data.global_exit_root }/>
        </Skeleton>
        <CopyToClipboard text={ data.global_exit_root } isLoading={ isPlaceholderData }/>
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        isLoading={ isPlaceholderData }
      >{ tQuat('l2Ui.acc_input_hash') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue
        flexWrap="nowrap"
      >
        <Skeleton loading={ isPlaceholderData } overflow="hidden">
          <HashStringShortenDynamic hash={ data.acc_input_hash }/>
        </Skeleton>
        <CopyToClipboard text={ data.acc_input_hash } isLoading={ isPlaceholderData }/>
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        isLoading={ isPlaceholderData }
      >{ tQuat('transactions.sequence_hash') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        { data.sequence_transaction_hash ? (
          <TxEntityL1
            isLoading={ isPlaceholderData }
            hash={ data.sequence_transaction_hash }
            maxW="100%"
            noCopy
          />
        ) : <Text>{ tQuat('common.pending') }</Text> }
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        isLoading={ isPlaceholderData }
      >{ tQuat('l2Ui.state_root') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue
        flexWrap="nowrap"
      >
        <Skeleton loading={ isPlaceholderData } overflow="hidden">
          <HashStringShortenDynamic hash={ data.state_root }/>
        </Skeleton>
        <CopyToClipboard text={ data.state_root } isLoading={ isPlaceholderData }/>
      </DetailedInfo.ItemValue>
    </DetailedInfo.Container>
  );
};

export default ZkEvmL2TxnBatchDetails;

function getLocalizedBatchStatus(status: string, t: TFunction): string {
  switch (status) {
    case 'Unfinalized': return t('sharedStatus.unfinalized');
    case 'L1 Sequence Confirmed': return t('sharedStatus.sequence_confirmed', { layer: layerLabels.parent });
    case 'Finalized': return t('sharedStatus.finalized');
    default: return formatZkEvmL2TxnBatchStatus(status);
  }
}
