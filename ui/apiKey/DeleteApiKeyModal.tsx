// Modified by Quat Capital, 2026-10-26: account interface localization. GPL-3.0.
import { Text } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React, { useCallback } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import type { ApiKey, ApiKeys } from 'types/api/account';

import { resourceKey } from 'lib/api/resources';
import useApiFetch from 'lib/api/useApiFetch';
import DeleteModal from 'ui/shared/DeleteModal';

type Props = {
  open: boolean;
  onOpenChange: ({ open }: { open: boolean }) => void;
  data: ApiKey;
};

const DeleteApiKeyModal: React.FC<Props> = ({ open, onOpenChange, data }) => {
  const { t: tAcct } = useTranslation();
  const queryClient = useQueryClient();
  const apiFetch = useApiFetch();

  const mutationFn = useCallback(() => {
    return apiFetch('general:api_keys', {
      pathParams: { id: data.api_key },
      fetchParams: { method: 'DELETE' },
    });
  }, [ data.api_key, apiFetch ]);

  const onSuccess = useCallback(async() => {
    queryClient.setQueryData([ resourceKey('general:api_keys') ], (prevData: ApiKeys | undefined) => {
      return prevData?.filter((item) => item.api_key !== data.api_key);
    });
  }, [ data, queryClient ]);

  const renderText = useCallback(() => {
    return (
      <Text>
        <Trans
          i18nKey="accountUI.api_key_delete_confirmation"
          values={{ name: data.name || tAcct('accountUI.name') }}
          components={{ strong: <Text fontWeight="700" as="span"/> }}
        />
      </Text>
    );
  }, [ data.name, tAcct ]);

  return (
    <DeleteModal
      open={ open }
      onOpenChange={ onOpenChange }
      title={ tAcct('accountUI.remove_api_key') }
      renderContent={ renderText }
      mutationFn={ mutationFn }
      onSuccess={ onSuccess }
    />
  );
};

export default DeleteApiKeyModal;
