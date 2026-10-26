// Modified by Quat Capital, 2026-10-26: locale-aware tooltips with explicit UTC/local selection. GPL-3.0.
import { chakra } from '@chakra-ui/react';
import React from 'react';

import type { TimeFormat } from 'types/settings';

import { useSettingsContext } from 'lib/contexts/settings';
import { timestampDate } from 'lib/date/timestamp';
import useTimeAgoIncrement from 'lib/hooks/useTimeAgoIncrement';
import { useLocale } from 'lib/i18n/provider';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';

type Props = {
  timestamp?: string | number | null;
  fallbackText?: string;
  isLoading?: boolean;
  enableIncrement?: boolean;
  className?: string;
  timeFormat?: TimeFormat;
};

const TimeWithTooltip = ({ timestamp, fallbackText, isLoading, enableIncrement, className, timeFormat: timeFormatProp }: Props) => {
  const { locale } = useLocale();

  const settings = useSettingsContext();
  const timeFormat = timeFormatProp || settings?.timeFormat || 'relative';
  const timeAgo = useTimeAgoIncrement(timestamp || '', enableIncrement && !isLoading && timeFormat === 'relative');

  if (!timestamp && !fallbackText) {
    return null;
  }

  const content = (() => {
    if (!timestamp) {
      return fallbackText;
    }

    if (timeFormat === 'relative') {
      const content = timestampDate(timestamp, locale, settings?.isLocalTime).format('llll');
      return <Tooltip content={ content }><span>{ timeAgo }</span></Tooltip>;
    }

    return <Tooltip content={ timeAgo }><span>{ timestampDate(timestamp, locale, settings?.isLocalTime).format('lll') }</span></Tooltip>;
  })();

  return (
    <Skeleton loading={ isLoading } className={ className }>
      { content }
    </Skeleton>
  );
};

export default chakra(TimeWithTooltip);
