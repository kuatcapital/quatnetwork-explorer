// Modified by Quat Capital, 2026-10-26: runtime locale for block and statistics UI. GPL-3.0.
import { HStack } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { route } from 'nextjs-routes';

import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { Link } from 'toolkit/chakra/link';
import { Tag } from 'toolkit/chakra/tag';
import { Tooltip } from 'toolkit/chakra/tooltip';

import type { BlockQuery } from './useBlockQuery';

interface Props {
  blockQuery: BlockQuery;
}

const BlockCeloEpochTagRegular = ({ blockQuery }: Props) => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  if (!blockQuery.data?.celo) {
    return null;
  }

  return (
    <Tooltip
      key="epoch-tag-before-finalized"
      content={ t('blockDetails.epoch_hint') }
    >
      <Link href={ route({ pathname: '/epochs/[number]', query: { number: String(blockQuery.data.celo.epoch_number) } }) }>
        <Tag variant="clickable">{ t('blockDetails.epoch', { number: formatNumber(blockQuery.data.celo.epoch_number, locale) }) }</Tag>
      </Link>
    </Tooltip>
  );
};

const BlockCeloEpochTag = ({ blockQuery }: Props) => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  if (!blockQuery.data?.celo) {
    return null;
  }

  if (!blockQuery.data.celo.l1_era_finalized_epoch_number) {
    return <BlockCeloEpochTagRegular blockQuery={ blockQuery }/>;
  }

  return (
    <HStack gap={ 2 }>
      <Tooltip
        key="epoch-tag"
        content={ t('blockDetails.finalized_epoch_hint') }
      >
        <Link href={ route({ pathname: '/epochs/[number]', query: { number: String(blockQuery.data.celo.l1_era_finalized_epoch_number) } }) }>
          <Tag bgColor="celo" color="blackAlpha.800" variant="clickable">
            { t('blockDetails.finalized_epoch', { number: formatNumber(blockQuery.data.celo.l1_era_finalized_epoch_number, locale) }) }
          </Tag>
        </Link>
      </Tooltip>
      <BlockCeloEpochTagRegular blockQuery={ blockQuery }/>
    </HStack>
  );
};

export default React.memo(BlockCeloEpochTag);
