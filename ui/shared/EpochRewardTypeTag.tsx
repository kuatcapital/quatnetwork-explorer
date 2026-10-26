// Modified by Quat Capital, 2026-10-26: reactive full epoch reward labels and hints. GPL-3.0.
import type { TFunction } from 'i18next';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { CeloEpochRewardsType } from 'types/api/epochs';

import type { BadgeProps } from 'toolkit/chakra/badge';
import { Badge } from 'toolkit/chakra/badge';
import { Tooltip } from 'toolkit/chakra/tooltip';

type Props = {
  type: CeloEpochRewardsType;
  isLoading?: boolean;
};

const getTypeTags = (t: TFunction): Record<CeloEpochRewardsType, { text: string; label: string; color: BadgeProps['colorPalette'] }> => ({
  group: {
    text: t('editorShared.group_rewards'),
    label: t('editorShared.group_rewards_hint'),
    color: 'teal',
  },
  validator: {
    text: t('editorShared.validator_rewards'),
    label: t('editorShared.validator_rewards_hint'),
    color: 'purple',
  },
  delegated_payment: {
    text: t('editorShared.delegated_payments'),
    label: t('editorShared.delegated_payments_hint'),
    color: 'blue',
  },
  voter: {
    text: t('editorShared.voting_rewards'),
    label: t('editorShared.voting_rewards_hint'),
    color: 'yellow',
  },
});

const EpochRewardTypeTag = ({ type, isLoading }: Props) => {
  const { t } = useTranslation();
  const { text, label, color } = getTypeTags(t)[type];

  return (
    <Tooltip content={ label }>
      <Badge colorPalette={ color } loading={ isLoading }>
        { text }
      </Badge>
    </Tooltip>
  );
};

export default React.memo(EpochRewardTypeTag);
