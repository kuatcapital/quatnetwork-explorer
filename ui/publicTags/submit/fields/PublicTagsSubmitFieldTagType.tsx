// Modified by Quat Capital, 2026-10-26: account interface localization. GPL-3.0.
import { createListCollection } from '@chakra-ui/react';
import { capitalize } from 'es-toolkit';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { FormFields } from '../types';
import type { PublicTagType } from 'types/api/addressMetadata';

import type { SelectOption } from 'toolkit/chakra/select';
import { FormFieldSelect } from 'toolkit/components/forms/fields/FormFieldSelect';
interface Props {
  index: number;
  tagTypes: Array<PublicTagType> | undefined;
}

const PublicTagsSubmitFieldTagType = ({ index, tagTypes }: Props) => {
  const { t: tAcct } = useTranslation();

  const collection = React.useMemo(() => {
    const items = tagTypes?.map((type) => ({
      value: type.type,
      label: capitalize(type.type),
    })) ?? [];

    return createListCollection<SelectOption>({ items });
  }, [ tagTypes ]);

  return (
    <FormFieldSelect<FormFields, `tags.${ number }.type`>
      name={ `tags.${ index }.type` }
      placeholder={ tAcct('accountUI.tag_type') }
      collection={ collection }
      required
    />
  );
};

export default React.memo(PublicTagsSubmitFieldTagType);
