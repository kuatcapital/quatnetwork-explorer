// Modified by Quat Capital, 2026-10-26: localized sort labels with unchanged sort values. GPL-3.0.
import type { TFunction } from 'i18next';
import type { NextRouter } from 'next/router';

import config from 'configs/app';
import getQueryParamString from 'lib/router/getQueryParamString';
import removeQueryParam from 'lib/router/removeQueryParam';
import type { SelectOption } from 'toolkit/chakra/select';

const feature = config.features.marketplace;

export type SortValue = 'default' | 'rating_score' | 'rating_count';

export function getSortOptions(t: TFunction): Array<SelectOption<SortValue>> {
  return [
    { label: t('marketplaceUI.default_sort'), value: 'default' },
    (feature.isEnabled && 'api' in feature) && { label: t('marketplaceUI.top_rated'), value: 'rating_score' },
    (feature.isEnabled && 'api' in feature) && { label: t('marketplaceUI.most_rated'), value: 'rating_count' },
  ].filter(Boolean) as Array<SelectOption<SortValue>>;
}

export function getAppUrl(url: string | undefined, router: NextRouter) {
  if (!url) {
    return;
  }

  try {
    // get the custom url from the query
    const customUrl = getQueryParamString(router.query.url);

    if (customUrl) {
      const customOrigin = new URL(customUrl).origin;
      const appOrigin = new URL(url).origin;
      if (customOrigin === appOrigin) {
        return customUrl;
      } else {
        removeQueryParam(router, 'url');
      }
    }
  } catch (err) {}

  try {
    // get hash and params (using asPath to avoid conflicts with dynamic route params)
    const [ , queryAndHash ] = router.asPath.split('?');
    const [ queryString, hash ] = queryAndHash ? queryAndHash.split('#') : [ '', '' ];
    const customHash = hash ? `#${ hash }` : '';
    const customParams = new URLSearchParams(queryString);

    // remove reserved params
    [ 'url', 'action' ].forEach((param) => customParams.delete(param));

    if (customParams.toString() || customHash) {
      const targetUrl = new URL(url);
      const targetParams = new URLSearchParams(targetUrl.search);

      let customPath = customParams.get('path');
      if (customPath) {
        customPath = customPath.startsWith('/') ? customPath : `/${ customPath }`;
        targetUrl.pathname = customPath;
        customParams.delete('path');
      }

      customParams.forEach((value, key) => {
        targetParams.append(key, value);
      });

      targetUrl.search = targetParams.toString();
      targetUrl.hash = customHash;
      return targetUrl.toString();
    }
  } catch (err) {}

  return url;
}
