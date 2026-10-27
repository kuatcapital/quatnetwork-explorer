// Modified by Quat Capital, 2026-10-28: verify address and transaction localization against runtime dictionaries. GPL-3.0.
import BigNumber from 'bignumber.js';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { I18nextProvider, Trans } from 'react-i18next';

import type { NovesResponseData } from 'types/api/noves';
import type { Transaction } from 'types/api/transaction';

import type { Locale } from 'configs/app/i18n';
import dayjs from 'lib/date/dayjs';
import type { Dictionary } from 'lib/i18n/config';
import { createI18n, parseDictionary } from 'lib/i18n/config';
import { generateFlowViewData } from 'ui/tx/assetFlows/utils/generateFlowViewData';
import TxDetailsTxFee from 'ui/tx/details/TxDetailsTxFee';
import { describe, expect, it, vi } from 'vitest';

import FilecoinActorTag from './filecoin/FilecoinActorTag';
import { formatAddressUsd, formatAddressWidgetValue, getAddressCountOptions } from './localization';

vi.mock('configs/app', () => ({ 'default': { UI: { views: { tx: { groupedFees: false } } } } }));
/* eslint-disable @typescript-eslint/naming-convention -- module export names in component mocks */
vi.mock('toolkit/chakra/badge', () => ({ Badge: ({ children }: { children: React.ReactNode }) => <span>{ children }</span> }));
vi.mock('ui/shared/DetailedInfo/DetailedInfo', () => ({
  ItemLabel: ({ children, hint }: { children: React.ReactNode; hint: string }) => <span title={ hint }>{ children }</span>,
  ItemValue: ({ children }: { children: React.ReactNode }) => <div>{ children }</div>,
}));
vi.mock('ui/shared/DetailedInfo/DetailedInfoItemBreakdown', () => ({ Container: () => null, Row: () => null }));
vi.mock('ui/shared/tx/TxFee', () => ({ 'default': ({ tx }: { tx: Transaction }) => <span data-raw-fee={ tx.fee.value }/> }));
vi.mock('ui/shared/value/NativeCoinValue', () => ({ 'default': () => null }));
/* eslint-enable @typescript-eslint/naming-convention */

const locales = [ 'en', 'ru', 'kk' ] as const;
const resources = Object.fromEntries(locales.map(locale => [
  locale, parseDictionary(readFileSync(path.join(process.cwd(), `locales/${ locale }.json`), 'utf8')),
])) as Record<Locale, Dictionary>;

