// Modified by Quat Capital, 2026-10-27: localize contract display text without changing API values or validation state. GPL-3.0.
import type { TFunction } from 'i18next';
import type { FieldError } from 'react-hook-form';

import type { SmartContractProxyType } from 'types/api/contract';

import { PROXY_TYPES } from './alerts/utils';

const VALIDATION_MESSAGES: Record<string, string> = {
  'Field is required': 'contracts.field_required',
  'Invalid address format': 'contracts.invalid_address',
  'Invalid address checksum': 'contracts.invalid_checksum',
  'Invalid integer format': 'contracts.invalid_integer',
  'Invalid boolean format. Allowed values: true, false': 'contracts.invalid_boolean',
  'Invalid bytes format': 'contracts.invalid_bytes',
};

export function localizeContractValidationError(error: Pick<FieldError, 'type' | 'message'> | undefined, t: TFunction): string | undefined {
  if (!error?.message || error.type !== 'validate') return error?.message;
  const key = Object.hasOwn(VALIDATION_MESSAGES, error.message) ? VALIDATION_MESSAGES[error.message] : undefined;
  if (key) return t(key);
  const bounds = /^Value should be in range from "(.+)" to "(.+)" inclusively$/.exec(error.message);
  if (bounds) return t('contracts.integer_range', { lower: bounds[1], upper: bounds[2] });
  const bytes = /^Value should be (\d+) bytes in length$/.exec(error.message);
  if (bytes) return t('contracts.bytes_length', { length: bytes[1] });
  return error.message;
}

const INTERACTION_MESSAGES = {
  wallet_not_connected: 'Wallet is not connected',
  method_name_missing: 'Method name is not defined',
  public_client_missing: 'Public Client is not defined',
  unknown_strategy: 'Unknown call strategy',
};

export class ContractInteractionError extends Error {
  constructor(readonly translationKey: keyof typeof INTERACTION_MESSAGES, readonly values: Record<string, string> = {}) {
    super(translationKey === 'unknown_strategy' ? `Unknown call strategy "${ values.strategy }"` : INTERACTION_MESSAGES[translationKey]);
  }
}

export function localizeContractInteractionError(error: Error, t: TFunction): string {
  if (error instanceof ContractInteractionError) return t(`contracts.${ error.translationKey }`, { replace: error.values });
  return 'shortMessage' in error && typeof error.shortMessage === 'string' ? error.shortMessage : error.message;
}

export function getLocalizedProxyInfo(type: NonNullable<SmartContractProxyType>, t: TFunction) {
  const source = Object.hasOwn(PROXY_TYPES, type) ? PROXY_TYPES[type] : undefined;
  if (!source) return undefined;
  const descriptions: Partial<Record<NonNullable<SmartContractProxyType>, string>> = {
    eip1167: t('contracts.proxy_minimal'),
    eip1967: t('contracts.proxy_transparent'),
    eip1967_oz: t('contracts.proxy_legacy_oz'),
    eip1967_beacon: t('contracts.proxy_beacon'),
    eip1822: t('contracts.proxy_uups'),
    eip2535: t('contracts.proxy_diamond'),
    erc7760: t('contracts.proxy_minimal_upgradeable'),
    resolved_delegate_proxy: t('contracts.proxy_opstack'),
    basic_implementation: t('contracts.proxy_getter'),
    basic_get_implementation: t('contracts.proxy_get_implementation'),
  };
  const names: Partial<Record<NonNullable<SmartContractProxyType>, string>> = {
    clone_with_immutable_arguments: t('contracts.proxy_clone_immutable'),
    basic_implementation: t('contracts.proxy_generic'),
    basic_get_implementation: t('contracts.proxy_generic'),
    unknown: t('contracts.proxy_unknown'),
  };
  return { ...source, name: names[type] ?? source.name, description: descriptions[type] ?? source.description };
}
