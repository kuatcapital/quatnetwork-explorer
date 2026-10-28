// Modified by Quat Capital, 2026-10-29: known statuses localize while unknown protocol values remain intact. GPL-3.0.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { I18nextProvider } from 'react-i18next';

import type { Locale } from 'configs/app/i18n';
import type { Dictionary } from 'lib/i18n/config';
import { createI18n, parseDictionary } from 'lib/i18n/config';
import { describe, expect, it, vi } from 'vitest';

import ArbitrumL2TxnBatchStatus from './ArbitrumL2TxnBatchStatus';

vi.mock('./StatusTag', () => ({ 'default': ({ type, text }: { type: string; text: string }) => <span data-status={ type }>{ text }</span> }));

const resources: Partial<Record<Locale, Dictionary>> = {};
for (const locale of [ 'ru', 'kk' ] as const) {
  resources[locale] = parseDictionary(readFileSync(path.join(process.cwd(), 'locales', `${ locale }.json`), 'utf8'));
}

describe('Arbitrum commitment status labels', () => {
  it('translates both known states without changing API status or badge meaning', () => {
    for (const locale of [ 'ru', 'kk' ] as const) {
      const instance = createI18n({ locale, resources, error: false });
      for (const status of [ 'finalized', 'unfinalized' ]) {
        const input = Object.freeze({ status });
        const markup = renderToStaticMarkup(
          <I18nextProvider i18n={ instance }><ArbitrumL2TxnBatchStatus { ...input }/></I18nextProvider>,
        );
        expect(markup).toContain(instance.t(`sharedStatus.${ status }`));
        expect(markup).toContain(`data-status="${ status === 'finalized' ? 'ok' : 'pending' }"`);
        expect(input.status).toBe(status);
      }
      const unknown = renderToStaticMarkup(
        <I18nextProvider i18n={ instance }><ArbitrumL2TxnBatchStatus status="future_protocol_status"/></I18nextProvider>,
      );
      expect(unknown).toBe('<span data-status="pending">future_protocol_status</span>');
    }
  });
});
