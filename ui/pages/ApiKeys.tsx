// Modified by Quat Capital, 2026-10-26: account interface localization. GPL-3.0.
import { Box, Text } from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import type { ApiKey } from 'types/api/account';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { API_KEY } from 'stubs/account';
import { Button } from 'toolkit/chakra/button';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import ApiKeyModal from 'ui/apiKey/ApiKeyModal/ApiKeyModal';
import ApiKeyListItem from 'ui/apiKey/ApiKeyTable/ApiKeyListItem';
import ApiKeyTable from 'ui/apiKey/ApiKeyTable/ApiKeyTable';
import DeleteApiKeyModal from 'ui/apiKey/DeleteApiKeyModal';
import AccountPageDescription from 'ui/shared/AccountPageDescription';
import AlertWithExternalHtml from 'ui/shared/alerts/AlertWithExternalHtml';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import PageTitle from 'ui/shared/Page/PageTitle';
import useRedirectForInvalidAuthToken from 'ui/snippets/auth/useRedirectForInvalidAuthToken';

const DATA_LIMIT = 3;

const apiKeysAlertHtml = config.UI.apiKeysAlert.message;
const feature = config.features.account;

const ApiKeysPage: React.FC = () => {
  const { t: tAcct } = useTranslation();
  const { locale } = useLocale();
  const apiKeyModalProps = useDisclosure();
  const deleteModalProps = useDisclosure();
  useRedirectForInvalidAuthToken();

  const [ apiKeyModalData, setApiKeyModalData ] = useState<ApiKey>();
  const [ deleteModalData, setDeleteModalData ] = useState<ApiKey>();

  const { data, isPlaceholderData, isError } = useApiQuery('general:api_keys', {
    queryOptions: {
      placeholderData: Array(3).fill(API_KEY),
    },
  });

  const onEditClick = useCallback((data: ApiKey) => {
    setApiKeyModalData(data);
    apiKeyModalProps.onOpen();
  }, [ apiKeyModalProps ]);

  const onApiKeyModalOpenChange = useCallback(({ open }: { open: boolean }) => {
    !open && setApiKeyModalData(undefined);
    apiKeyModalProps.onOpenChange({ open });
  }, [ apiKeyModalProps ]);

  const onDeleteClick = useCallback((data: ApiKey) => {
    setDeleteModalData(data);
    deleteModalProps.onOpen();
  }, [ deleteModalProps ]);

  const onDeleteModalOpenChange = useCallback(({ open }: { open: boolean }) => {
    !open && setDeleteModalData(undefined);
    deleteModalProps.onOpenChange({ open });
  }, [ deleteModalProps ]);

  const description = (
    <AccountPageDescription>
      <Trans
        i18nKey="accountUI.api_keys_description"
        components={{ guide: <Link href="https://docs.blockscout.com/using-blockscout/my-account/api-keys#api-keys" external noIcon/> }}
      />
    </AccountPageDescription>
  );

  const content = (() => {
    if (isError) {
      return <DataFetchAlert/>;
    }

    const list = (
      <>
        <Box display={{ base: 'block', lg: 'none' }}>
          { data?.map((item, index) => (
            <ApiKeyListItem
              key={ item.api_key + (isPlaceholderData ? index : '') }
              item={ item }
              isLoading={ isPlaceholderData }
              onDeleteClick={ onDeleteClick }
              onEditClick={ onEditClick }
            />
          )) }
        </Box>
        <Box display={{ base: 'none', lg: 'block' }}>
          <ApiKeyTable
            data={ data }
            isLoading={ isPlaceholderData }
            onDeleteClick={ onDeleteClick }
            onEditClick={ onEditClick }
            limit={ DATA_LIMIT }
          />
        </Box>
      </>
    );

    const canAdd = !isPlaceholderData ? (data?.length || 0) < DATA_LIMIT : true;

    const alert = apiKeysAlertHtml ? <AlertWithExternalHtml html={ apiKeysAlertHtml } status="warning" mb={ 6 }/> : null;

    const button = (() => {
      if (!feature.isEnabled || feature.apiKeysButton === false) {
        return null;
      }

      if (typeof feature.apiKeysButton === 'string') {
        return (
          <Link href={ feature.apiKeysButton } external noIcon>
            <Button>{ tAcct('accountUI.add_api_key') }</Button>
          </Link>
        );
      }

      return (
        <Button
          onClick={ apiKeyModalProps.onOpen }
          disabled={ !canAdd }
        >
          { tAcct('accountUI.add_api_key') }</Button>
      );
    })();

    return (
      <>
        { description }
        { alert }
        { Boolean(data?.length) && list }
        <Skeleton
          marginTop={ 8 }
          flexDir={{ base: 'column', lg: 'row' }}
          alignItems={{ base: 'start', lg: 'center' }}
          loading={ isPlaceholderData }
          display="inline-flex"
          columnGap={ 5 }
          rowGap={ 5 }
        >
          { button }
          { !canAdd && (
            <Text fontSize="sm" color="text.secondary">
              { tAcct('accountUI.api_keys_limit', { limit: formatNumber(DATA_LIMIT, locale) }) }
            </Text>
          ) }
        </Skeleton>
        <ApiKeyModal open={ apiKeyModalProps.open } onOpenChange={ onApiKeyModalOpenChange } data={ apiKeyModalData }/>
        { deleteModalData && <DeleteApiKeyModal open={ deleteModalProps.open } onOpenChange={ onDeleteModalOpenChange } data={ deleteModalData }/> }
      </>
    );
  })();

  return (
    <>
      <PageTitle title={ tAcct('accountUI.api_keys') }/>
      { content }
    </>
  );
};

export default ApiKeysPage;
