// Modified by Quat Capital, 2026-10-25: request-local search category labels. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import config from 'configs/app';
import { useLocale } from 'lib/i18n/provider';
import type { Category } from 'ui/shared/search/utils';
import { searchCategories } from 'ui/shared/search/utils';

interface LocalizedCategory {
  readonly id: Category;
  readonly title: string;
  readonly tabTitle: string;
}

export function useLocalizedSearchCategories(): Array<LocalizedCategory> {
  const { t } = useTranslation();
  const { locale } = useLocale();

  return React.useMemo(() => {
    const labels: Record<Category, { title: string; tabTitle: string }> = {
      token: {
        title: t('search.categories.tokens_full', { standard: config.chain.tokenStandard }),
        tabTitle: t('common.tokens'),
      },
      nft: {
        title: t('search.categories.nfts_full', { standard: config.chain.tokenStandard }),
        tabTitle: t('search.categories.nfts'),
      },
      confidential_token: {
        title: t('search.categories.confidential_tokens_full', { standard: config.chain.tokenStandard }),
        tabTitle: t('search.categories.confidential_tokens'),
      },
      address: { title: t('common.addresses'), tabTitle: t('common.addresses') },
      public_tag: { title: t('search.categories.public_tags'), tabTitle: t('search.categories.public_tags') },
      transaction: { title: t('common.transactions'), tabTitle: t('common.transactions') },
      block: { title: t('common.blocks'), tabTitle: t('common.blocks') },
      tac_operation: { title: t('navigation.operations'), tabTitle: t('navigation.operations') },
      zetaChainCCTX: { title: t('search.categories.cctxs'), tabTitle: t('search.categories.cctxs') },
      user_operation: { title: t('navigation.user_operations'), tabTitle: t('search.categories.user_ops') },
      blob: { title: t('search.categories.blobs'), tabTitle: t('search.categories.blobs') },
      domain: { title: t('search.categories.names'), tabTitle: t('search.categories.names') },
      cluster: { title: t('search.categories.cluster_names'), tabTitle: t('search.categories.cluster') },
      app: { title: t('search.categories.apps'), tabTitle: t('search.categories.apps') },
    };

    return searchCategories.map((category) => {
      // Operator-supplied custom entity names remain configuration data; translate the default app label only.
      if (category.id === 'app' && (locale === 'en' || !/^(?:dapps|apps)$/i.test(category.title))) {
        return category;
      }
      return { ...category, ...labels[category.id] };
    });
  }, [ t, locale ]);
}
