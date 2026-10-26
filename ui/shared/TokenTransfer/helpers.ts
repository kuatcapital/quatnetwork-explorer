// Modified by Quat Capital, 2026-10-26: translate transfer labels without changing API values. GPL-3.0.
import type { TFunction } from 'i18next';

import type { TokenTransfer } from 'types/api/tokenTransfer';

export const getTokenTransferTypeText = (type: TokenTransfer['type'], t: TFunction): string | undefined => {
  switch (type) {
    case 'token_minting':
      return t('sharedUi.token_minting');
    case 'token_burning':
      return t('sharedUi.token_burning');
    case 'token_spawning':
      return t('sharedUi.token_creating');
    case 'token_transfer':
      return t('sharedUi.token_transfer');
  }
};
