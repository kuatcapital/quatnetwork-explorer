// Modified by Quat Capital, 2026-10-25: localize block controls and utilization descriptions. GPL-3.0.
import { Flex, Box, Text } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { PaginationParams } from 'ui/shared/pagination/types';

import { route } from 'nextjs-routes';

import useApiQuery from 'lib/api/useApiQuery';
import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import getNetworkUtilizationParams from 'lib/networks/getNetworkUtilizationParams';
import { HOMEPAGE_STATS } from 'stubs/stats';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import { nbsp } from 'toolkit/utils/htmlEntities';
import IconSvg from 'ui/shared/IconSvg';
import Pagination from 'ui/shared/pagination/Pagination';

interface Props {
  pagination: PaginationParams | null;
}

const BlocksTabSlot = ({ pagination }: Props) => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const statsQuery = useApiQuery('general:stats', {
    queryOptions: {
      placeholderData: HOMEPAGE_STATS,
    },
  });

  const networkUtilization = getNetworkUtilizationParams(statsQuery.data?.network_utilization_percentage ?? 0);
  const loadLabels: Readonly<Record<string, string>> = {
    low: t('home.load_low'),
    medium: t('home.load_medium'),
    high: t('home.load_high'),
  };

  return (
    <Flex alignItems="center" columnGap={ 8 } display={{ base: 'none', lg: 'flex' }}>
      { statsQuery.data?.network_utilization_percentage !== undefined && (
        <Box>
          <Text as="span" fontSize="sm">
            { t('blocks.network_utilization') }{ nbsp }
          </Text>
          <Tooltip content={ loadLabels[networkUtilization.load] || t('home.load_medium') }>
            <Skeleton display="inline-block" fontSize="sm" color={ networkUtilization.color } fontWeight={ 600 } loading={ statsQuery.isPlaceholderData }>
              <span>
                { formatNumber(statsQuery.data.network_utilization_percentage, locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }%
              </span>
            </Skeleton>
          </Tooltip>
        </Box>
      ) }
      <Link href={ route({ pathname: '/block/countdown' }) }>
        <IconSvg name="hourglass" boxSize={ 5 } mr={ 2 }/>
        <span>{ t('blocks.countdown') }</span>
      </Link>
      { pagination && <Pagination my={ 1 } { ...pagination }/> }
    </Flex>
  );
};

export default BlocksTabSlot;
