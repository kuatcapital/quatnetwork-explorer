// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import { chakra } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { CsvExportParams } from 'types/client/address';
import type { ClusterChainConfig } from 'types/multichain';

import { route } from 'nextjs/routes';

import config from 'configs/app';
import { useMultichainContext } from 'lib/contexts/multichain';
import useIsInitialLoading from 'lib/hooks/useIsInitialLoading';
import useIsMobile from 'lib/hooks/useIsMobile';
import { Link } from 'toolkit/chakra/link';
import { Tooltip } from 'toolkit/chakra/tooltip';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  address: string;
  params: CsvExportParams;
  className?: string;
  isLoading?: boolean;
  chainData?: ClusterChainConfig;
}

const AddressCsvExportLink = ({ className, address, params, isLoading, chainData }: Props) => {
  const { t: tQuat } = useTranslation();

  const isMobile = useIsMobile();
  const isInitialLoading = useIsInitialLoading(isLoading);
  const multichainContext = useMultichainContext();

  const chainConfig = chainData?.app_config || multichainContext?.chain.app_config || config;

  if (!chainConfig.features.csvExport.isEnabled) {
    return null;
  }

  return (
    <Tooltip disabled={ !isMobile } content={ tQuat('addresses.download_csv') }>
      <Link
        className={ className }
        whiteSpace="nowrap"
        href={ route({ pathname: '/csv-export', query: { ...params, address } }, { chain: chainData ?? multichainContext?.chain }) }
        flexShrink={ 0 }
        loading={ isInitialLoading }
        minW={ 8 }
        justifyContent="center"
        textStyle="sm"
      >
        <IconSvg name="files/csv" boxSize={ 5 }/>
        <chakra.span ml={ 1 } hideBelow="lg">{ tQuat('common.download') }</chakra.span>
      </Link>
    </Tooltip>
  );
};

export default React.memo(chakra(AddressCsvExportLink));
