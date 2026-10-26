// Modified by Quat Capital, 2026-10-26: separate language from the selected time zone. GPL-3.0.
import type { Locale } from 'configs/app/i18n';

import dayjs from './dayjs';

export function timestampDate(timestamp: string | number, locale: Locale, isLocalTime = false) {
  const date = dayjs(timestamp).locale(locale);
  // utc(true) preserves wall-clock fields by changing the instant. Select a zone instead.
  return isLocalTime ? date.local() : date.utc();
}
