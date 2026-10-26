// Modified by Quat Capital, 2026-10-26: localize blob and statistics metadata. GPL-3.0.
import { GridItem } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { Blob } from 'types/api/blobs';

import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { Alert } from 'toolkit/chakra/alert';
import { Skeleton } from 'toolkit/chakra/skeleton';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import DetailedInfoSponsoredItem from 'ui/shared/DetailedInfo/DetailedInfoSponsoredItem';
import TxEntity from 'ui/shared/entities/tx/TxEntity';

import BlobData from './BlobData';

interface Props {
  data: Blob;
  isLoading?: boolean;
}

const BlobInfo = ({ data, isLoading }: Props) => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  return (
    <DetailedInfo.Container
      templateColumns={{ base: 'minmax(0, 1fr)', lg: '216px minmax(728px, auto)' }}
    >
      { !data.blob_data && (
        <GridItem colSpan={{ base: undefined, lg: 2 }} mb={ 3 }>
          <Skeleton loading={ isLoading }>
            <Alert status="warning">{ t('blobUI.not_indexed') }</Alert>
          </Skeleton>
        </GridItem>
      ) }

      { data.kzg_proof && (
        <>
          <DetailedInfo.ItemLabel
            hint={ t('blobUI.proof_hint') }
            isLoading={ isLoading }
          >
            { t('blobUI.proof') }
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <Skeleton loading={ isLoading } overflow="hidden" whiteSpace="pre-wrap" wordBreak="break-all">
              { data.kzg_proof }
              <CopyToClipboard text={ data.kzg_proof } isLoading={ isLoading }/>
            </Skeleton>
          </DetailedInfo.ItemValue>
        </>
      ) }

      { data.kzg_commitment && (
        <>
          <DetailedInfo.ItemLabel
            hint={ t('blobUI.commitment_hint') }
            isLoading={ isLoading }
          >
            { t('blobUI.commitment') }
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <Skeleton loading={ isLoading } overflow="hidden" whiteSpace="pre-wrap" wordBreak="break-all">
              { data.kzg_commitment }
              <CopyToClipboard text={ data.kzg_commitment } isLoading={ isLoading }/>
            </Skeleton>
          </DetailedInfo.ItemValue>
        </>
      ) }

      { data.blob_data && (
        <>
          <DetailedInfo.ItemLabel
            hint={ t('blobUI.size_hint') }
            isLoading={ isLoading }
          >
            { t('blobUI.size') }
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <Skeleton loading={ isLoading } overflow="hidden" whiteSpace="pre-wrap" wordBreak="break-all">
              { formatNumber(data.blob_data.replace('0x', '').length / 2, locale) }
            </Skeleton>
          </DetailedInfo.ItemValue>
        </>
      ) }

      { data.transaction_hashes[0] && (
        <>
          <DetailedInfo.ItemLabel
            hint={ t('blobUI.tx_hash_hint') }
            isLoading={ isLoading }
          >
            { t('blobUI.tx_hash') }
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <TxEntity hash={ data.transaction_hashes[0].transaction_hash } isLoading={ isLoading } noIcon/>
          </DetailedInfo.ItemValue>
        </>
      ) }

      <DetailedInfoSponsoredItem isLoading={ isLoading }/>

      { data.blob_data && (
        <BlobData data={ data.blob_data } hash={ data.hash } isLoading={ isLoading }/>
      ) }
    </DetailedInfo.Container>
  );
};

export default React.memo(BlobInfo);
