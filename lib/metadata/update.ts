// Modified by Quat Capital, 2026-10-27: continue runtime RU/KK/EN localization. GPL-3.0.
import type { TFunction } from 'i18next';

import type { ApiData } from './types';
import type { RouteParams } from 'nextjs/types';

import type { Route } from 'nextjs-routes';

import generate from './generate';

const JSON_LD_SCRIPT_ID = 'blockscout-product-schema';

export default function update<Pathname extends Route['pathname']>(route: RouteParams<Pathname>, apiData: ApiData<Pathname>, t?: TFunction): void {
  const { title, description, jsonLd } = generate(route, apiData, t);

  window.document.title = title;
  window.document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  window.document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
  window.document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', title);

  // Update or create JSON-LD script tag for Product schema
  if (jsonLd) {
    let scriptElement = window.document.getElementById(JSON_LD_SCRIPT_ID) as HTMLScriptElement | null;

    if (!scriptElement) {
      scriptElement = window.document.createElement('script');
      scriptElement.id = JSON_LD_SCRIPT_ID;
      scriptElement.type = 'application/ld+json';
      window.document.head.appendChild(scriptElement);
    }

    scriptElement.textContent = JSON.stringify(jsonLd);
  } else {
    // Remove JSON-LD script if it exists but schema is not needed
    const existingScript = window.document.getElementById(JSON_LD_SCRIPT_ID);
    if (existingScript) {
      existingScript.remove();
    }
  }
}
