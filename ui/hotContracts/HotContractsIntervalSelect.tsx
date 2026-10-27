// Modified by Quat Capital, 2026-10-27: T18 reviewed literal localization. GPL-3.0.
import { createListCollection } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { HotContractsInterval } from 'types/api/contracts';

import useIsInitialLoading from 'lib/hooks/useIsInitialLoading';
import type { SelectOption } from 'toolkit/chakra/select';
import { Select } from 'toolkit/chakra/select';
import TagGroupSelect from 'ui/shared/tagGroupSelect/TagGroupSelect';

import { getIntervalItems } from './utils';

interface Props {
  interval: HotContractsInterval;
  onIntervalChange: (newInterval: HotContractsInterval) => void;
  isLoading?: boolean;
};

const HotContractsIntervalSelect = ({ interval, onIntervalChange, isLoading }: Props) => {
  const { t: tQuat } = useTranslation();
  const translatedItems = React.useMemo(() => getIntervalItems(tQuat), [ tQuat ]);
  const intervalCollection = React.useMemo(() => createListCollection<SelectOption<string>>({
    items: translatedItems.map((item) => ({ value: item.id, label: item.labelFull })),
  }), [ translatedItems ]);
  const intervalItems = React.useMemo(() => translatedItems.map((item) => ({ id: item.id, title: item.labelShort })), [ translatedItems ]);

  const isInitialLoading = useIsInitialLoading(isLoading);

  const handleItemSelect = React.useCallback(({ value }: { value: Array<string> }) => {
    onIntervalChange(value[0] as HotContractsInterval);
  }, [ onIntervalChange ]);

  return (
    <>
      <TagGroupSelect<HotContractsInterval>
        items={ intervalItems }
        onChange={ onIntervalChange }
        value={ interval }
        tagSize="lg"
        loading={ isInitialLoading }
        disabled={ isLoading }
        hideBelow="lg"
      />
      <Select
        collection={ intervalCollection }
        placeholder={ tQuat('suppUi.select_interval') }
        value={ [ interval ] }
        onValueChange={ handleItemSelect }
        hideFrom="lg"
        w="100%"
        loading={ isInitialLoading }
        disabled={ isLoading }
      />
    </>
  );
};

export default React.memo(HotContractsIntervalSelect);
