// Modified by Quat Capital, 2026-10-26: localize validators, epochs and transfers. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { ValidatorsZilliqaItem } from 'types/api/validators';

import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { Skeleton } from 'toolkit/chakra/skeleton';
import ValidatorEntity from 'ui/shared/entities/validator/ValidatorEntity';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';

interface Props {
  data: ValidatorsZilliqaItem;
  isLoading?: boolean;
}

const ValidatorsListItem = ({ data, isLoading }: Props) => {
  const { locale } = useLocale();
  const { t } = useTranslation();

  return (
    <ListItemMobileGrid.Container>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ t('networkTransfers.bls_key') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <ValidatorEntity
          isLoading={ isLoading }
          id={ data.bls_public_key }
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ t('networkTransfers.index') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton loading={ isLoading } display="inline-block">
          { formatNumber(data.index, locale) }
        </Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ t('networkTransfers.balance') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <NativeCoinValue
          amount={ data.balance }
          loading={ isLoading }
        />
      </ListItemMobileGrid.Value>
    </ListItemMobileGrid.Container>
  );
};

export default React.memo(ValidatorsListItem);
