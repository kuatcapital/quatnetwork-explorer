// Modified by Quat Capital, 2026-10-27: CSV rich descriptions and localized download-error regressions. GPL-3.0.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Trans } from 'react-i18next';

import type { CsvExportParams } from 'types/client/address';

import type { Locale } from 'configs/app/i18n';
import { formatNumber } from 'lib/format/localeNumbers';
import type { Dictionary } from 'lib/i18n/config';
import { createI18n } from 'lib/i18n/config';
import { describe, expect, it } from 'vitest';

import { getCsvExportDescriptionKey, getCsvExportErrorText } from './localization';

const resources = JSON.parse(
  readFileSync(path.join(process.cwd(), 'tools/i18n/page-remainder-translations.json'), 'utf8'),
) as Record<Locale, Dictionary>;

describe('CSV runtime localization', () => {
  it('keeps address, filter and chain entities in all supported export descriptions', () => {
    const types: Array<CsvExportParams['type']> = [
      'transactions', 'internal-transactions', 'token-transfers', 'logs', 'holders', 'epoch-rewards',
    ];
    for (const locale of [ 'en', 'ru', 'kk' ] as const) {
      const instance = createI18n({ locale, resources, error: false });
      for (const type of types) {
        const markup = renderToStaticMarkup(
          <Trans
            t={ instance.t }
            i18nKey={ getCsvExportDescriptionKey(type) }
            components={{
              entity: <a href="https://example.test/address/0x123">0x123</a>,
              filter: <span data-part="filter">FILTER</span>,
              chain: <span data-part="chain">CHAIN</span>,
            }}
          />,
        );
        expect(markup).toContain('href="https://example.test/address/0x123">0x123</a>');
        expect(markup).toContain('data-part="filter">FILTER</span>');
        expect(markup).toContain('data-part="chain">CHAIN</span>');
        expect(markup).toContain('CSV');
        expect(markup).not.toContain('csvExportUi.');
        expect(markup).not.toContain('{{');
      }
    }
  });

  it('keeps token and chain content in the holder description', () => {
    const instance = createI18n({ locale: 'kk', resources, error: false });
    const markup = renderToStaticMarkup(
      <Trans
        t={ instance.t }
        i18nKey="csvExportUi.holders_description"
        components={{ entity: <strong>KZTT</strong>, chain: <span>Quat Network</span> }}
      />,
    );
    expect(markup).toContain('<strong>KZTT</strong>');
    expect(markup).toContain('<span>Quat Network</span>');
  });

  it('uses the selected locale for compact export limits', () => {
    for (const locale of [ 'en', 'ru', 'kk' ] as const) {
      const instance = createI18n({ locale, resources, error: false });
      const limit = formatNumber(10000, locale, { notation: 'compact' });
      const result = instance.t('csvExportUi.records_limit', { limit });
      expect(result).toContain(limit);
      expect(result).not.toContain('{{');
    }
    expect(formatNumber(10000, 'ru', { notation: 'compact' })).not.toBe(formatNumber(10000, 'en', { notation: 'compact' }));
  });

  it('shows actionable HTTP and reCAPTCHA errors using the current locale', () => {
    const instance = createI18n({ locale: 'ru', resources, error: false });
    const denied = new Error('Forbidden', { cause: { status: 403 } });
    const unsolved = new Error('ReCaptcha is not solved');
    expect(getCsvExportErrorText(denied, instance.getFixedT('ru'))).toBe('У вас нет разрешения на экспорт этих данных.');
    expect(getCsvExportErrorText(denied, instance.getFixedT('kk'))).toBe('Бұл деректерді экспорттауға рұқсатыңыз жоқ.');
    expect(getCsvExportErrorText(unsolved, instance.getFixedT('ru'))).toBe('Проверка reCaptcha не пройдена');
    expect(denied.cause).toEqual({ status: 403 });
    expect(unsolved.message).toBe('ReCaptcha is not solved');
  });

  it('uses a localized fallback for network errors and unknown failures', () => {
    const instance = createI18n({ locale: 'kk', resources, error: false });
    const expected = 'Бірдеңе дұрыс болмады. Кейінірек қайталап көріңіз.';
    expect(getCsvExportErrorText(new TypeError('Failed to fetch'), instance.t)).toBe(expected);
    expect(getCsvExportErrorText(null, instance.t)).toBe(expected);
  });
});
