// Modified by Quat Capital, 2026-10-27: selected-locale supplemental numeric values. GPL-3.0.
import { HStack } from '@chakra-ui/react';
import { BigNumber } from 'bignumber.js';
import React from 'react';

import type { HotContract } from 'types/api/contracts';

import { formatBigNumber, NUMBER_LOCALES } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import { TruncatedText } from 'toolkit/components/truncation/TruncatedText';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import { Reputation } from 'ui/shared/entities/token/TokenEntity';
import EntityTags from 'ui/shared/EntityTags/EntityTags';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';

interface Props {
  isLoading?: boolean;
  data: HotContract;
  exchangeRate: string | null;
};

const HotContractsTableItem = ({
  isLoading,
  data,
  exchangeRate,
}: Props) => {
  const { locale } = useLocale();
  const protocolTags = data?.contract_address?.metadata?.tags?.filter(tag => tag.tagType === 'protocol');

  return (
    <TableRow>
      <TableCell>
        <HStack>
          <AddressEntity
            address={ data.contract_address }
            isLoading={ isLoading }
          />
          <Reputation value={ data.contract_address.reputation ?? null } ml={ 0 }/>
        </HStack>
        { protocolTags && protocolTags.length > 0 && (
          <EntityTags
            isLoading={ isLoading }
            tags={ protocolTags }
            mt="10px"
            noColors
          />
        ) }
      </TableCell>
      <TableCell isNumeric>
        <TruncatedText text={ Number(data.transactions_count).toLocaleString(NUMBER_LOCALES[locale]) } loading={ isLoading } maxW="100%"/>
      </TableCell>
      <TableCell isNumeric>
        <TruncatedText text={ formatBigNumber(BigNumber(data.total_gas_used || 0), locale) } loading={ isLoading } maxW="100%"/>
      </TableCell>
      <TableCell isNumeric>
        <NativeCoinValue
          amount={ data.balance }
          loading={ isLoading }
          exchangeRate={ exchangeRate }
          layout="vertical"
          rowGap="10px"
        />
      </TableCell>
    </TableRow>
  );
};

export default HotContractsTableItem;
