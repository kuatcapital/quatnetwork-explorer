// Modified by Quat Capital, 2026-10-26: T18 reviewed literal localization. GPL-3.0.
import { Box } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { type AdvancedFilterParams } from 'types/api/advancedFilter';

import { Radio, RadioGroup } from 'toolkit/chakra/radio';

const FILTER_PARAM = 'address_relation';

type Value = 'or' | 'and';

const DEFAULT_VALUE = 'or' as Value;

type Props = {
  value?: Value;
  handleFilterChange: (filed: keyof AdvancedFilterParams, value?: string) => void;
  columnName: string;
  isLoading?: boolean;
  onClose?: () => void;
};

const AddressRelationFilter = ({ value = DEFAULT_VALUE, handleFilterChange, onClose }: Props) => {
  const { t: tQuat } = useTranslation();

  const onFilter = React.useCallback(({ value }: { value: string | null }) => {
    if (!value) {
      return;
    }

    onClose && onClose();
    handleFilterChange(FILTER_PARAM, value as Value);
  }, [ handleFilterChange, onClose ]);

  return (
    <Box w="120px">
      <RadioGroup onValueChange={ onFilter } value={ value } orientation="vertical">
        <Radio value="or">{ tQuat('advancedFilterUi.or') }</Radio>
        <Radio value="and">{ tQuat('advancedFilterUi.and') }</Radio>
      </RadioGroup>
    </Box>
  );
};

export default AddressRelationFilter;
