// Modified by Quat Capital, 2026-10-25: localize complete block-validation labels per request. GPL-3.0.
import { useTranslation } from 'react-i18next';

import config from 'configs/app';

interface ValidationLabels {
  readonly blocksTitle: string;
  readonly blocksHint: string;
}

export function useAddressValidationLabels(): ValidationLabels {
  const { t } = useTranslation();
  switch (config.chain.verificationType) {
    case 'validation':
      return { blocksTitle: t('addresses.blocks_validated'), blocksHint: t('addresses.hints.validated_count') };
    case 'posting':
      return { blocksTitle: t('addresses.blocks_posted'), blocksHint: t('addresses.hints.posted_count') };
    case 'sequencing':
      return { blocksTitle: t('addresses.blocks_sequenced'), blocksHint: t('addresses.hints.sequenced_count') };
    case 'fee reception':
      return { blocksTitle: t('addresses.blocks_validated'), blocksHint: t('addresses.hints.fee_recipient_count') };
    default:
      return { blocksTitle: t('addresses.blocks_mined'), blocksHint: t('addresses.hints.mined_count') };
  }
}
