// Modified by Quat Capital, 2026-10-26: localize shared controls, details and data feedback. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { UserOpSponsorType as TUserOpSponsorType } from 'types/api/userOps';

import { Badge } from 'toolkit/chakra/badge';

type Props = {
  sponsorType: TUserOpSponsorType;
};

const UserOpSponsorType = ({ sponsorType }: Props) => {
  const { t } = useTranslation();
  let text: string = sponsorType;
  switch (sponsorType) {
    case 'paymaster_hybrid':
      text = t('sharedUi.paymaster_hybrid');
      break;
    case 'paymaster_sponsor':
      text = t('sharedUi.paymaster_sponsor');
      break;
    case 'wallet_balance':
      text = t('sharedUi.wallet_balance');
      break;
    case 'wallet_deposit':
      text = t('sharedUi.wallet_deposit');
  }
  return <Badge>{ text }</Badge>;
};

export default UserOpSponsorType;
