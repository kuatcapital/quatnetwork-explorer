// Modified by Quat Capital, 2026-10-26: localize validators, epochs and transfers. GPL-3.0.
import { Box, Flex } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { CeloEpochElectionReward, CeloEpochDetails } from 'types/api/epochs';

import { useLocale } from 'lib/i18n/provider';
import { IconButton } from 'toolkit/chakra/icon-button';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import EpochRewardTypeTag from 'ui/shared/EpochRewardTypeTag';
import IconSvg from 'ui/shared/IconSvg';
import TokenValue from 'ui/shared/value/TokenValue';

import EpochElectionRewardDetailsMobile from './EpochElectionRewardDetailsMobile';
import { getRewardNumText } from './utils';

interface Props {
  data: CeloEpochElectionReward;
  type: keyof CeloEpochDetails['aggregated_election_rewards'];
  isLoading?: boolean;
}

const EpochElectionRewardsListItem = ({ data, isLoading, type }: Props) => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const section = useDisclosure();

  return (
    <Box
      py={ 3 }
      borderBottomWidth="1px"
      borderColor="border.divider"
      fontSize="sm"
      onClick={ isLoading || !data.count ? undefined : section.onToggle }
      cursor={ isLoading || !data.count ? undefined : 'pointer' }
    >
      <Flex my="3px" columnGap={ 3 } alignItems="center" flexWrap="wrap" rowGap={ 2 }>
        { data.count ? (
          <Skeleton loading={ isLoading } display="flex" borderRadius="sm">
            <IconButton
              aria-label={ section.open ? t('networkTransfers.collapse') : t('networkTransfers.expand') }
              variant="link"
              boxSize={ 6 }
            >
              <IconSvg
                name="arrows/east-mini"
                boxSize={ 6 }
                transform={ section.open ? 'rotate(270deg)' : 'rotate(180deg)' }
                transitionDuration="faster"
              />
            </IconButton>
          </Skeleton>
        ) : <Box boxSize={ 6 }/> }
        <EpochRewardTypeTag type={ type } isLoading={ isLoading }/>
        <Skeleton loading={ isLoading } ml="auto">{ getRewardNumText(type, data.count, t, locale) }</Skeleton>
        <TokenValue
          amount={ data.total }
          token={ data.token }
          accuracy={ 0 }
          loading={ isLoading }
          fontWeight={ 500 }
        />
      </Flex>
      { section.open && (
        <Box mt={ 2 }>
          <EpochElectionRewardDetailsMobile type={ type } token={ data.token }/>
        </Box>
      ) }
    </Box>
  );
};

export default React.memo(EpochElectionRewardsListItem);
