// Modified by Quat Capital, 2026-10-27: complete runtime multichain localization. GPL-3.0.
import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'react-i18next';

import useApiQuery from 'lib/api/useApiQuery';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import getQueryParamString from 'lib/router/getQueryParamString';
import { ZETA_CHAIN_CCTX } from 'stubs/zetaChainCCTX';
import TextAd from 'ui/shared/ad/TextAd';
import TxEntityZetaChainCC from 'ui/shared/entities/tx/TxEntityZetaChainCC';
import PageTitle from 'ui/shared/Page/PageTitle';
import ZetaChainCCTXDetails from 'ui/zetaChain/cctxDetails/ZetaChainCCTXDetails';

const ZetaChainCCTX = () => {
  const { t: tQuat } = useTranslation();

  const router = useRouter();

  const hash = getQueryParamString(router.query.hash);

  const cctxQuery = useApiQuery('zetachain:transaction', {
    queryParams: { cctx_id: hash },
    queryOptions: {
      placeholderData: ZETA_CHAIN_CCTX,
    },
  });

  throwOnResourceLoadError(cctxQuery);

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle
        title={ tQuat('multiUi.cross_details') }
        secondRow={ <TxEntityZetaChainCC hash={ hash } noLink variant="subheading" mr={{ base: 0, lg: 2 }}/> }
      />
      <ZetaChainCCTXDetails data={ cctxQuery.data } isLoading={ cctxQuery.isPlaceholderData }/>
    </>
  );
};

export default ZetaChainCCTX;
