// Modified by Quat Capital, 2026-10-26: account interface localization. GPL-3.0.
import { Text } from '@chakra-ui/react';
import React, { useCallback } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import type { WatchlistAddress } from 'types/api/account';

import useApiFetch from 'lib/api/useApiFetch';
import useIsMobile from 'lib/hooks/useIsMobile';
import DeleteModal from 'ui/shared/DeleteModal';

type Props = {
  open: boolean;
  onOpenChange: ({ open }: { open: boolean }) => void;
  onSuccess: () => Promise<void>;
  data: Pick<WatchlistAddress, 'address_hash' | 'id'>;
};

const DeleteAddressModal: React.FC<Props> = ({ open, onOpenChange, onSuccess, data }) => {
  const { t: tAcct } = useTranslation();
  const isMobile = useIsMobile();
  const apiFetch = useApiFetch();

  const mutationFn = useCallback(() => {
    return apiFetch('general:watchlist', {
      pathParams: { id: String(data.id) },
      fetchParams: { method: 'DELETE' },
    });
  }, [ data?.id, apiFetch ]);

  const address = data?.address_hash;

  const renderModalContent = useCallback(() => {
    const addressString = isMobile ? [ address.slice(0, 4), address.slice(-4) ].join('...') : address;
    return (
      <Text>
        <Trans
          i18nKey="accountUI.address_delete_confirmation"
          values={{ address: addressString || tAcct('accountUI.address') }}
          components={{ strong: <Text fontWeight="700" as="span"/> }}
        />
      </Text>
    );
  }, [ address, isMobile, tAcct ]);

  return (
    <DeleteModal
      open={ open }
      onOpenChange={ onOpenChange }
      title={ tAcct('accountUI.remove_watchlist_address') }
      renderContent={ renderModalContent }
      mutationFn={ mutationFn }
      onSuccess={ onSuccess }
    />
  );
};

export default DeleteAddressModal;
