// Modified by Quat Capital, 2026-10-27: complete runtime multichain localization. GPL-3.0.
import { BigNumber } from 'bignumber.js';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { ClustersLeaderboardObject } from 'types/api/clusters';

import { formatBigNumber, formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import ClustersEntity from 'ui/shared/entities/clusters/ClustersEntity';

interface Props {
  item: ClustersLeaderboardObject;
  isLoading?: boolean;
}

const ClustersLeaderboardTableItem = ({ item, isLoading }: Props) => {
  const { locale } = useLocale();

  const { t: tQuat } = useTranslation();

  return (
    <TableRow>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading }>
          #{ formatNumber(item.rank, locale) }
        </Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle">
        <ClustersEntity clusterName={ item.name } isLoading={ isLoading } fontWeight={ 600 }/>
      </TableCell>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading }>
          { formatBigNumber(BigNumber(item.nameCount), locale) }
        </Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading }>
          { formatBigNumber(BigNumber(item.totalWeiAmount).shiftedBy(-18), locale, 2) } ETH
        </Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading }>
          { tQuat('multiUi.chains_count', { count: item.chainIds.length, value: formatNumber(item.chainIds.length, locale) }) }
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(ClustersLeaderboardTableItem);
