// Modified by Quat Capital, 2026-10-26: localize shared controls, details and data feedback. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import config from 'configs/app';
import * as cookies from 'lib/cookies';
import AdBanner from 'ui/shared/ad/AdBanner';

import * as DetailedInfo from './DetailedInfo';

const feature = config.features.adsBanner;

interface Props {
  isLoading?: boolean;
}

const DetailedInfoSponsoredItem = ({ isLoading }: Props) => {
  const { t } = useTranslation();
  const hasAdblockCookie = cookies.get(cookies.NAMES.ADBLOCK_DETECTED);

  if (!feature.isEnabled || hasAdblockCookie === 'true') {
    return null;
  }

  return (
    <>
      <DetailedInfo.ItemLabel
        hint={ t('sharedUi.sponsored_banner') }
        isLoading={ isLoading }
      >
        { t('sharedUi.sponsored') }
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue mt={{ base: 0, lg: 1 }}>
        <AdBanner format="responsive" isLoading={ isLoading }/>
      </DetailedInfo.ItemValue>
    </>
  );
};

export default React.memo(DetailedInfoSponsoredItem);
