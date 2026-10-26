// Modified by Quat Capital, 2026-10-26: localize validators, epochs and transfers. GPL-3.0.
import { Flex } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { ValidatorZilliqa } from 'types/api/validators';

import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { Skeleton } from 'toolkit/chakra/skeleton';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import DetailedInfoSponsoredItem from 'ui/shared/DetailedInfo/DetailedInfoSponsoredItem';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import NativeTokenIcon from 'ui/shared/NativeTokenIcon';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';

interface Props {
  data: ValidatorZilliqa;
  isLoading: boolean;
}

const ValidatorDetails = ({ data, isLoading }: Props) => {
  const { locale } = useLocale();
  const { t } = useTranslation();
  return (
    <DetailedInfo.Container>
      <DetailedInfo.ItemLabel
        hint={ t('networkTransfers.staker_index_hint') }
        isLoading={ isLoading }
      >
        { t('networkTransfers.index') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton loading={ isLoading } display="inline">
          { formatNumber(data.index, locale) }
        </Skeleton>
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint={ t('networkTransfers.staker_balance_hint') }
        isLoading={ isLoading }
      >
        { t('networkTransfers.staked') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <NativeCoinValue
          startElement={ <NativeTokenIcon isLoading={ isLoading } boxSize={ 5 } mr={ 2 }/> }
          amount={ data.balance }
          loading={ isLoading }
        />
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint={ t('networkTransfers.peer_hint') }
        isLoading={ isLoading }
      >
        { t('networkTransfers.peer_id') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Flex alignItems="center" w="100%" minWidth={ 0 }>
          <Skeleton loading={ isLoading } maxW="calc(100% - 28px)" overflow="hidden">
            <HashStringShortenDynamic hash={ data.peer_id }/>
          </Skeleton>
          <CopyToClipboard text={ data.peer_id } isLoading={ isLoading }/>
        </Flex>
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint={ t('networkTransfers.control_hint') }
        isLoading={ isLoading }
      >
        { t('networkTransfers.control_address') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <AddressEntity address={ data.control_address } isLoading={ isLoading }/>
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint={ t('networkTransfers.reward_address_hint') }
        isLoading={ isLoading }
      >
        { t('networkTransfers.reward_address') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <AddressEntity address={ data.reward_address } isLoading={ isLoading }/>
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint={ t('networkTransfers.signing_hint') }
        isLoading={ isLoading }
      >
        { t('networkTransfers.signing_address') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <AddressEntity address={ data.signing_address } isLoading={ isLoading }/>
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint={ t('networkTransfers.added_hint') }
        isLoading={ isLoading }
      >
        { t('networkTransfers.added_block') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <BlockEntity number={ data.added_at_block_number } isLoading={ isLoading }/>
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint={ t('networkTransfers.updated_hint') }
        isLoading={ isLoading }
      >
        { t('networkTransfers.stake_updated') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <BlockEntity number={ data.stake_updated_at_block_number } isLoading={ isLoading }/>
      </DetailedInfo.ItemValue>

      <DetailedInfoSponsoredItem isLoading={ isLoading }/>
    </DetailedInfo.Container>
  );
};

export default React.memo(ValidatorDetails);
