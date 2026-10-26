// Modified by Quat Capital, 2026-10-26: marketplace, rewards or token info localization. GPL-3.0.
import { Grid } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import config from 'configs/app';

import RewardsDashboardInfoCard from '../RewardsDashboardInfoCard';

export default function ResourcesTab() {
  const { t: tEco } = useTranslation();
  return (
    <Grid
      w="full"
      gap={ 6 }
      templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
    >
      <RewardsDashboardInfoCard
        title={ tEco('rewardsUI.badges') }
        description={ tEco('rewardsUI.badges_description') }
        imageSrc="/static/merits/badges.svg"
        imageWidth="180px"
        imageHeight="86px"
        linkText={ tEco('rewardsUI.view_badges') }
        linkHref={ `https://merits.blockscout.com/?tab=badges&utm_source=${ config.chain.id }&utm_medium=badges` }
      />
      <RewardsDashboardInfoCard
        title={ tEco('rewardsUI.campaigns') }
        description={ tEco('rewardsUI.campaigns_description') }
        imageSrc="/static/merits/campaigns.svg"
        imageWidth="180px"
        imageHeight="76px"
        linkText={ tEco('rewardsUI.check_campaigns') }
        linkHref={ `https://merits.blockscout.com/?tab=campaigns&utm_source=${ config.chain.id }&utm_medium=campaigns` }
      />
      <RewardsDashboardInfoCard
        title={ tEco('rewardsUI.use_merits') }
        description={ tEco('rewardsUI.offers_description') }
        imageSrc="/static/merits/offers.svg"
        imageWidth="180px"
        imageHeight="86px"
        linkText={ tEco('rewardsUI.check_offers') }
        linkHref={ `https://merits.blockscout.com/?tab=spend&utm_source=${ config.chain.id }&utm_medium=spend` }
      />
    </Grid>
  );
}
