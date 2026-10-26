// Modified by Quat Capital, 2026-10-26: runtime marketplace labels. GPL-3.0.
import { chakra } from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import * as mixpanel from 'lib/mixpanel/index';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';

const IframeBanner = ({ contentUrl, linkUrl }: { contentUrl: string; linkUrl: string }) => {
  const { t: tEco } = useTranslation();
  const [ isFrameLoading, setIsFrameLoading ] = useState(true);

  const handleIframeLoad = useCallback(() => {
    setIsFrameLoading(false);
  }, []);

  const handleClick = useCallback(() => {
    mixpanel.logEvent(mixpanel.EventTypes.PROMO_BANNER, { Source: 'Marketplace', Link: linkUrl });
  }, [ linkUrl ]);

  return (
    <Skeleton
      loading={ isFrameLoading }
      position="relative"
      h="100px"
      w="100%"
      borderRadius="md"
      overflow="hidden"
    >
      <Link
        href={ linkUrl }
        external
        noIcon
        onClick={ handleClick }
        position="absolute"
        w="100%"
        h="100%"
        top={ 0 }
        left={ 0 }
        zIndex={ 1 }
      />
      <chakra.iframe
        h="100%"
        w="100%"
        src={ contentUrl }
        title={ tEco('marketplaceUI.banner') }
        onLoad={ handleIframeLoad }
      />
    </Skeleton>
  );
};

export default IframeBanner;
