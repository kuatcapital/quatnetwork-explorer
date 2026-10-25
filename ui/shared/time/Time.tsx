// Modified by Quat Capital, 2026-10-25: format dates with the current request/UI locale. GPL-3.0.
import type { BoxProps } from '@chakra-ui/react';
import { chakra } from '@chakra-ui/react';
import React from 'react';

import { useSettingsContext } from 'lib/contexts/settings';
import dayjs, { FORMATS } from 'lib/date/dayjs';
import { useLocale } from 'lib/i18n/provider';

interface Props extends BoxProps {
  timestamp: string | number;
  format?: string;
}

const Time = ({ timestamp, format = 'lll', ...rest }: Props) => {
  const { locale } = useLocale();
  const settings = useSettingsContext();
  const formatStr = FORMATS[format as keyof typeof FORMATS] || format;
  return <chakra.span { ...rest }>{ dayjs(timestamp).locale(locale).utc(settings?.isLocalTime).format(formatStr) }</chakra.span>;
};

export default React.memo(Time);
