// Modified by Quat Capital, 2026-10-26: localize shared controls, details and data feedback. GPL-3.0.
import { Text } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import config from 'configs/app';
import { useLocale } from 'lib/i18n/provider';
import type { ExternalSearchItem as ExternalSearchItemType } from 'lib/search/externalSearch';
import { Link } from 'toolkit/chakra/link';

const zetaChainFeature = config.features.zetachain;

function getIndefiniteArticle(phrase: string): 'a' | 'an' {
  const trimmed = (phrase || '').trim().toLowerCase();
  if (!trimmed) return 'a';

  return 'aeiou'.includes(trimmed[0]) ? 'an' : 'a';
}

interface Props {
  item: ExternalSearchItemType;
}

const ExternalSearchItem = ({ item }: Props) => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  if (!zetaChainFeature.isEnabled || !item) {
    return null;
  }

  const url = item.url;

  return (
    <>
      <Text color="text.secondary">
        { t('sharedUi.external_search', { name: locale === 'en' ? `${ getIndefiniteArticle(item.name) } ${ item.name }` : item.name }) }
      </Text>
      <Link href={ url } external mt={ 4 }>
        { t('sharedUi.external_search_redirect') }
      </Link>
    </>
  );
};

export default React.memo(ExternalSearchItem);
