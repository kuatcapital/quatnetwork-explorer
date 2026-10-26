// Modified by Quat Capital, 2026-10-26: localize shared controls, details and data feedback. GPL-3.0.
import { Box, Circle } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import type { ButtonProps } from 'toolkit/chakra/button';
import { Button } from 'toolkit/chakra/button';
import { Skeleton } from 'toolkit/chakra/skeleton';
import IconSvg from 'ui/shared/IconSvg';

interface Props extends ButtonProps {
  isLoading?: boolean;
  appliedFiltersNum?: number;
}

const FilterButton = ({ isLoading, appliedFiltersNum, ...rest }: Props, ref: React.ForwardedRef<HTMLButtonElement>) => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  if (isLoading) {
    return <Skeleton loading w={{ base: 9, lg: '78px' }} h={ 8 } borderRadius="base" flexShrink={ 0 }/>;
  }

  const numElement = appliedFiltersNum ? (
    <Circle
      className="AppliedFiltersNum"
      size={ 5 }
      bg="selected.control.text"
      color={{ _light: 'white', _dark: 'black' }}
      _groupHover={{
        bg: 'hover',
      }}
      _groupExpanded={{
        bg: 'hover',
      }}
    >
      { formatNumber(appliedFiltersNum, locale) }
    </Circle>
  ) : null;

  return (
    <Button
      ref={ ref }
      size="sm"
      fontWeight="medium"
      gap={ 1 }
      variant="dropdown"
      selected={ Boolean(appliedFiltersNum) }
      flexShrink={ 0 }
      pointerEvents="all"
      px={{ base: 1, lg: 3 }}
      { ...rest }
    >
      <IconSvg name="filter" boxSize={ 5 }/>
      <Box display={{ base: 'none', lg: 'block' }}>{ t('common.filter') }</Box>
      { numElement }
    </Button>
  );
};

export default React.forwardRef(FilterButton);
