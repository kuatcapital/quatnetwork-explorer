// Modified by Quat Capital, 2026-10-27: SSR and client metadata follow runtime locale. GPL-3.0.
import Head from 'next/head';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { Route } from 'nextjs-routes';
import type { Props as PageProps } from 'nextjs/getServerSideProps/handlers';

import config from 'configs/app';
import * as metadata from 'lib/metadata';

interface Props<Pathname extends Route['pathname']> {
  pathname: Pathname;
  query?: PageProps<Pathname>['query'];
  apiData?: PageProps<Pathname>['apiData'];
}

const PageMetadata = <Pathname extends Route['pathname']>(props: Props<Pathname>) => {
  const { t } = useTranslation();
  const { title, description, opengraph, canonical } = metadata.generate(props, props.apiData, t);

  return (
    <Head>
      <title>{ title }</title>
      <meta name="description" content={ description }/>
      { canonical && <link rel="canonical" href={ canonical }/> }

      { /* OG TAGS */ }
      <meta property="og:title" content={ opengraph.title }/>
      { opengraph.description && <meta property="og:description" content={ opengraph.description }/> }
      <meta property="og:image" content={ opengraph.imageUrl }/>
      <meta property="og:type" content="website"/>

      { /* Twitter Meta Tags */ }
      <meta name="twitter:card" content="summary_large_image"/>
      <meta property="twitter:domain" content={ config.app.host }/>
      <meta name="twitter:title" content={ opengraph.title }/>
      { opengraph.description && <meta name="twitter:description" content={ opengraph.description }/> }
      <meta property="twitter:image" content={ opengraph.imageUrl }/>

      { /* Prevent auto zoom in inputs on mobile */ }
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
    </Head>
  );
};

export default PageMetadata;
