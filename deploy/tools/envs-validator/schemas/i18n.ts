// Quat Capital, 2026-10-25: shared optional localization ENV schema for single-chain and multichain deployments.
import * as yup from 'yup';

import { I18N_BASE_PATH_PATTERN, SUPPORTED_LOCALES } from 'configs/app/i18n';

export const i18nSchema = yup.object({
  NEXT_PUBLIC_DEFAULT_LOCALE: yup.string().oneOf([ ...SUPPORTED_LOCALES ]),
  NEXT_PUBLIC_I18N_BASE_PATH: yup.string().matches(I18N_BASE_PATH_PATTERN, 'Expected a same-origin absolute path'),
});
