// Modified by Quat Capital, 2026-10-28: verify contract localization against validated runtime dictionaries. GPL-3.0.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Trans } from 'react-i18next';

import type { SmartContractProxyType } from 'types/api/contract';

import type { Locale } from 'configs/app/i18n';
import type { Dictionary } from 'lib/i18n/config';
import { createI18n, parseDictionary } from 'lib/i18n/config';
import { describe, expect, it } from 'vitest';

import { PROXY_TYPES } from './alerts/utils';
import { ContractInteractionError, getLocalizedProxyInfo, localizeContractInteractionError, localizeContractValidationError } from './localization';
import { getFieldLabel } from './methods/form/utils';

const resources = Object.fromEntries([ 'en', 'ru', 'kk' ].map(locale => [
  locale, parseDictionary(readFileSync(path.join(process.cwd(), `locales/${ locale }.json`), 'utf8')),
])) as Record<Locale, Dictionary>;
const instance = createI18n({ locale: 'en', resources, error: false });

describe('contract interface localization', () => {
  it('translates previously stored validation errors at render time while retaining their source values', () => {
    const original = Object.freeze({ type: 'validate', message: 'Invalid address checksum' });
    expect(localizeContractValidationError(original, instance.getFixedT('en'))).toBe(original.message);
    expect(localizeContractValidationError(original, instance.getFixedT('ru'))).toBe('Неверная контрольная сумма адреса');
    expect(localizeContractValidationError(original, instance.getFixedT('kk'))).not.toBe(original.message);
    expect(original.message).toBe('Invalid address checksum');
    const messages = [
      'Field is required', 'Invalid address format', 'Invalid integer format',
      'Invalid boolean format. Allowed values: true, false', 'Invalid bytes format',
    ];
    for (const message of messages) {
      expect(localizeContractValidationError({ type: 'validate', message }, instance.getFixedT('en'))).toBe(message);
      expect(localizeContractValidationError({ type: 'validate', message }, instance.getFixedT('ru'))).not.toBe(message);
    }
  });

  it('retains exact integer boundaries and bytes counts in translated dynamic validation text', () => {
    const bounds = { type: 'validate', message: 'Value should be in range from "-1 * 2 ^ 255" to "2 ^ 255 - 1" inclusively' };
    const bytes = { type: 'validate', message: 'Value should be 32 bytes in length' };
    for (const locale of [ 'en', 'ru', 'kk' ]) {
      const t = instance.getFixedT(locale);
      expect(localizeContractValidationError(bounds, t)).toContain('-1 * 2 ^ 255');
      expect(localizeContractValidationError(bounds, t)).toContain('2 ^ 255 - 1');
      expect(localizeContractValidationError(bytes, t)).toContain('32');
    }
    expect(localizeContractValidationError(bounds, instance.getFixedT('en'))).toBe(bounds.message);
    expect(localizeContractValidationError(bytes, instance.getFixedT('en'))).toBe(bytes.message);
  });

  it('preserves manually assigned, backend and unknown errors even when their text resembles a client error', () => {
    const t = instance.getFixedT('ru');
    for (const type of [ 'server', 'manual', 'custom' ]) {
      expect(localizeContractValidationError({ type, message: 'Invalid address format' }, t)).toBe('Invalid address format');
    }
    expect(localizeContractValidationError({ type: 'validate', message: 'Unknown validation payload' }, t)).toBe('Unknown validation payload');
    expect(localizeContractValidationError(undefined, t)).toBeUndefined();
    const backendError = Object.assign(new Error('Wallet is not connected'), { shortMessage: 'Original backend shortMessage' });
    expect(localizeContractInteractionError(backendError, t)).toBe('Original backend shortMessage');
    expect(localizeContractInteractionError(new Error('Wallet is not connected'), t)).toBe('Wallet is not connected');
  });

  it('localizes only tagged interaction errors without mutating stored errors or call strategy values', () => {
    const error = new ContractInteractionError('wallet_not_connected');
    expect(localizeContractInteractionError(error, instance.getFixedT('en'))).toBe('Wallet is not connected');
    expect(localizeContractInteractionError(error, instance.getFixedT('ru'))).toBe('Кошелёк не подключён');
    expect(localizeContractInteractionError(error, instance.getFixedT('kk'))).not.toBe(error.message);
    expect(error.message).toBe('Wallet is not connected');
    for (const key of [ 'method_name_missing', 'public_client_missing' ] as const) {
      const tagged = new ContractInteractionError(key);
      expect(localizeContractInteractionError(tagged, instance.getFixedT('en'))).toBe(tagged.message);
      for (const locale of [ 'ru', 'kk' ]) {
        const text = localizeContractInteractionError(tagged, instance.getFixedT(locale));
        expect(text).not.toBe(tagged.message);
        expect(text).not.toContain('contracts.');
      }
    }
    const strategy = 'custom_{{value}}';
    const unknown = new ContractInteractionError('unknown_strategy', { strategy });
    for (const locale of [ 'en', 'ru', 'kk' ]) {
      expect(localizeContractInteractionError(unknown, instance.getFixedT(locale))).toContain(strategy);
    }
    expect(unknown.message).toBe('Unknown call strategy "custom_{{value}}"');
  });

  it('uses stable proxy ids and URLs, preserves original English and does not mutate the protocol catalogue', () => {
    const snapshot = JSON.stringify(PROXY_TYPES);
    for (const type of Object.keys(PROXY_TYPES) as Array<NonNullable<SmartContractProxyType>>) {
      expect(getLocalizedProxyInfo(type, instance.getFixedT('en'))).toEqual(PROXY_TYPES[type]);
      for (const locale of [ 'ru', 'kk' ]) {
        expect(getLocalizedProxyInfo(type, instance.getFixedT(locale))?.link).toBe(PROXY_TYPES[type]?.link);
      }
    }
    expect(getLocalizedProxyInfo('eip1967', instance.getFixedT('ru'))?.name).toBe('EIP-1967');
    expect(getLocalizedProxyInfo('basic_implementation', instance.getFixedT('ru'))?.description).toContain('implementation()');
    expect(getLocalizedProxyInfo('constructor' as NonNullable<SmartContractProxyType>, instance.t)).toBeUndefined();
    expect(JSON.stringify(PROXY_TYPES)).toBe(snapshot);
  });

  it('preserves ABI names/types and rich links while localizing only surrounding interface text', () => {
    const data = Object.freeze({ name: 'unchanged_{{name}}', internalType: 'uint256', type: 'uint256' });
    for (const locale of [ 'en', 'ru', 'kk' ]) {
      const t = instance.getFixedT(locale);
      expect(getFieldLabel(data, true, t)).toBe('unchanged_{{name}} (uint256)*');
      expect(getFieldLabel({ type: 'uint256' }, false, t)).toContain('(uint256)');
      const markup = renderToStaticMarkup(
        <Trans t={ t } i18nKey="contracts.unverified_twin_abi" components={{ verify: <a href="https://example.test/verify"/> }}/>,
      );
      expect(markup).toContain('href="https://example.test/verify"');
      expect(markup).not.toContain('contracts.');
      const scanner = renderToStaticMarkup(
        <Trans t={ t } i18nKey="contractRemainderUi.scan_analyzed" components={{ scanner: <strong>SolidityScan</strong> }}/>,
      );
      expect(scanner).toContain('<strong>SolidityScan</strong>');
      expect(scanner).toContain('240');
    }
  });
});
