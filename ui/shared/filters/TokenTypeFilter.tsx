// Modified by Quat Capital, 2026-10-26: localize shared controls, details and data feedback. GPL-3.0.
import { Text, Flex, useCheckboxGroup, Fieldset } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { NFTTokenType, TokenType } from 'types/api/token';
import type { ClusterChainConfig } from 'types/multichain';

import { getTokenTypes } from 'lib/token/tokenTypes';
import { Button } from 'toolkit/chakra/button';
import { Checkbox, CheckboxGroup } from 'toolkit/chakra/checkbox';

type Props<T extends TokenType | NFTTokenType> = {
  onChange: (nextValue: Array<T>) => void;
  defaultValue?: Array<T>;
  nftOnly: T extends NFTTokenType ? true : false;
  chainConfig?: Array<ClusterChainConfig['app_config']> | ClusterChainConfig['app_config'];
};
const TokenTypeFilter = <T extends TokenType | NFTTokenType>({ nftOnly, onChange, defaultValue, chainConfig }: Props<T>) => {
  const { t } = useTranslation();
  const { value, setValue } = useCheckboxGroup({ defaultValue });

  const handleReset = React.useCallback(() => {
    if (value.length === 0) {
      return;
    }
    setValue([]);
    onChange([]);
  }, [ onChange, setValue, value.length ]);

  const handleChange = React.useCallback((nextValue: Array<string>) => {
    setValue(nextValue as Array<T>);
    onChange(nextValue as Array<T>);
  }, [ onChange, setValue ]);

  const tokenTypes = React.useMemo(() => {
    return getTokenTypes(nftOnly, chainConfig);
  }, [ chainConfig, nftOnly ]);

  return (
    <>
      <Flex justifyContent="space-between" textStyle="sm">
        <Text fontWeight={ 600 } color="text.secondary">{ t('common.type') }</Text>
        <Button
          variant="link"
          onClick={ handleReset }
          disabled={ value.length === 0 }
          textStyle="sm"
        >
          { t('common.reset') }
        </Button>
      </Flex>
      <Fieldset.Root>
        <CheckboxGroup defaultValue={ defaultValue } onValueChange={ handleChange } value={ value } name="token_type">
          <Fieldset.Content>
            { Object.keys(tokenTypes).map((id) => (
              <Checkbox key={ id } value={ id }>
                { tokenTypes[id as keyof typeof tokenTypes] }
              </Checkbox>
            )) }
          </Fieldset.Content>
        </CheckboxGroup>
      </Fieldset.Root>
    </>
  );
};

export default TokenTypeFilter;
