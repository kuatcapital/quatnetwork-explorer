// Modified by Quat Capital, 2026-10-29: runtime native-token labels preserve machine token ids. GPL-3.0.
// Modified by Quat Capital, 2026-10-27: localize token group counts and sorting labels. GPL-3.0.
import { Text, Box, Flex } from '@chakra-ui/react';
import { sumBy } from 'es-toolkit';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { FormattedData } from './types';

import { useLocale } from 'lib/i18n/provider';
import { getTokenTypeName } from 'lib/token/tokenTypes';
import { Link } from 'toolkit/chakra/link';
import { FilterInput } from 'toolkit/components/filters/FilterInput';
import { thinsp } from 'toolkit/utils/htmlEntities';
import IconSvg from 'ui/shared/IconSvg';

import { getAddressCountOptions } from '../localization';
import type { Sort } from '../utils/tokenUtils';
import { getSortingFn, sortTokenGroups } from '../utils/tokenUtils';
import TokenSelectItem from './TokenSelectItem';

interface Props {
  searchTerm: string;
  getSort: (typeId: string) => Sort;
  filteredData: FormattedData;
  onInputChange: (searchTerm: string) => void;
  onSortClick: (event: React.SyntheticEvent) => void;
}

const TokenSelectMenu = ({ getSort, filteredData, onInputChange, onSortClick, searchTerm }: Props) => {
  const { t: tQuat } = useTranslation();
  const { locale } = useLocale();

  const hasFilteredResult = sumBy(Object.values(filteredData), ({ items }) => items.length) > 0;

  return (
    <>
      <FilterInput
        placeholder={ tQuat('addresses.search_token_name') }
        size="sm"
        inputProps={{ bgColor: 'dialog.bg' }}
        mb={ 5 }
        onChange={ onInputChange }
      />
      <Flex flexDir="column" rowGap={ 6 }>
        { Object.entries(filteredData).sort(sortTokenGroups).map(([ tokenType, tokenInfo ]) => {
          if (tokenInfo.items.length === 0) {
            return null;
          }

          const type = tokenType;
          const sortDirection = getSort(type);
          const arrowTransform = sortDirection === 'desc' ? 'rotate(90deg)' : 'rotate(-90deg)';
          const hasSort = tokenInfo.items.length > 1 && (
            (type === 'ERC-404' && tokenInfo.items.some(item => item.value)) ||
            type === 'ERC-1155' ||
            (type !== 'ERC-721' && tokenInfo.items.some(({ usd }) => usd))
          );
          const numPrefix = tokenInfo.isOverflow ? `>${ thinsp }` : '';
          const countOptions = getAddressCountOptions(tokenInfo.items.length, locale);
          const typeName = getTokenTypeName(type, undefined, tQuat);

          return (
            <Box key={ type }>
              <Flex justifyContent="space-between">
                <Text mb={ 3 } color="gray.500" fontWeight={ 600 } fontSize="sm">
                  { tQuat('addressTxUi.token_group', { ...countOptions, type: typeName, value: numPrefix + countOptions.value }) }
                </Text>
                { hasSort && (
                  <Link data-type={ type } onClick={ onSortClick } aria-label={ tQuat('addressTxUi.sort_token_group', { type: typeName }) }>
                    <IconSvg name="arrows/east" boxSize={ 5 } transform={ arrowTransform } transitionDuration="faster"/>
                  </Link>
                ) }
              </Flex>
              { tokenInfo.items.sort(getSortingFn(type)(sortDirection)).map((data) =>
                <TokenSelectItem key={ data.token.address_hash + data.token_id } data={ data }/>) }
            </Box>
          );
        }) }
      </Flex>
      { Boolean(searchTerm) && !hasFilteredResult && <Text fontSize="sm">{ tQuat('addresses.no_matches') }</Text> }
    </>
  );
};

export default React.memo(TokenSelectMenu);
