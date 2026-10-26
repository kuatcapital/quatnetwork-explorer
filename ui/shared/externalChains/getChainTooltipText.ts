// Modified by Quat Capital, 2026-10-26: caller-scoped chain tooltip translation. GPL-3.0.
import type { TFunction } from 'i18next';

import type { ExternalChain } from 'types/externalChains';

export default function getChainTooltipText(chain: Pick<ExternalChain, 'id' | 'name'> | undefined, t: TFunction, prefix: string = ''): string {
  if (!chain) {
    return t('sharedEntities.unknown_chain');
  }
  return t('sharedUi.chain_tooltip', { prefix, chain: chain.name, id: chain.id });
}
