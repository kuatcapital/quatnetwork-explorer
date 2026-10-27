// Modified by Quat Capital, 2026-10-27: localized TAC status labels. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type * as tac from '@blockscout/tac-operation-lifecycle-types';

import { getTacOperationStatus } from 'lib/operations/tac';
import type { BadgeProps } from 'toolkit/chakra/badge';
import { Badge } from 'toolkit/chakra/badge';

interface Props extends BadgeProps {
  type: tac.OperationType;
}

const TacOperationTag = ({ type, ...rest }: Props) => {
  const { t } = useTranslation();

  const text = getTacOperationStatus(type, t);

  if (!text) {
    return null;
  }

  return <Badge { ...rest }>{ text }</Badge>;
};

export default React.memo(TacOperationTag);
