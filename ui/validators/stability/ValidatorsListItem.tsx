// Modified by Quat Capital, 2026-10-26: localize validators, epochs and transfers. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { ValidatorStability } from 'types/api/validators';

import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { Skeleton } from 'toolkit/chakra/skeleton';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';
import ValidatorStatus from 'ui/shared/statusTag/ValidatorStabilityStatus';

interface Props {
  data: ValidatorStability;
  isLoading?: boolean;
}

const ValidatorsListItem = ({ data, isLoading }: Props) => {
  const { locale } = useLocale();
  const { t } = useTranslation();

  return (
    <ListItemMobileGrid.Container>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ t('networkTransfers.address') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <AddressEntity
          isLoading={ isLoading }
          address={ data.address }
          truncation="constant"
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ t('networkTransfers.status') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <ValidatorStatus state={ data.state } isLoading={ isLoading }/>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ t('networkTransfers.blocks') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton loading={ isLoading }>
          { formatNumber(data.blocks_validated_count, locale) }
        </Skeleton>
      </ListItemMobileGrid.Value>
    </ListItemMobileGrid.Container>
  );
};

export default React.memo(ValidatorsListItem);
