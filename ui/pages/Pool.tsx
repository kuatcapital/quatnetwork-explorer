// Modified by Quat Capital, 2026-10-27: T18 supplemental interface localization. GPL-3.0.
import { Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'react-i18next';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import getPoolLinks from 'lib/pools/getPoolLinks';
import { getPoolTitle } from 'lib/pools/getPoolTitle';
import getQueryParamString from 'lib/router/getQueryParamString';
import * as addressStubs from 'stubs/address';
import { POOL } from 'stubs/pools';
import { Image } from 'toolkit/chakra/image';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tag } from 'toolkit/chakra/tag';
import PoolInfo from 'ui/pool/PoolInfo';
import isCustomAppError from 'ui/shared/AppError/isCustomAppError';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import * as PoolEntity from 'ui/shared/entities/pool/PoolEntity';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import InfoButton from 'ui/shared/InfoButton';
import PageTitle from 'ui/shared/Page/PageTitle';
import VerifyWith from 'ui/shared/VerifyWith';

const Pool = () => {
  const { t: tQuat } = useTranslation();

  const router = useRouter();
  const hash = getQueryParamString(router.query.hash);

  const { data, isPlaceholderData, isError, error } = useApiQuery('contractInfo:pool', {
    pathParams: { hash, chainId: config.chain.id },
    queryOptions: {
      placeholderData: POOL,
      refetchOnMount: false,
    },
  });

  const addressQuery = useApiQuery('general:address', {
    pathParams: { hash: data?.pool_id },
    queryOptions: {
      enabled: Boolean(data?.is_contract),
      placeholderData: addressStubs.ADDRESS_INFO,
    },
  });

  const content = (() => {
    if (isError) {
      if (isCustomAppError(error)) {
        throwOnResourceLoadError({ resource: 'contractInfo:pool', error, isError: true });
      }

      return <DataFetchAlert/>;
    }

    if (!data) {
      return null;
    }

    return (
      <PoolInfo
        data={ data }
        isPlaceholderData={ isPlaceholderData }
      />
    );
  })();

  const externalLinks = getPoolLinks(data);
  const hasLinks = externalLinks.length > 0;

  const externalLinksComponents = React.useMemo(() => {
    return externalLinks
      .map((link) => {
        return (
          <Link external h="34px" key={ link.url } href={ link.url } alignItems="center" display="inline-flex" minW="120px">
            <Image boxSize={ 5 } mr={ 2 } src={ link.image } alt={ tQuat('common.icon', { name: link.title }) }/>
            { link.title }
          </Link>
        );
      });
  }, [ externalLinks, tQuat ]);

  const poolIdOrContract = React.useMemo(() => {
    if (data?.is_contract && addressQuery.data) {
      return <AddressEntity address={ addressQuery.data } isLoading={ addressQuery.isPlaceholderData }/>;
    } else if (data?.pool_id) {
      return (
        <Skeleton loading={ isPlaceholderData } display="flex" alignItems="center" overflow="hidden">
          <Flex overflow="hidden">
            <HashStringShortenDynamic hash={ data?.pool_id }/>
          </Flex>
          <CopyToClipboard text={ data?.pool_id }/>
        </Skeleton>
      );
    }

    return null;
  }, [ data, isPlaceholderData, addressQuery.isPlaceholderData, addressQuery.data ]);

  const titleSecondRow = (
    <Flex alignItems="center" justifyContent="space-between" w="100%">
      { poolIdOrContract }
      <Flex gap={ 2 } ml={ 2 }>
        <InfoButton>
          { tQuat('suppUi.lp_hint', { base: data?.base_token_symbol, quote: data?.quote_token_symbol }) }
        </InfoButton>
        { hasLinks && (
          <VerifyWith
            links={ externalLinksComponents }
            label={ tQuat('suppUi.verify_with') }
            longText={ tQuat('suppUi.view_in') }
            shortText=""
          />
        ) }
      </Flex>
    </Flex>
  );

  const poolTitle = data ? getPoolTitle(data) : '';

  return (
    <>
      <PageTitle
        title={ poolTitle }
        beforeTitle={ data ? (
          <PoolEntity.Icon
            pool={ data }
            isLoading={ isPlaceholderData }
            variant="heading"
          />
        ) : null }
        contentAfter={ <Skeleton loading={ isPlaceholderData }><Tag>{ tQuat('suppUi.pool') }</Tag></Skeleton> }
        secondRow={ titleSecondRow }
        isLoading={ isPlaceholderData }
        withTextAd
      />
      { content }
    </>
  );
};

export default Pool;
