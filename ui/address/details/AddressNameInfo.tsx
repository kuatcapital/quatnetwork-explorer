// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { Address } from 'types/api/address';

import { Skeleton } from 'toolkit/chakra/skeleton';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';

interface Props {
  data: Pick<Address, 'name' | 'token' | 'is_contract'>;
  isLoading?: boolean;
}

const AddressNameInfo = ({ data, isLoading }: Props) => {
  const { t: tQuat } = useTranslation();

  if (data.token) {
    return (
      <>
        <DetailedInfo.ItemLabel
          hint={ tQuat('addresses.token_name_hint') }
          isLoading={ isLoading }
        >{ tQuat('addresses.token_name') }</DetailedInfo.ItemLabel>
        <DetailedInfo.ItemValue>
          <TokenEntity
            token={ data.token }
            isLoading={ isLoading }
            noIcon
            noCopy
          />
        </DetailedInfo.ItemValue>
      </>
    );
  }

  if (data.is_contract && data.name) {
    return (
      <>
        <DetailedInfo.ItemLabel
          hint={ tQuat('addresses.contract_name_hint') }
          isLoading={ isLoading }
        >{ tQuat('addresses.contract_name') }</DetailedInfo.ItemLabel>
        <DetailedInfo.ItemValue>
          <Skeleton loading={ isLoading }>
            { data.name }
          </Skeleton>
        </DetailedInfo.ItemValue>
      </>
    );
  }

  if (data.name) {
    return (
      <>
        <DetailedInfo.ItemLabel
          hint={ tQuat('addresses.validator_name_hint') }
          isLoading={ isLoading }
        >{ tQuat('addresses.validator_name') }</DetailedInfo.ItemLabel>
        <DetailedInfo.ItemValue>
          <Skeleton loading={ isLoading }>
            { data.name }
          </Skeleton>
        </DetailedInfo.ItemValue>
      </>
    );
  }

  return null;
};

export default React.memo(AddressNameInfo);
