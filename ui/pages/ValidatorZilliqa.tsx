// Modified by Quat Capital, 2026-10-26: localize validators, epochs and transfers. GPL-3.0.
import { Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'react-i18next';

import useApiQuery from 'lib/api/useApiQuery';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import getQueryParamString from 'lib/router/getQueryParamString';
import { VALIDATOR_ZILLIQA } from 'stubs/validators';
import TextAd from 'ui/shared/ad/TextAd';
import ValidatorEntity from 'ui/shared/entities/validator/ValidatorEntity';
import PageTitle from 'ui/shared/Page/PageTitle';
import ValidatorDetails from 'ui/validators/zilliqa/ValidatorDetails';

const ValidatorZilliqa = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const blsPublicKey = getQueryParamString(router.query.id);

  const query = useApiQuery('general:validator_zilliqa', {
    pathParams: { bls_public_key: blsPublicKey },
    queryOptions: {
      placeholderData: VALIDATOR_ZILLIQA,
    },
  });

  throwOnResourceLoadError(query);

  const isLoading = query.isPlaceholderData;

  const titleSecondRow = (
    <Flex
      columnGap={ 3 }
      rowGap={ 3 }
      alignItems="center"
      w="100%"
      flexWrap={{ base: 'wrap', lg: 'nowrap' }}
    >
      <ValidatorEntity
        id={ query.data?.bls_public_key ?? '' }
        isLoading={ isLoading }
        variant="subheading"
        noLink
      />
    </Flex>
  );

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle title={ t('networkTransfers.validator_details') } secondRow={ titleSecondRow }/>
      { query.data && <ValidatorDetails data={ query.data } isLoading={ isLoading }/> }
    </>
  );
};

export default ValidatorZilliqa;
