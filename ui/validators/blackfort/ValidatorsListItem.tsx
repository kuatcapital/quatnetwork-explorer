// Modified by Quat Capital, 2026-10-26: localize validators, epochs and transfers. GPL-3.0.
import { Flex } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { ValidatorBlackfort } from 'types/api/validators';

import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TruncatedText } from 'toolkit/components/truncation/TruncatedText';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';

interface Props {
  data: ValidatorBlackfort;
  isLoading?: boolean;
}

const ValidatorsListItem = ({ data, isLoading }: Props) => {
  const { locale } = useLocale();
  const { t } = useTranslation();

  return (
    <ListItemMobileGrid.Container gridTemplateColumns="130px auto">

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ t('networkTransfers.address') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <AddressEntity
          isLoading={ isLoading }
          address={ data.address }
          truncation="constant"
        />
      </ListItemMobileGrid.Value>

      { data.name && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>{ t('networkTransfers.name') }</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <Flex><TruncatedText text={ data.name } loading={ isLoading }/></Flex>
          </ListItemMobileGrid.Value>
        </>
      ) }

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ t('networkTransfers.commission') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton loading={ isLoading }>
          { `${ formatNumber(data.commission / 100, locale) }%` }
        </Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ t('networkTransfers.self_bonded') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <NativeCoinValue
          amount={ data.self_bonded_amount }
          loading={ isLoading }
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ t('networkTransfers.delegated') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <NativeCoinValue
          amount={ data.delegated_amount }
          loading={ isLoading }
        />
      </ListItemMobileGrid.Value>

    </ListItemMobileGrid.Container>
  );
};

export default React.memo(ValidatorsListItem);
