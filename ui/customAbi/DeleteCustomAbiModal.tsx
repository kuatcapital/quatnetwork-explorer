// Modified by Quat Capital, 2026-10-26: account interface localization. GPL-3.0.
import { Text } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React, { useCallback } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import type { CustomAbi, CustomAbis } from 'types/api/account';

import { resourceKey } from 'lib/api/resources';
import useApiFetch from 'lib/api/useApiFetch';
import DeleteModal from 'ui/shared/DeleteModal';

type Props = {
  open: boolean;
  onOpenChange: ({ open }: { open: boolean }) => void;
  data: CustomAbi;
};

const DeleteCustomAbiModal: React.FC<Props> = ({ open, onOpenChange, data }) => {
  const { t: tAcct } = useTranslation();

  const queryClient = useQueryClient();
  const apiFetch = useApiFetch();

  const mutationFn = useCallback(() => {
    return apiFetch('general:custom_abi', {
      pathParams: { id: String(data.id) },
      fetchParams: { method: 'DELETE' },
    });
  }, [ apiFetch, data.id ]);

  const onSuccess = useCallback(async() => {
    queryClient.setQueryData([ resourceKey('general:custom_abi') ], (prevData: CustomAbis | undefined) => {
      return prevData?.filter((item) => item.id !== data.id);
    });
  }, [ data, queryClient ]);

  const renderText = useCallback(() => {
    return (
      <Text>
        <Trans
          i18nKey="accountUI.abi_delete_confirmation"
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
      title={ tAcct('accountUI.remove_custom_abi') }
      renderContent={ renderText }
      mutationFn={ mutationFn }
      onSuccess={ onSuccess }
    />
  );
};

export default React.memo(DeleteCustomAbiModal);
