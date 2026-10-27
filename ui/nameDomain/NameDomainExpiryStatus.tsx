import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
// Modified by Quat Capital, 2026-10-27: T18 reviewed literal localization. GPL-3.0.
import { chakra } from '@chakra-ui/react';
import React from 'react';

import dayjs from 'lib/date/dayjs';
import { useTranslation } from 'react-i18next';


interface Props {
  date: string | undefined;
}

const NameDomainExpiryStatus = ({ date }: Props) => {
  const { locale } = useLocale();
  const { t: tQuat } = useTranslation();

  if (!date) {
    return null;
  }

  const hasExpired = dayjs(date).isBefore(dayjs());

  if (hasExpired) {
    return <chakra.span color="red.600">{ tQuat('multiUi.expired') }</chakra.span>;
  }

  const diff = dayjs(date).diff(dayjs(), 'day');
  if (diff < 30) {
    return <chakra.span color="red.600">{ tQuat('multiUi.days_left', { count: diff, value: formatNumber(diff, locale) }) }</chakra.span>;
  }

  return <chakra.span color="text.secondary">{ tQuat('multiUi.expires_relative', { time: dayjs(date).locale(locale).fromNow() }) }</chakra.span>;
};

export default React.memo(NameDomainExpiryStatus);
