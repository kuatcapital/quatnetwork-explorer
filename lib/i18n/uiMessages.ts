// Modified by Quat Capital, 2026-10-29: translate tagged own failures while preserving SDK/API messages. GPL-3.0.
import type { TFunction } from 'i18next';

import getErrorMessage from 'lib/errors/getErrorMessage';

type OwnMessageKey = 'contracts.unexpected_error';
type FallbackKey = OwnMessageKey | 'contracts.try_later';

export class OwnUiMessageError extends Error {
  constructor(readonly translationKey: OwnMessageKey, message: string) {
    super(message);
  }
}

export function getUiErrorMessage(error: unknown, t: TFunction, fallbackKey: FallbackKey = 'contracts.unexpected_error'): string {
  if (error instanceof OwnUiMessageError) return t(error.translationKey);
  return getErrorMessage(error) || t(fallbackKey);
}
