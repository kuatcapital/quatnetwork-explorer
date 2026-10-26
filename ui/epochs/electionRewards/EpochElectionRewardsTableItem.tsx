// Modified by Quat Capital, 2026-10-26: localize validators, epochs and transfers. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { CeloEpochDetails, CeloEpochElectionReward } from 'types/api/epochs';

import { useLocale } from 'lib/i18n/provider';
import { IconButton } from 'toolkit/chakra/icon-button';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import EpochRewardTypeTag from 'ui/shared/EpochRewardTypeTag';
import IconSvg from 'ui/shared/IconSvg';
import TokenValue from 'ui/shared/value/TokenValue';

import EpochElectionRewardDetailsDesktop from './EpochElectionRewardDetailsDesktop';
import { getRewardNumText } from './utils';

interface Props {
  data: CeloEpochElectionReward;
  type: keyof CeloEpochDetails['aggregated_election_rewards'];
  isLoading?: boolean;
}

const EpochElectionRewardsTableItem = ({ isLoading, data, type }: Props) => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const section = useDisclosure();

  const mainRowBorderColor = section.open ? 'transparent' : 'border.divider';

  return (
    <>
      <TableRow
        onClick={ isLoading || !data.count ? undefined : section.onToggle }
        cursor={ isLoading || !data.count ? undefined : 'pointer' }
      >
        <TableCell borderColor={ mainRowBorderColor }>
          { Boolean(data.count) && (
            <Skeleton loading={ isLoading } display="flex" borderRadius="sm">
              <IconButton
                aria-label={ section.open ? t('networkTransfers.collapse') : t('networkTransfers.expand') }
                variant="link"
              >
                <IconSvg
                  name="arrows/east-mini"
                  boxSize={ 6 }
                  transform={ section.open ? 'rotate(270deg)' : 'rotate(180deg)' }
                  transitionDuration="faster"
                />
              </IconButton>
            </Skeleton>
          ) }
        </TableCell>
        <TableCell borderColor={ mainRowBorderColor }>
          <EpochRewardTypeTag type={ type } isLoading={ isLoading }/>
        </TableCell>
        <TableCell borderColor={ mainRowBorderColor }>
          <Skeleton loading={ isLoading } fontWeight={ 400 } my={ 1 }>
            { getRewardNumText(type, data.count, t, locale) }
          </Skeleton>
        </TableCell>
        <TableCell borderColor={ mainRowBorderColor } textAlign="right">
          <TokenValue
            amount={ data.total }
            token={ data.token }
            accuracy={ 0 }
            loading={ isLoading }
            my="2px"
          />
        </TableCell>
      </TableRow>
      { section.open && (
        <TableRow>
          <TableCell/>
          <TableCell colSpan={ 3 } pr={ 0 } pt={ 0 }>
            <EpochElectionRewardDetailsDesktop type={ type } token={ data.token }/>
          </TableCell>
        </TableRow>
      ) }
    </>
  );
};

export default React.memo(EpochElectionRewardsTableItem);