describe('address and transaction remainder localization', () => {
  it('selects count grammar while preserving every digit of large API counts', () => {
    const instance = createI18n({ locale: 'ru', resources, error: false });
    const forms = [ '1 элемент', '2 элемента', '5 элементов', '21 элемент', '1\u00a0234 элемента' ];
    [ 1, 2, 5, 21, 1234 ].forEach((count, index) => {
      expect(instance.t('addressTxUi.collection_items', getAddressCountOptions(count, 'ru'))).toBe(forms[index]);
    });
    const large = '9007199254741001';
    expect(instance.t('addressTxUi.collection_items', getAddressCountOptions(large, 'ru')))
      .toBe('9\u00a0007\u00a0199\u00a0254\u00a0741\u00a0001 элемент');
    expect(instance.getFixedT('en')('addressTxUi.token_total', getAddressCountOptions(large, 'en')))
      .toBe('9,007,199,254,741,001 tokens');
    expect(instance.getFixedT('kk')('addressTxUi.token_total', getAddressCountOptions(large, 'kk')))
      .toBe('9\u00a0007\u00a0199\u00a0254\u00a0741\u00a0001 токен');
  });

  it('keeps named MUD table content emphasized and escaped in every locale', () => {
    for (const locale of locales) {
      const instance = createI18n({ locale, resources, error: false });
      const markup = renderToStaticMarkup(
        <Trans
          t={ instance.t }
          i18nKey="addressTxUi.no_table_records"
          components={{ table: <strong>{ '<script>schema.Table</script>' }</strong> }}
        />,
      );
      expect(markup).toContain('<strong>&lt;script&gt;schema.Table&lt;/script&gt;</strong>');
      expect(markup).not.toContain('<script>');
      expect(markup).not.toContain('addressTxUi.');
      expect(markup).not.toContain('{{');
    }
  });

  it('renders all Filecoin actor labels without changing API actor identifiers', () => {
    const types = [ 'account', 'cron', 'datacap', 'eam', 'ethaccount', 'evm', 'init', 'market',
      'miner', 'multisig', 'paych', 'placeholder', 'power', 'reward', 'system', 'verifreg' ] as const;
    for (const locale of locales) {
      const instance = createI18n({ locale, resources, error: false });
      for (const actorType of types) {
        const markup = renderToStaticMarkup(
          <I18nextProvider i18n={ instance }><FilecoinActorTag actorType={ actorType }/></I18nextProvider>,
        );
        expect(markup).toBe(`<span>${ instance.t(`addressTxUi.actor_${ actorType }`) }</span>`);
        expect(markup).not.toContain('addressTxUi.');
      }
    }
  });

  it('renders blob and ordinary fee hints using the active language and keeps the raw fee', async() => {
    const instance = createI18n({ locale: 'en', resources, error: false });
    for (const locale of locales) {
      await instance.changeLanguage(locale);
      for (const blobGas of [ null, '131072' ]) {
        const data = { blob_gas_used: blobGas, fee: { value: '9007199254741001001' } } as unknown as Transaction;
        const markup = renderToStaticMarkup(
          <I18nextProvider i18n={ instance }><TxDetailsTxFee isLoading={ false } data={ data }/></I18nextProvider>,
        );
        const key = blobGas ? 'addressTxUi.fee_without_blobs_hint' : 'transactions.total_fee_hint';
        expect(markup).toContain(`title="${ instance.t(key) }"`);
        expect(markup).toContain('data-raw-fee="9007199254741001001"');
        expect(markup).not.toContain('addressTxUi.');
      }
    }
  });

  it('localizes only the validator fallback and leaves the Noves response untouched', () => {
    const data = {
      accountAddress: '0xABC',
      classificationData: {
        sent: [ { action: 'paidGas', actionFormatted: 'Paid Gas', amount: '0.0001',
          from: { address: '0xABC', name: 'Wallet (this wallet)' }, to: { address: '', name: 'API name' } } ],
        received: [],
      },
    } as unknown as NovesResponseData;
    const before = structuredClone(data);
    const instance = createI18n({ locale: 'ru', resources, error: false });
    for (const locale of locales) {
      const flows = generateFlowViewData(data, instance.getFixedT(locale));
      expect(flows[0].rightActor.name).toBe(instance.getFixedT(locale)('common.validators'));
      expect(flows[0].action.label).toBe('Paid Gas');
      expect(flows[0].action.amount).toBe('0.0001');
      expect(data).toEqual(before);
    }
  });

  it('retains USD cents and exact integer digits with locale separators', () => {
    const value = BigNumber('9007199254741001.2');
    expect(formatAddressUsd(value, 'en')).toBe('9,007,199,254,741,001.20');
    expect(formatAddressUsd(value, 'ru')).toBe('9\u00a0007\u00a0199\u00a0254\u00a0741\u00a0001,20');
    expect(formatAddressUsd(value, 'kk')).toBe('9\u00a0007\u00a0199\u00a0254\u00a0741\u00a0001,20');
    expect(value.toFixed()).toBe('9007199254741001.2');
  });

  it('formats widget numbers precisely while retaining text, missing values and the zero sentinel', () => {
    expect(formatAddressWidgetValue('9007199254741001.25', 'ru')).toBe('9\u00a0007\u00a0199\u00a0254\u00a0741\u00a0001,25');
    expect(formatAddressWidgetValue('9007199254741001.25', 'en')).toBe('9,007,199,254,741,001.25');
    expect(formatAddressWidgetValue('API label', 'kk')).toBe('API label');
    expect(formatAddressWidgetValue(-1, 'ru')).toBe('0');
    expect(formatAddressWidgetValue(undefined, 'ru')).toBeUndefined();
    expect(formatAddressWidgetValue({ value: 2 }, 'ru')).toBeUndefined();
  });

  it('uses per-instance locale for domain expiry without changing global date state', () => {
    const initial = dayjs.locale();
    const instance = createI18n({ locale: 'en', resources, error: false });
    const phrases = locales.map(locale => instance.getFixedT(locale)('addressTxUi.domain_expiry', {
      time: dayjs('2030-01-03T00:00:00Z').locale(locale).from(dayjs('2030-01-01T00:00:00Z')),
    }));
    expect(phrases[0]).toBe('expires in 2d');
    expect(phrases[1]).toBe('истекает через 2 дня');
    expect(phrases[2]).toContain('2 күн');
    expect(dayjs.locale()).toBe(initial);
  });
});
