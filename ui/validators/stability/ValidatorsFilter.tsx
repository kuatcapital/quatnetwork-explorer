// Modified by Quat Capital, 2026-10-26: reactive filter labels; API filter values unchanged. GPL-3.0.
import { createListCollection } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { ValidatorsStabilityFilters } from 'types/api/validators';

import PopoverFilterRadio from 'ui/shared/filters/PopoverFilterRadio';

interface Props {
  hasActiveFilter: boolean;
  defaultValue: ValidatorsStabilityFilters['state_filter'] | undefined;
  onChange: (nextValue: string | Array<string>) => void;
}

const ValidatorsFilter = ({ onChange, defaultValue, hasActiveFilter }: Props) => {
  const { t } = useTranslation();
  const collection = React.useMemo(() => createListCollection({
    items: [
      { value: 'all', label: t('networkTransfers.all') },
      { value: 'active', label: t('networkTransfers.active') },
      { value: 'probation', label: t('networkTransfers.probation') },
      { value: 'inactive', label: t('networkTransfers.inactive') },
    ],
  }), [ t ]);
  return (
    <PopoverFilterRadio
      name="validators_filter"
      collection={ collection }
      onChange={ onChange }
      hasActiveFilter={ hasActiveFilter }
      initialValue={ defaultValue || 'all' }
    />
  );
};

export default React.memo(ValidatorsFilter);
