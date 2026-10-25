// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import { upperFirst } from 'es-toolkit';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { Address } from 'types/api/address';
import type { ExcludeNull, ExcludeUndefined } from 'types/utils';

import { currencyUnits } from 'lib/units';
import { Link } from 'toolkit/chakra/link';
import { TruncatedText } from 'toolkit/components/truncation/TruncatedText';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import * as DetailedInfoItemBreakdown from 'ui/shared/DetailedInfo/DetailedInfoItemBreakdown';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';

interface Props {
  isLoading?: boolean;
  data: ExcludeNull<ExcludeUndefined<Address['celo']>['account']>;
}

const AddressCeloAccount = ({ isLoading, data }: Props) => {
  const { t: tQuat } = useTranslation();

  return (
    <>
      <DetailedInfo.ItemLabel
        hint={ tQuat('addresses.celo_hint') }
        isLoading={ isLoading }
      >{ tQuat('addresses.celo_account') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue multiRow>
        { data.name && <TruncatedText text={ data.name } mr={ 3 }/> }
        <DetailedInfoItemBreakdown.Container loading={ isLoading }>
          <DetailedInfoItemBreakdown.Row
            label={ tQuat('common.type') }
            hint={ tQuat('addresses.account_role_hint') }
          >
            { upperFirst(data.type) }
          </DetailedInfoItemBreakdown.Row>

          { data.metadata_url && (
            <DetailedInfoItemBreakdown.Row
              label={ tQuat('addresses.metadata_url') }
              hint={ tQuat('addresses.metadata_url_hint') }
            >
              <Link href={ data.metadata_url } external>
                <TruncatedText text={ data.metadata_url }/>
              </Link>
            </DetailedInfoItemBreakdown.Row>
          ) }

          <DetailedInfoItemBreakdown.Row
            label={ tQuat('addresses.locked_currency', { currency: currencyUnits.ether }) }
            hint={ tQuat('addresses.locked_celo_hint') }
          >
            <NativeCoinValue amount={ data.locked_celo } noSymbol/>
          </DetailedInfoItemBreakdown.Row>

          <DetailedInfoItemBreakdown.Row
            label={ tQuat('addresses.nonvoting_locked_currency', { currency: currencyUnits.ether }) }
            hint={ tQuat('addresses.nonvoting_celo_hint') }
          >
            <NativeCoinValue amount={ data.nonvoting_locked_celo } noSymbol/>
          </DetailedInfoItemBreakdown.Row>

          { data.vote_signer_address && (
            <DetailedInfoItemBreakdown.Row
              label={ tQuat('addresses.vote_signer') }
              hint={ tQuat('addresses.vote_signer_hint') }
            >
              <AddressEntity address={ data.vote_signer_address }/>
            </DetailedInfoItemBreakdown.Row>
          ) }

          { data.validator_signer_address && (
            <DetailedInfoItemBreakdown.Row
              label={ tQuat('addresses.validator_signer') }
              hint={ tQuat('addresses.validator_signer_hint') }
            >
              <AddressEntity address={ data.validator_signer_address }/>
            </DetailedInfoItemBreakdown.Row>
          ) }

          { data.attestation_signer_address && (
            <DetailedInfoItemBreakdown.Row
              label={ tQuat('addresses.attestation_signer') }
              hint={ tQuat('addresses.attestation_signer_hint') }
            >
              <AddressEntity address={ data.attestation_signer_address }/>
            </DetailedInfoItemBreakdown.Row>
          ) }
        </DetailedInfoItemBreakdown.Container>
      </DetailedInfo.ItemValue>
    </>
  );
};

export default React.memo(AddressCeloAccount);
