// Modified by Quat Capital, 2026-10-27: runtime feature labels and real socket-message plural regressions. GPL-3.0.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Trans } from 'react-i18next';

import type { Locale } from 'configs/app/i18n';
import type { Dictionary } from 'lib/i18n/config';
import { createI18n, parseDictionary } from 'lib/i18n/config';
import { describe, expect, it } from 'vitest';

import { getFlashblockText } from './localization';

const resources: Partial<Record<Locale, Dictionary>> = {};
for (const locale of [ 'en', 'ru', 'kk' ] as const) {
  resources[locale] = parseDictionary(readFileSync(path.join(process.cwd(), 'locales', `${ locale }.json`), 'utf8'));
}

describe('flashblock runtime labels', () => {
  it('preserves both original English feature labels and complete descriptions', () => {
    const instance = createI18n({ locale: 'en', resources, error: false });
    for (const [ type, name ] of [ [ 'optimism', 'flashblock' ], [ 'megaEth', 'mini-block' ] ] as const) {
      const text = getFlashblockText(type, instance.t);
      const title = name.charAt(0).toUpperCase() + name.slice(1);
      expect(text.title).toBe(`${ title }s`);
      expect(text.rate).toBe(`${ title }s (sec)`);
      expect(text.time).toBe(`${ title } time`);
      expect(text.hint).toBe(`Real-time ${ name }s show the latest ${ name }s with real-time updates in the chronological order. `);
    }
  });

  it('uses localized feature names in rich socket notices for all plural forms', () => {
    for (const locale of [ 'en', 'ru', 'kk' ] as const) {
      const instance = createI18n({ locale, resources, error: false });
      for (const type of [ 'optimism', 'megaEth' ] as const) {
        const text = getFlashblockText(type, instance.t);
        expect(Object.values(text).join(' ')).not.toContain('flashblockUi.');
        for (const count of [ 1, 2, 5, 21 ]) {
          const markup = renderToStaticMarkup(
            <Trans
              t={ instance.t }
              i18nKey="sharedUi.arrived_flashblocks"
              count={ count }
              values={{ name: text.name, value: String(count) }}
              components={{ records: <a href="https://example.test/blocks"/> }}
            />,
          );
          expect(markup).toContain('href="https://example.test/blocks"');
          expect(markup).toContain(String(count));
          expect(markup).not.toMatch(/\{\{|sharedUi\.|flashblockUi\./u);
          if (locale !== 'en') expect(markup).not.toContain(type === 'optimism' ? 'flashblock' : 'mini-block');
        }
      }
    }
  });
});
