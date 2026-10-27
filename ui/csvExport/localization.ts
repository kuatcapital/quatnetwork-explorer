// Modified by Quat Capital, 2026-10-27: localized CSV descriptions and actionable download errors. GPL-3.0.
import type { TFunction } from 'i18next';

import type { CsvExportParams } from 'types/client/address';

import getErrorCauseStatusCode from 'lib/errors/getErrorCauseStatusCode';

export function getCsvExportDescriptionKey(type: CsvExportParams['type']): string {
  switch (type) {
    case 'transactions': return 'csvExportUi.transactions_description';
    case 'internal-transactions': return 'csvExportUi.internal_transactions_description';
    case 'token-transfers': return 'csvExportUi.token_transfers_description';
    case 'logs': return 'csvExportUi.logs_description';
    case 'holders': return 'csvExportUi.holders_address_description';
    case 'epoch-rewards': return 'csvExportUi.epoch_rewards_description';
  }
}

export function getCsvExportErrorText(error: unknown, t: TFunction): string {
  if (error instanceof Error) {
    switch (error.message) {
      case 'ReCaptcha is disabled in private mode': return t('csvExportUi.captcha_disabled');
      case 'Unable to execute ReCaptcha': return t('csvExportUi.captcha_execute');
      case 'ReCaptcha is not solved': return t('csvExportUi.captcha_unsolved');
    }
    switch (getErrorCauseStatusCode(error)) {
      case 400: return t('csvExportUi.invalid_request');
      case 401:
      case 403: return t('csvExportUi.access_denied');
      case 404: return t('csvExportUi.not_found');
      case 429: return t('csvExportUi.rate_limited');
    }
  }
  return t('csvExportUi.request_error');
}
