// Modified by Quat Capital, 2026-10-27: stable shell ids, exact formatting and runtime locale regressions. GPL-3.0.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Trans } from 'react-i18next';

import type { Locale } from 'configs/app/i18n';
import { getNumberSeparators } from 'lib/format/localeNumbers';
import type { Dictionary } from 'lib/i18n/config';
import { createI18n } from 'lib/i18n/config';
import { describe, expect, it } from 'vitest';

import { formatHeaderPercentage, formatHeaderPrice, getIndexingBlocksText, localizeNetworkGroup, localizeThemeLabel } from './localization';

const resources = JSON.parse(
  readFileSync(path.join(process.cwd(), 'tools/i18n/shell-remainder-translations.json'), 'utf8'),
) as Record<Locale, Dictionary>;

describe('runtime explorer shell', () => {
  it('changes theme labels without changing theme ids or modifying source settings', () => {
    const source = Object.freeze({ id: 'midnight' as const, label: 'Midnight', colorMode: 'dark' });
    const instance = createI18n({ locale: 'ru', resources, error: false });
    expect(localizeThemeLabel(source.id, source.label, instance.getFixedT('ru'))).toBe('Полуночная');
    expect(localizeThemeLabel(source.id, source.label, instance.getFixedT('kk'))).toBe('Түнгі');
    expect(localizeThemeLabel(source.id, source.label, instance.getFixedT('en'))).toBe('Midnight');
    expect(source).toEqual({ id: 'midnight', label: 'Midnight', colorMode: 'dark' });
  });

  it('localizes network group labels and retains unknown operator data', () => {
    const instance = createI18n({ locale: 'ru', resources, error: false });
    const groups = Object.freeze([ 'Mainnets', 'Testnets', 'Other' ]);
    expect(groups.map(group => localizeNetworkGroup(group, instance.getFixedT('ru')))).toEqual([ 'Основные сети', 'Тестовые сети', 'Другие' ]);
    expect(groups.map(group => localizeNetworkGroup(group, instance.getFixedT('kk')))).toEqual([ 'Негізгі желілер', 'Сынақ желілері', 'Басқа' ]);
    expect(groups.map(group => localizeNetworkGroup(group, instance.getFixedT('en')))).toEqual(groups);
    for (const value of [ 'Custom group', '__proto__', 'constructor' ]) {
      expect(localizeNetworkGroup(value, instance.t)).toBe(value);
    }
  });

  it('renders complete indexing warnings including zero progress without binary float rounding', () => {
    const instance = createI18n({ locale: 'en', resources, error: false });
    expect(getIndexingBlocksText('0.58', 'en', instance.getFixedT('en'))).toContain('58% Blocks Indexed');
    expect(getIndexingBlocksText('0', 'ru', instance.getFixedT('ru'))).toContain('0% блоков');
    expect(getIndexingBlocksText('0.99999', 'kk', instance.getFixedT('kk'))).toContain('99%');
    for (const ratio of [ undefined, '', 'not a number', 'Infinity' ]) {
      expect(getIndexingBlocksText(ratio, 'ru', instance.getFixedT('ru'))).toBe(instance.t('shellUi.indexing_blocks', { lng: 'ru' }));
    }
  });

  it('preserves exact API prices and locale separators while matching header decimal limits', () => {
    expect(formatHeaderPrice('1', 'en')).toBe('1.00');
    expect(formatHeaderPrice('1.2345678', 'en')).toBe('1.234568');
    expect(formatHeaderPrice('0.99999999', 'en')).toBe('1.00');
    expect(formatHeaderPercentage(-6.22, 'en')).toBe('-6.22');
    expect(formatHeaderPrice('9007199254740993123.1234567', 'en')).toBe('9,007,199,254,740,993,123.123457');
    for (const locale of [ 'ru', 'kk' ] as const) {
      const { group, decimal } = getNumberSeparators(locale);
      expect(formatHeaderPrice('12345.1234567', locale)).toBe(`12${ group }345${ decimal }123457`);
      expect(formatHeaderPercentage('-12.5', locale)).toBe(`-12${ decimal }50`);
    }
  });

  it('preserves the external explanation link and safely embeds navigation names', () => {
    const instance = createI18n({ locale: 'ru', resources, error: false });
    for (const locale of [ 'en', 'ru', 'kk' ] as const) {
      const t = instance.getFixedT(locale);
      const markup = renderToStaticMarkup(
        <Trans t={ t } i18nKey="shellUi.rollup_stage_hint" components={{ link: <a href="https://l2beat.com">l2beat.com</a> }}/>,
      );
      expect(markup).toContain('<a href="https://l2beat.com">l2beat.com</a>');
      expect(markup).not.toContain('shellUi.');
      const name = 'Custom <script>alert(1)</script> {{name}}';
      const link = renderToStaticMarkup(<a aria-label={ t('shellUi.navigation_link', { text: name }) } href="https://example.test/">Name</a>);
      expect(link).not.toContain('<script>');
      expect(link).toContain('&lt;script&gt;');
      expect(link).toContain('{{name}}');
    }
  });
});
