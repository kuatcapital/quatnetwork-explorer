// Modified by Quat Capital, 2026-10-26: marketplace, rewards or token info localization. GPL-3.0.
import { Text } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { DialogBody, DialogContent, DialogRoot, DialogHeader } from 'toolkit/chakra/dialog';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

const RewardsTaskDetailsModal = ({ isOpen, onClose, title, children }: Props) => {
  const { t: tEco } = useTranslation();
  const handleOpenChange = React.useCallback(({ open }: { open: boolean }) => {
    if (!open) {
      onClose();
    }
  }, [ onClose ]);

  return (
    <DialogRoot
      open={ isOpen }
      onOpenChange={ handleOpenChange }
      size={{ lgDown: 'full', lg: 'sm' }}
    >
      <DialogContent>
        <DialogHeader>
          { title }
        </DialogHeader>
        <DialogBody>
          <Text>{ children }</Text>
          <Text textStyle="sm" color="text.secondary" mt={ 3 }>
            { tEco('rewardsUI.supported_networks') }</Text>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default RewardsTaskDetailsModal;
