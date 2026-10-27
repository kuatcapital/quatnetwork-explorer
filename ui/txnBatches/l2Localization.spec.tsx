// Modified by Quat Capital, 2026-10-27: L2 rich-count and protocol-status regressions. GPL-3.0.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Trans } from 'react-i18next';

import * as tac from '@blockscout/tac-operation-lifecycle-types';

import type { Locale } from 'configs/app/i18n';
import { formatNumber } from 'lib/format/localeNumbers';
import type { Dictionary } from 'lib/i18n/config';
import { createI18n } from 'lib/i18n/config';
import { getTacOperationStage, getTacOperationStageLabel, getTacOperationStatus } from 'lib/operations/tac';
import { localizeDisputeGameStatus } from 'ui/disputeGames/optimisticL2/localizeDisputeGameStatus';
import { describe, expect, it } from 'vitest';

const resources = JSON.parse(
  readFileSync(path.join(process.cwd(), 'tools/i18n/l2-remaining-translations.json'), 'utf8'),
) as Record<Locale, Dictionary>;

describe('L2 runtime localization', () => {
  it('selects Russian count grammar using raw count while displaying a localized value', () => {
    const instance = createI18n({ locale: 'ru', resources, error: false });
    const expected = [ '1 блок', '2 блока', '5 блоков', '21 блок', '1\u00a0234 блока' ];
    [ 1, 2, 5, 21, 1234 ].forEach((count, index) => {
      expect(instance.t('l2Ui.block_total', { count, value: formatNumber(count, 'ru') })).toBe(expected[index]);
    });
  });

  it('keeps rich transaction links actionable and uses a complete phrase in each locale', () => {
    const labels = { en: '1,234 transactions', ru: '1\u00a0234 транзакции', kk: '1\u00a0234 транзакция' };
    for (const locale of [ 'en', 'ru', 'kk' ] as const) {
      const instance = createI18n({ locale, resources, error: false });
      const markup = renderToStaticMarkup(
        <Trans
          t={ instance.t }
          i18nKey="l2Ui.transactions_in_batch"
          count={ 1234 }
          values={{ value: formatNumber(1234, locale) }}
          components={{ transactions: <a href="https://example.test/batches/42?tab=txs"/> }}
        />,
      );
      expect(markup).toContain(`href="https://example.test/batches/42?tab=txs">${ labels[locale] }</a>`);
      expect(markup).not.toContain('l2Ui.');
      expect(markup).not.toContain('{{');
    }
  });

  it('renders output ranges with both emphasized ends and escapes chain labels', () => {
    const instance = createI18n({ locale: 'ru', resources, error: false });
    const markup = renderToStaticMarkup(
      <Trans
        t={ instance.t }
        i18nKey="l2Ui.output_range"
        count={ 5 }
        values={{ layer: '<script>bad()</script>', from: '5', to: '1', total: '5' }}
        components={{ from: <strong/>, to: <strong/> }}
      />,
    );
    expect(markup).toContain('<strong>№5</strong>');
    expect(markup).toContain('<strong>№1</strong>');
    expect(markup).toContain('5 корней');
    expect(markup).not.toContain('<script>');
  });

  it('changes TAC display text when locale changes without mutating protocol enums', async() => {
    const instance = createI18n({ locale: 'ru', resources, error: false });
    const stage = tac.OperationStage_StageType.COLLECTED_IN_TAC;
    expect(getTacOperationStageLabel(stage, instance.t)).toBe('Собрано в TAC');
    expect(getTacOperationStatus(tac.OperationType.PENDING, instance.t)).toBe('Ожидает');
    await instance.changeLanguage('kk');
    expect(getTacOperationStageLabel(stage, instance.t)).toBe('TAC желісінде жиналды');
    expect(getTacOperationStatus(tac.OperationType.PENDING)).toBe('Pending');
  });

  it('matches transaction hashes independently of translated lifecycle labels', () => {
    const instance = createI18n({ locale: 'ru', resources, error: false });
    const data = {
      status_history: [ { type: tac.OperationStage_StageType.EXECUTED_IN_TON, transactions: [ { hash: '0xABCD' } ] } ],
    } as unknown as tac.OperationDetails;
    const before = structuredClone(data);
    expect(getTacOperationStage(data, '0xabcd', instance.t)).toEqual([ 'Выполнено в TON' ]);
    expect(getTacOperationStage(data, '0x1234', instance.t)).toBeUndefined();
    expect(data).toEqual(before);
  });

  it('keeps future dispute status values visible without modifying the API value', () => {
    const instance = createI18n({ locale: 'ru', resources, error: false });
    expect(localizeDisputeGameStatus('In progress', instance.t)).toBe('В процессе');
    expect(localizeDisputeGameStatus('Future status', instance.t)).toBe('Future status');
  });
});
