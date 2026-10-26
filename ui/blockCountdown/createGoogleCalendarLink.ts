// Modified by Quat Capital, 2026-10-26: runtime locale for block and statistics UI. GPL-3.0.
import type { TFunction } from 'i18next';

import { route } from 'nextjs/routes';

import config from 'configs/app';
import type { TMultichainContext } from 'lib/contexts/multichain';
import dayjs from 'lib/date/dayjs';

interface Params {
  timeFromNow: number;
  blockHeight: string;
  t: TFunction;
  multichainContext?: TMultichainContext | null;
}

const DATE_FORMAT = 'YYYYMMDDTHHmm';

export default function createGoogleCalendarLink({ timeFromNow, blockHeight, multichainContext, t }: Params): string {

  const chainConfig = multichainContext?.chain.app_config || config;

  const date = dayjs().add(timeFromNow, 's');
  const name = t('blockCountdown.reminder', { height: blockHeight, chain: chainConfig.chain.name });
  const description = t('blockCountdown.calendar_description', { height: blockHeight, chain: chainConfig.chain.name });
  const startTime = date.format(DATE_FORMAT);
  const endTime = date.add(15, 'minutes').format(DATE_FORMAT);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const blockUrl = config.app.baseUrl + route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: blockHeight } }, multichainContext);

  const url = new URL('calendar/render', 'https://www.google.com/');
  url.searchParams.append('action', 'TEMPLATE');
  url.searchParams.append('text', name);
  url.searchParams.append('details', description + '\n' + blockUrl);
  url.searchParams.append('dates', `${ startTime }/${ endTime }`);
  url.searchParams.append('ctz', timeZone);

  return url.toString();
}
