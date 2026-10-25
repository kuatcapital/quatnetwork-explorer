// Modified by Quat Capital, 2026-10-25: locale separators and exact integer formatting. GPL-3.0.
import { chakra, Text } from '@chakra-ui/react';

import { formatNumber, getNumberSeparators } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';

type Props = {
  value: string;
  suffix?: string;
  postfix?: string;
};

export default function NumberEntity({ value, suffix, postfix }: Props) {
  const { locale } = useLocale();
  const [ integer, decimal ] = value.split('.');
  const formattedInteger = /^[+-]?\d+$/.test(integer) ? formatNumber(BigInt(integer), locale) : integer;
  return (
    <Text>
      { suffix }
      { formattedInteger }
      { decimal && getNumberSeparators(locale).decimal }
      <chakra.span color="text.secondary">{ decimal }</chakra.span>
      { postfix && ` ${ postfix }` }
    </Text>
  );
}
