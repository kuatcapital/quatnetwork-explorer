// Modified by Quat Capital, 2026-10-26: reactive search result labels with preserved operator entity names. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useLocale } from 'lib/i18n/provider';

import type { Category } from './utils';
import { searchItemTitles } from './utils';

export function useLocalizedSearchItemTitles(): Record<Category, { itemTitle: string; itemTitleShort: string }> {
  const { t } = useTranslation();
  const { locale } = useLocale();
  return React.useMemo(() => {
    if (locale === 'en') return searchItemTitles;
    const sameLabel = (label: string) => ({ itemTitle: label, itemTitleShort: label });
    return {
      app: /^(?:dapp|app)$/i.test(searchItemTitles.app.itemTitle) ? sameLabel(t('searchItem.app')) : searchItemTitles.app,
      domain: sameLabel(t('common.name')),
      cluster: sameLabel(t('search.categories.cluster')),
      token: sameLabel(t('common.token')),
      nft: sameLabel('NFT'),
      confidential_token: { itemTitle: t('searchItem.confidential_token'), itemTitleShort: t('searchItem.confidential_short') },
      address: sameLabel(t('common.address')),
      public_tag: { itemTitle: t('searchItem.public_tag'), itemTitleShort: t('searchItem.tag') },
      transaction: { itemTitle: t('common.transaction'), itemTitleShort: t('home.txn') },
      block: sameLabel(t('common.block')),
      user_operation: { itemTitle: t('searchItem.user_operation'), itemTitleShort: t('searchItem.user_op') },
      blob: sameLabel(t('searchItem.blob')),
      tac_operation: sameLabel(t('navigation.operations')),
      zetaChainCCTX: sameLabel('CCTX'),
    };
  }, [ t, locale ]);
}
