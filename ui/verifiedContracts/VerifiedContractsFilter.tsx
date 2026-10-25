// Modified by Quat Capital, 2026-10-25: localize contract verification interface. GPL-3.0.
import { createListCollection } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { VerifiedContractsFilter as TVerifiedContractsFilter } from 'types/api/contracts';

import useApiQuery from 'lib/api/useApiQuery';
import formatLanguageName from 'lib/contracts/formatLanguageName';
import type { SelectOption } from 'toolkit/chakra/select';
import PopoverFilterRadio from 'ui/shared/filters/PopoverFilterRadio';

interface Props {
  hasActiveFilter: boolean;
  defaultValue: TVerifiedContractsFilter | undefined;
  onChange: (nextValue: string | Array<string>) => void;
}

const VerifiedContractsFilter = ({ onChange, defaultValue, hasActiveFilter }: Props) => {
  const { t: tQuat } = useTranslation();

  const { data, isPending } = useApiQuery('general:config_contract_languages');

  const options = React.useMemo(() => {
    return [
      { value: 'all', label: tQuat('common.all') },
      ...(data?.languages || []).map((language) => ({ value: language, label: formatLanguageName(language) })),
    ];
  }, [ data?.languages, tQuat ]);

  const collection = React.useMemo(() => {
    return createListCollection<SelectOption>({ items: options });
  }, [ options ]);

  return (
    <PopoverFilterRadio
      name="verified_contracts_filter"
      collection={ collection }
      onChange={ onChange }
      hasActiveFilter={ hasActiveFilter }
      initialValue={ defaultValue || options[0].value }
      isLoading={ isPending }
    />
  );
};

export default React.memo(VerifiedContractsFilter);
