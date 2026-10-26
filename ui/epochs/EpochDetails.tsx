// Modified by Quat Capital, 2026-10-26: localize validators, epochs and transfers. GPL-3.0.
import { Box, chakra } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { CeloEpochDetails } from 'types/api/epochs';

import useIsMobile from 'lib/hooks/useIsMobile';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import DetailedInfoTimestamp from 'ui/shared/DetailedInfo/DetailedInfoTimestamp';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import CeloEpochStatus from 'ui/shared/statusTag/CeloEpochStatus';
import TokenTransferSnippet from 'ui/shared/TokenTransferSnippet/TokenTransferSnippet';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';
import TokenValue from 'ui/shared/value/TokenValue';

import EpochElectionRewards from './electionRewards/EpochElectionRewards';

interface Props {
  data: CeloEpochDetails;
  isLoading?: boolean;
}

const EpochDetails = ({ data, isLoading }: Props) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const processingRange = (() => {
    if (!data.start_processing_block_number || !data.end_processing_block_number) {
      return <Box color="text.secondary">{ t('networkTransfers.unavailable') }</Box>;
    }

    if (data.start_processing_block_number === data.end_processing_block_number) {
      return <BlockEntity number={ data.start_processing_block_number } isLoading={ isLoading } noIcon/>;
    }

    return (
      <>
        <BlockEntity number={ data.start_processing_block_number } isLoading={ isLoading } noIcon/>
        <chakra.span color="text.secondary" whiteSpace="pre"> - </chakra.span>
        <BlockEntity number={ data.end_processing_block_number } isLoading={ isLoading } noIcon/>
      </>
    );
  })();

  const totalFundRewards = (() => {
    if (!data.distribution?.transfers_total?.total?.value) {
      return <Box color="text.secondary">{ t('networkTransfers.unavailable') }</Box>;
    }

    if (data.distribution?.transfers_total?.token) {
      return (
        <TokenValue
          amount={ data.distribution?.transfers_total?.total?.value }
          token={ data.distribution?.transfers_total.token }
          decimals={ data.distribution?.transfers_total?.total?.decimals }
          accuracy={ 0 }
          loading={ isLoading }
        />
      );
    }

    return (
      <NativeCoinValue
        amount={ data.distribution?.transfers_total?.total?.value }
        accuracy={ 0 }
        loading={ isLoading }
      />
    );
  })();

  return (
    <>
      <DetailedInfo.Container>
        <DetailedInfo.ItemLabel
          hint={ t('networkTransfers.epoch_status_hint') }
          isLoading={ isLoading }
        >
          { t('networkTransfers.status') }</DetailedInfo.ItemLabel>
        <DetailedInfo.ItemValue>
          <CeloEpochStatus
            isFinalized={ data.is_finalized }
            loading={ isLoading }
          />
        </DetailedInfo.ItemValue>
        <DetailedInfo.ItemLabel
          hint={ t('networkTransfers.epoch_time_hint') }
          isLoading={ isLoading }
        >
          { t('networkTransfers.timestamp') }</DetailedInfo.ItemLabel>
        <DetailedInfo.ItemValue>
          { data.timestamp ?
            <DetailedInfoTimestamp timestamp={ data.timestamp } isLoading={ isLoading }/> :
            <Box color="text.secondary" whiteSpace="pre-wrap">{ t('networkTransfers.epoch_daily') }</Box> }
        </DetailedInfo.ItemValue>
        <DetailedInfo.ItemLabel
          hint={ t('networkTransfers.processing_hint') }
          isLoading={ isLoading }
        >
          { t('networkTransfers.processing_range') }</DetailedInfo.ItemLabel>
        <DetailedInfo.ItemValue>
          { processingRange }
        </DetailedInfo.ItemValue>
        <DetailedInfo.ItemLabel
          hint={ t('networkTransfers.community_hint') }
          isLoading={ isLoading }
        >
          { t('networkTransfers.community_fund') }</DetailedInfo.ItemLabel>
        <DetailedInfo.ItemValue multiRow>
          { data.distribution?.community_transfer ? (
            <TokenTransferSnippet
              data={ data.distribution.community_transfer }
              isLoading={ isLoading }
              noAddressIcons={ isMobile }
            />
          ) : (
            <Box color="text.secondary">{ t('networkTransfers.unavailable') }</Box>
          ) }
        </DetailedInfo.ItemValue>
        <DetailedInfo.ItemLabel
          hint={ t('networkTransfers.carbon_hint') }
          isLoading={ isLoading }
        >
          { t('networkTransfers.carbon_fund') }</DetailedInfo.ItemLabel>
        <DetailedInfo.ItemValue multiRow>
          { data.distribution?.carbon_offsetting_transfer ? (
            <TokenTransferSnippet
              data={ data.distribution.carbon_offsetting_transfer }
              isLoading={ isLoading }
              noAddressIcons={ isMobile }
            />
          ) : (
            <Box color="text.secondary">{ t('networkTransfers.unavailable') }</Box>
          ) }
        </DetailedInfo.ItemValue>
        <DetailedInfo.ItemLabel
          hint={ t('networkTransfers.total_fund_hint') }
          isLoading={ isLoading }
        >
          { t('networkTransfers.total_fund') }</DetailedInfo.ItemLabel>
        <DetailedInfo.ItemValue>
          { totalFundRewards }
        </DetailedInfo.ItemValue>
      </DetailedInfo.Container>
      <EpochElectionRewards data={ data } isLoading={ isLoading }/>
    </>
  );
};

export default React.memo(EpochDetails);
