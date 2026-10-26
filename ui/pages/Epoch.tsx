// Modified by Quat Capital, 2026-10-26: localize validators, epochs and transfers. GPL-3.0.
import { Box, HStack } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { useRouter } from 'next/router';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import useApiQuery from 'lib/api/useApiQuery';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import { formatBigNumber } from 'lib/format/localeNumbers';
import useIsMobile from 'lib/hooks/useIsMobile';
import { useLocale } from 'lib/i18n/provider';
import getQueryParamString from 'lib/router/getQueryParamString';
import { CELO_EPOCH } from 'stubs/epoch';
import { Tag } from 'toolkit/chakra/tag';
import { Tooltip } from 'toolkit/chakra/tooltip';
import EpochDetails from 'ui/epochs/EpochDetails';
import TextAd from 'ui/shared/ad/TextAd';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import PageTitle from 'ui/shared/Page/PageTitle';

const EpochPageContent = () => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const isMobile = useIsMobile();
  const router = useRouter();
  const number = getQueryParamString(router.query.number);

  const epochQuery = useApiQuery('general:epoch_celo', {
    pathParams: {
      number: number,
    },
    queryOptions: {
      placeholderData: CELO_EPOCH,
    },
  });

  throwOnResourceLoadError(epochQuery);

  const isLoading = epochQuery.isPlaceholderData;

  const titleContentAfter = (() => {
    switch (epochQuery.data?.type) {
      case 'L1':
        return (
          <Tooltip content={ t('networkTransfers.l1_epoch_hint') }>
            <Tag loading={ isLoading }>{ epochQuery.data.type }</Tag>
          </Tooltip>
        );
      case 'L2':
        return (
          <Tooltip content={ t('networkTransfers.l2_epoch_hint') }>
            <Tag loading={ isLoading }>{ epochQuery.data.type }</Tag>
          </Tooltip>
        );
    }

    return null;
  })();

  const titleSecondRow = (() => {
    if (!epochQuery.data || epochQuery.data?.start_block_number === null) {
      return null;
    }

    const isTruncated = isMobile && Boolean(epochQuery.data.end_block_number);
    const truncationProps = isTruncated ? { truncation: 'constant' as const, truncationMaxSymbols: 6 } : undefined;

    return (
      <HStack textStyle={{ base: 'heading.sm', lg: 'heading.md' }} flexWrap="wrap">
        <Trans
          t={ t }
          i18nKey={ epochQuery.data.end_block_number ? 'networkTransfers.epoch_range' : 'networkTransfers.epoch_from' }
          components={{
            muted: <Box color="text.secondary"/>,
            start: <BlockEntity number={ epochQuery.data.start_block_number } variant="subheading" { ...truncationProps }/>,
            end: <BlockEntity number={ epochQuery.data.end_block_number || 0 } variant="subheading" { ...truncationProps }/>,
          }}
        />
      </HStack>
    );
  })();

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle
        title={ t('networkTransfers.epoch_title', { number: /^\d+$/.test(number) ? formatBigNumber(BigNumber(number), locale) : number }) }
        contentAfter={ titleContentAfter }
        secondRow={ titleSecondRow }
        isLoading={ isLoading }
      />
      { epochQuery.data && <EpochDetails data={ epochQuery.data } isLoading={ isLoading }/> }
    </>
  );
};

export default EpochPageContent;
