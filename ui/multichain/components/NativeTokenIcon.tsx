// Modified by Quat Capital, 2026-10-27: complete runtime multichain localization. GPL-3.0.
import { chakra } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { HomeStats } from 'types/api/stats';

import { Image } from 'toolkit/chakra/image';
import { Skeleton } from 'toolkit/chakra/skeleton';
import TokenLogoPlaceholder from 'ui/shared/TokenLogoPlaceholder';

import useFetchParentChainApi from '../home/useFetchParentChainApi';

interface Props {
  isLoading?: boolean;
  className?: string;
};

const NativeTokenIcon = ({ isLoading, className }: Props) => {
  const { t: tQuat } = useTranslation();

  const parentChainApiFetch = useFetchParentChainApi();
  const parentChainStatsQuery = useQuery({
    queryKey: [ 'parent_chain', 'stats' ],
    queryFn: () => parentChainApiFetch({ path: '/stats' }) as Promise<HomeStats>,
    refetchOnMount: false,
  });

  if (isLoading || parentChainStatsQuery.isFetching) {
    return <Skeleton borderRadius="base" loading className={ className }/>;
  }

  return (
    <Image
      className={ className }
      borderRadius="base"
      src={ parentChainStatsQuery.data?.coin_image || undefined }
      alt={ tQuat('multiUi.native_logo') }
      fallback={ <TokenLogoPlaceholder/> }
    />
  );
};

export default chakra(NativeTokenIcon);
