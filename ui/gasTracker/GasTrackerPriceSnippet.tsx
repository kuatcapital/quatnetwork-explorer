// Modified by Quat Capital, 2026-10-26: runtime locale for block and statistics UI. GPL-3.0.
import { Box, Flex } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { GasPriceInfo, GasPrices } from 'types/api/stats';

import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { SECOND } from 'toolkit/utils/consts';
import { asymp } from 'toolkit/utils/htmlEntities';
import GasPrice from 'ui/shared/gas/GasPrice';
import type { IconName } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  type: keyof GasPrices;
  data: GasPriceInfo;
  isLoading: boolean;
}

const ICONS: Record<keyof GasPrices, IconName> = {
  fast: 'rocket_xl',
  average: 'gas_xl',
  slow: 'gas_xl',
};

const GasTrackerPriceSnippet = ({ data, type, isLoading }: Props) => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const titles = { fast: t('gasTracker.fast'), average: t('gasTracker.normal'), slow: t('gasTracker.slow') };
  const bgColors = {
    fast: 'transparent',
    average: { _light: 'gray.50', _dark: 'whiteAlpha.200' },
    slow: { _light: 'gray.50', _dark: 'whiteAlpha.200' },
  };
  const borderColor = { _light: 'gray.200', _dark: 'whiteAlpha.300' };

  return (
    <Box
      as="li"
      listStyleType="none"
      px={ 9 }
      py={ 6 }
      w={{ lg: 'calc(100% / 3)' }}
      bgColor={ bgColors[type] }
      _notLast={{
        borderColor: borderColor,
        borderRightWidth: { lg: '2px' },
        borderBottomWidth: { base: '2px', lg: '0' },
      }}
    >
      <Skeleton loading={ isLoading } textStyle="heading.lg" w="fit-content">{ titles[type] }</Skeleton>
      <Flex columnGap={ 3 } alignItems="center" mt={ 3 }>
        <IconSvg name={ ICONS[type] } boxSize={{ base: '30px', xl: 10 }} isLoading={ isLoading } flexShrink={ 0 }/>
        <Skeleton loading={ isLoading }>
          <GasPrice data={ data } fontSize={{ base: '36px', xl: '48px' }} lineHeight="48px" fontWeight={ 600 } letterSpacing="-1px" fontFamily="heading"/>
        </Skeleton>
      </Flex>
      <Skeleton loading={ isLoading } fontSize="sm" color="text.secondary" mt={ 3 } w="fit-content">
        { data.price !== null && data.fiat_price !== null && <GasPrice data={ data } prefix={ `${ asymp } ` } unitMode="secondary"/> }
        <span> { t('gasTracker.per_transaction') }</span>
        { typeof data.time === 'number' && data.time > 0 && (
          <span> / { t('gasTracker.seconds', { value: formatNumber(data.time / SECOND, locale, { maximumFractionDigits: 1 }) }) }</span>
        ) }
      </Skeleton>
      <Skeleton loading={ isLoading } fontSize="sm" color="text.secondary" mt={ 2 } w="fit-content" whiteSpace="pre">
        { typeof data.base_fee === 'number' && (
          <span>{ t('gasTracker.base', { value: formatNumber(data.base_fee, locale, { maximumFractionDigits: 0 }) }) }</span>
        ) }
        { typeof data.base_fee === 'number' && typeof data.priority_fee === 'number' && <span> / </span> }
        { typeof data.priority_fee === 'number' && (
          <span>{ t('gasTracker.priority', { value: formatNumber(data.priority_fee, locale, { maximumFractionDigits: 0 }) }) }</span>
        ) }
      </Skeleton>
    </Box>
  );
};

export default React.memo(GasTrackerPriceSnippet);
