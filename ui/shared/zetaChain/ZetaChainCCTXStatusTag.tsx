import React from 'react';
import { useTranslation } from 'react-i18next';

import { CctxStatus } from '@blockscout/zetachain-cctx-types';

import { Tag } from 'toolkit/chakra/tag';

type Props = {
  status: CctxStatus;
  isLoading?: boolean;
};

const TagText: Record<CctxStatus, string> = {
  [CctxStatus.PENDING_OUTBOUND]: 'sharedUi.pending_outbound',
  [CctxStatus.PENDING_INBOUND]: 'sharedUi.pending_inbound',
  [CctxStatus.OUTBOUND_MINED]: 'sharedUi.outbound_mined',
  [CctxStatus.PENDING_REVERT]: 'sharedUi.pending_revert',
  [CctxStatus.ABORTED]: 'sharedUi.aborted',
  [CctxStatus.REVERTED]: 'sharedUi.reverted',
  [CctxStatus.UNRECOGNIZED]: 'sharedUi.unknown_status',
};

const ZetaChainCCTXStatusTag = ({ status, isLoading }: Props) => {
  const { t } = useTranslation();
  return (
    <Tag loading={ isLoading }>
      { t(TagText[status] || 'sharedUi.unknown_status') }
    </Tag>
  );
};

export default React.memo(ZetaChainCCTXStatusTag);
// Modified by Quat Capital, 2026-10-26: localized CCTX statuses without changing protocol enums. GPL-3.0.
