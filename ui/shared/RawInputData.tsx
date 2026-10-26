import { createListCollection } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import hexToUtf8 from 'lib/hexToUtf8';
import type { SelectOption } from 'toolkit/chakra/select';
import { Select } from 'toolkit/chakra/select';
import RawDataSnippet from 'ui/shared/RawDataSnippet';

export type DataType = 'Hex' | 'UTF-8';

interface Props {
  hex: string;
  rightSlot?: React.ReactNode;
  defaultDataType?: DataType;
  isLoading?: boolean;
  minHeight?: string;
}

const RawInputData = ({ hex, rightSlot: rightSlotProp, defaultDataType = 'Hex', isLoading, minHeight }: Props) => {
  const { t } = useTranslation();
  const collection = React.useMemo(() => createListCollection<SelectOption>({
    items: [
      { label: t('sharedUi.hex'), value: 'Hex' },
      { label: 'UTF-8', value: 'UTF-8' },
    ],
  }), [ t ]);
  const [ selectedDataType, setSelectedDataType ] = React.useState<DataType>(defaultDataType);

  const handleValueChange = React.useCallback(({ value }: { value: Array<string> }) => {
    setSelectedDataType(value[0] as DataType);
  }, []);

  const rightSlot = (
    <>
      <Select
        collection={ collection }
        placeholder={ t('sharedUi.select_type') }
        value={ [ selectedDataType ] }
        onValueChange={ handleValueChange }
        w="fit-content"
        mr="auto"
        loading={ isLoading }
      />
      { rightSlotProp }
    </>
  );

  return (
    <RawDataSnippet
      data={ selectedDataType === 'Hex' ? hex : hexToUtf8(hex) }
      rightSlot={ rightSlot }
      isLoading={ isLoading }
      textareaMaxHeight="220px"
      textareaMinHeight={ minHeight || '160px' }
      w="100%"
    />
  );
};

export default React.memo(RawInputData);
// Modified by Quat Capital, 2026-10-26: translated type labels with stable data encoding. GPL-3.0.
