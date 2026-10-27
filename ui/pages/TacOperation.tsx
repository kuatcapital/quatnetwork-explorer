// Modified by Quat Capital, 2026-10-27: continue runtime RU/KK/EN localization. GPL-3.0.
// Modified by Quat Capital, 2026-10-26: T18 reviewed literal localization. GPL-3.0.
import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'react-i18next';

import useApiQuery from 'lib/api/useApiQuery';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import getQueryParamString from 'lib/router/getQueryParamString';
import { TAC_OPERATION_DETAILS } from 'stubs/operations';
import TacOperationDetails from 'ui/operation/tac/TacOperationDetails';
import TextAd from 'ui/shared/ad/TextAd';
import OperationEntity from 'ui/shared/entities/operation/OperationEntity';
import PageTitle from 'ui/shared/Page/PageTitle';
import TacOperationTag from 'ui/shared/TacOperationTag';

const TacOperation = () => {
  const { t: tQuat } = useTranslation();

  const router = useRouter();
  const id = getQueryParamString(router.query.id);

  const query = useApiQuery('tac:operation', {
    pathParams: { id },
    queryOptions: {
      placeholderData: TAC_OPERATION_DETAILS,
    },
  });

  throwOnResourceLoadError(query);

  const titleContentAfter = query.data ? (
    <TacOperationTag type={ query.data.type } loading={ query.isPlaceholderData }/>
  ) : null;

  const titleSecondRow = (
    <OperationEntity id={ id } noLink variant="subheading" type={ query.data?.type }/>
  );

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle
        title={ tQuat('l2Ui.operation_details') }
        contentAfter={ titleContentAfter }
        isLoading={ query.isPlaceholderData }
        secondRow={ titleSecondRow }
      />
      { query.data && (
        <TacOperationDetails isLoading={ query.isPlaceholderData } data={ query.data }/>
      ) }
    </>
  );
};

export default React.memo(TacOperation);
