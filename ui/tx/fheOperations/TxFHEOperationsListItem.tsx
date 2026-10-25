// Modified by Quat Capital, 2026-10-25: runtime transaction interface localization. GPL-3.0.
import { Box, Flex, Grid, Text } from '@chakra-ui/react';
import { capitalize } from 'es-toolkit';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { FheOperation } from 'types/api/fheOperations';

import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { Badge } from 'toolkit/chakra/badge';
import { Skeleton } from 'toolkit/chakra/skeleton';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import { getTypeColor } from 'ui/tx/fheOperations/utils';

type Props = FheOperation & { isLoading?: boolean };

const TxFHEOperationsListItem = (props: Props) => {
  const { locale } = useLocale();
  const { t: tTx } = useTranslation();
  const { log_index: logIndex, operation, type, fhe_type: fheType, is_scalar: isScalar, hcu_cost: hcuCost, hcu_depth: hcuDepth, caller, isLoading } = props;

  return (
    <ListItemMobile>
      <Flex gap={ 2 } flexWrap="wrap" alignItems="center">
        <Badge colorPalette={ getTypeColor(type) } loading={ isLoading }>
          { capitalize(type) }
        </Badge>
        <Badge colorPalette="gray" loading={ isLoading }>
          { fheType }
        </Badge>
        <Badge colorPalette="gray" loading={ isLoading }>
          { isScalar ? tTx('transactions.scalar') : tTx('transactions.non_scalar') }
        </Badge>
      </Flex>

      <Grid templateColumns="110px 1fr" rowGap={ 2 } columnGap={ 2 }>
        <Text fontWeight="medium">{ tTx('transactions.index') }</Text>
        <Skeleton loading={ isLoading } color="text.secondary">
          { logIndex }
        </Skeleton>

        <Text fontWeight="medium">{ tTx('transactions.operation') }</Text>
        <Skeleton loading={ isLoading } color="text.secondary">
          { operation }
        </Skeleton>

        <Text fontWeight="medium">{ tTx('transactions.hcu_cost') }</Text>
        <Skeleton loading={ isLoading } color="text.secondary">
          { formatNumber(hcuCost, locale) }
        </Skeleton>

        <Text fontWeight="medium">{ tTx('transactions.hcu_depth') }</Text>
        <Skeleton loading={ isLoading } color="text.secondary">
          { formatNumber(hcuDepth, locale) }
        </Skeleton>

        <Text fontWeight="medium">{ tTx('transactions.caller') }</Text>
        <Box minW={ 0 }>
          { caller && caller.hash ? (
            <AddressEntity
              address={ caller }
              truncation="constant"
              isLoading={ isLoading }
            />
          ) : (
            <Text color="text.secondary">—</Text>
          ) }
        </Box>
      </Grid>
    </ListItemMobile>
  );
};

export default React.memo(TxFHEOperationsListItem);
