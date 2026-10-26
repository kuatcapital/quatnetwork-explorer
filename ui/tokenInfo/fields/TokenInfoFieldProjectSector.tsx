// Modified by Quat Capital, 2026-10-26: marketplace, rewards or token info localization. GPL-3.0.
import { createListCollection } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { Fields } from '../types';
import type { TokenInfoApplicationConfig } from 'types/api/account';

import { FormFieldSelect } from 'toolkit/components/forms/fields/FormFieldSelect';

interface Props {
  readOnly?: boolean;
  config: TokenInfoApplicationConfig['projectSectors'];
}

const TokenInfoFieldProjectSector = ({ readOnly, config }: Props) => {
  const { t: tEco } = useTranslation();

  const collection = React.useMemo(() => {
    const items = config.map((option) => ({ label: option, value: option }));
    return createListCollection({ items });
  }, [ config ]);

  return (
    <FormFieldSelect<Fields, 'project_sector'>
      name="project_sector"
      placeholder={ tEco('tokenInfoUI.project_industry') }
      collection={ collection }
      readOnly={ readOnly }
    />
  );
};

export default React.memo(TokenInfoFieldProjectSector);
