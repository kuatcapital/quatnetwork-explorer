// Modified by Quat Capital, 2026-10-27: continue runtime RU/KK/EN localization. GPL-3.0.
import type { TFunction } from 'i18next';

import type { ApiData, Metadata } from './types';
import type { RouteParams } from 'nextjs/types';

import type { Route } from 'nextjs-routes';

import config from 'configs/app';
import getNetworkTitle from 'lib/networks/getNetworkTitle';
import { currencyUnits } from 'lib/units';

import compileValue from './compileValue';
import generateProductSchema from './generateProductSchema';
import getCanonicalUrl from './getCanonicalUrl';
import getPageOgType from './getPageOgType';
import * as templates from './templates';

export default function generate<Pathname extends Route['pathname']>(
  route: RouteParams<Pathname>, apiData: ApiData<Pathname> = null, t?: TFunction,
): Metadata {
  const idCap = route.pathname === '/essential-dapps/[id]' && typeof route.query?.id === 'string' ?
    route.query.id.charAt(0).toUpperCase() + route.query.id.slice(1) : undefined;

  const params = {
    ...route.query,
    ...apiData,
    network_name: config.chain.name,
    network_title: t ? t('metaSeo.network_title', {
      replace: { name: config.chain.name, short_name: config.chain.shortName ? ` (${ config.chain.shortName })` : '' },
    }) : getNetworkTitle(),
    network_gwei: currencyUnits.gwei,
    id_cap: idCap,
  };

  const title = t ? templates.title.make(route.pathname, Boolean(apiData), t, params) :
    compileValue(templates.title.make(route.pathname, Boolean(apiData)), params);
  const description = t ? templates.description.make(route.pathname, Boolean(apiData), t, params) :
    compileValue(templates.description.make(route.pathname, Boolean(apiData)), params);

  const pageOgType = getPageOgType(route.pathname);
  const jsonLd = generateProductSchema(route, apiData);

  return {
    title: title,
    description,
    opengraph: {
      title: title,
      description: pageOgType !== 'Regular page' ? config.meta.og.description : '',
      imageUrl: pageOgType !== 'Regular page' ? config.meta.og.imageUrl : '',
    },
    canonical: getCanonicalUrl(route.pathname),
    jsonLd,
  };
}
