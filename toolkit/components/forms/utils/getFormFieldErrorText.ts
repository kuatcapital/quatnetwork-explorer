// Modified by Quat Capital, 2026-10-26: localize known client validation messages at render time. GPL-3.0.
import type { TFunction } from 'i18next';
import type { FieldError } from 'react-hook-form';

const CLIENT_MESSAGES: Record<string, string> = {
  'Invalid format': 'toolkit.invalid_format',
  'Incorrect address format': 'toolkit.invalid_address',
  'Invalid length': 'toolkit.invalid_length',
  'Invalid hex code': 'toolkit.invalid_hex',
  'Invalid email': 'toolkit.invalid_email',
  'Should contain text': 'toolkit.text_required',
  'Incorrect URL': 'toolkit.invalid_url',
  'Incorrect domain': 'toolkit.invalid_domain',
  'Unable to load image': 'toolkit.image_error',
};

export function getFormFieldErrorText(error: FieldError | undefined, t: TFunction) {
  if (error?.type === 'server' || error?.type === 'manual') return error.message;

  if (!error?.message && error?.type === 'pattern') {
    return t('toolkit.invalid_format');
  }

  const key = error?.message && Object.hasOwn(CLIENT_MESSAGES, error.message) ? CLIENT_MESSAGES[error.message] : undefined;
  return key ? t(key) : error?.message;
}
