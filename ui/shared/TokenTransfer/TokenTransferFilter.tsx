// Modified by Quat Capital, 2026-10-26: localize shared controls, details and data feedback. GPL-3.0.
import { Text, Stack } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { AddressFromToFilter } from 'types/api/address';
import type { TokenType } from 'types/api/token';
import type { ClusterChainConfig } from 'types/multichain';

import useIsInitialLoading from 'lib/hooks/useIsInitialLoading';
import { Radio, RadioGroup } from 'toolkit/chakra/radio';
import PopoverFilter from 'ui/shared/filters/PopoverFilter';
import TokenTypeFilter from 'ui/shared/filters/TokenTypeFilter';

interface Props {
  appliedFiltersNum?: number;
  defaultTypeFilters: Array<TokenType> | undefined;
  onTypeFilterChange: (nextValue: Array<TokenType>) => void;
  withAddressFilter?: boolean;
  onAddressFilterChange?: (nextValue: string) => void;
  defaultAddressFilter?: AddressFromToFilter;
  isLoading?: boolean;
  chainConfig?: Array<ClusterChainConfig['app_config']> | ClusterChainConfig['app_config'];
}

const TokenTransferFilter = ({
  onTypeFilterChange,
  defaultTypeFilters,
  appliedFiltersNum,
  withAddressFilter,
  onAddressFilterChange,
  defaultAddressFilter,
  isLoading,
  chainConfig,
}: Props) => {
  const { t } = useTranslation();
  const isInitialLoading = useIsInitialLoading(isLoading);

  const handleAddressFilterChange = React.useCallback(({ value }: { value: string | null }) => {
    if (!value) {
      return;
    }

    onAddressFilterChange?.(value);
  }, [ onAddressFilterChange ]);

  return (
    <PopoverFilter appliedFiltersNum={ appliedFiltersNum } contentProps={{ w: '220px' }} isLoading={ isInitialLoading }>
      { withAddressFilter && (
        <>
          <Text color="text.secondary" fontWeight={ 600 }>{ t('common.address') }</Text>
          <RadioGroup
            size="lg"
            onValueChange={ handleAddressFilterChange }
            defaultValue={ defaultAddressFilter || 'all' }
            paddingBottom={ 4 }
            borderBottom="1px solid"
            borderColor="border.divider"
          >
            <Stack gap={ 4 }>
              <Radio value="all"><Text fontSize="md">{ t('common.all') }</Text></Radio>
              <Radio value="from"><Text fontSize="md">{ t('sharedUi.outgoing_transfers') }</Text></Radio>
              <Radio value="to"><Text fontSize="md">{ t('sharedUi.incoming_transfers') }</Text></Radio>
            </Stack>
          </RadioGroup>
        </>
      ) }
      <TokenTypeFilter<TokenType>
        onChange={ onTypeFilterChange }
        defaultValue={ defaultTypeFilters }
        nftOnly={ false }
        chainConfig={ chainConfig }
      />
    </PopoverFilter>
  );
};

export default React.memo(TokenTransferFilter);
