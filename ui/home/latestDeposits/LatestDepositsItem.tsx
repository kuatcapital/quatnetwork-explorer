// Modified by Quat Capital, 2026-10-25: localized L1/L2 transaction labels (T18, GPL-3.0).
import {
  Box,
  Flex,
  Grid,
} from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import useIsMobile from 'lib/hooks/useIsMobile';
import { layerLabels } from 'lib/rollups/utils';
import { Skeleton } from 'toolkit/chakra/skeleton';
import BlockEntityL1 from 'ui/shared/entities/block/BlockEntityL1';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';

type Props = {
  l1BlockNumber: number;
  l1TxHash: string;
  l2TxHash: string | null;
  timestamp: string | null;
  isLoading?: boolean;
};

const LatestDepositsItem = ({ l1BlockNumber, l1TxHash, l2TxHash, timestamp, isLoading }: Props) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const l1BlockLink = (
    <BlockEntityL1
      number={ l1BlockNumber }
      isLoading={ isLoading }
      fontSize="sm"
      lineHeight={ 5 }
      fontWeight={ 700 }
    />
  );

  const l1TxLink = (
    <TxEntityL1
      isLoading={ isLoading }
      hash={ l1TxHash }
      fontSize="sm"
      lineHeight={ 5 }
      truncation={ isMobile ? 'constant_long' : 'dynamic' }
    />
  );

  const l2TxLink = l2TxHash ? (
    <TxEntity
      isLoading={ isLoading }
      hash={ l2TxHash }
      fontSize="sm"
      lineHeight={ 5 }
      truncation={ isMobile ? 'constant_long' : 'dynamic' }
    />
  ) : null;

  const content = (() => {
    if (isMobile) {
      return (
        <>
          <Flex justifyContent="space-between" alignItems="center" mb={ 1 }>
            { l1BlockLink }
            <TimeWithTooltip
              timestamp={ timestamp }
              timeFormat="relative"
              isLoading={ isLoading }
              color="text.secondary"
            />
          </Flex>
          <Grid gridTemplateColumns="max-content minmax(0, 1fr)" columnGap={ 2 }>
            <Skeleton loading={ isLoading } my="5px" w="fit-content">
              { t('home.layer_transaction', { layer: layerLabels.parent }) }
            </Skeleton>
            { l1TxLink }
            <Skeleton loading={ isLoading } my="3px" w="fit-content">
              { t('home.layer_transaction', { layer: layerLabels.current }) }
            </Skeleton>
            { l2TxLink }
          </Grid>
        </>
      );
    }

    return (
      <Grid width="100%" columnGap={ 4 } rowGap={ 2 } templateColumns="max-content max-content auto" w="100%">
        { l1BlockLink }
        <Skeleton loading={ isLoading } w="fit-content" h="fit-content" my="5px">
          { t('home.layer_transaction', { layer: layerLabels.parent }) }
        </Skeleton>
        { l1TxLink }
        <TimeWithTooltip
          timestamp={ timestamp }
          timeFormat="relative"
          isLoading={ isLoading }
          color="text.secondary"
          w="fit-content"
          h="fit-content"
          my="2px"
        />
        <Skeleton loading={ isLoading } w="fit-content" h="fit-content" my="2px">
          { t('home.layer_transaction', { layer: layerLabels.current }) }
        </Skeleton>
        { l2TxLink }
      </Grid>
    );
  })();

  return (
    <Box
      width="100%"
      borderTop="1px solid"
      borderColor="border.divider"
      py={ 4 }
      px={{ base: 0, lg: 4 }}
      _last={{ borderBottom: '1px solid', borderColor: 'border.divider' }}
      fontSize="sm"
      lineHeight={ 5 }
    >
      { content }
    </Box>
  );
};

export default React.memo(LatestDepositsItem);
