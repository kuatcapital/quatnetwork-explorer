// Modified by Quat Capital, 2026-10-26: format dates with the selected language and time zone. GPL-3.0.
import type { BoxProps } from '@chakra-ui/react';
import { chakra } from '@chakra-ui/react';
import React from 'react';

import { useSettingsContext } from 'lib/contexts/settings';
import { FORMATS } from 'lib/date/dayjs';
import { timestampDate } from 'lib/date/timestamp';
import { useLocale } from 'lib/i18n/provider';

interface Props extends BoxProps {
  timestamp: string | number;
  format?: string;
}

const Time = ({ timestamp, format = 'lll', ...rest }: Props) => {
  const { locale } = useLocale();
  const settings = useSettingsContext();
  const formatStr = FORMATS[format as keyof typeof FORMATS] || format;
  return <chakra.span { ...rest }>{ timestampDate(timestamp, locale, settings?.isLocalTime).format(formatStr) }</chakra.span>;
};

export default React.memo(Time);
