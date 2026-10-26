// Modified by Quat Capital, 2026-10-26: marketplace, rewards or token info localization. GPL-3.0.
import { Text } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { route } from 'nextjs-routes';

import useIsMobile from 'lib/hooks/useIsMobile';
import { Button } from 'toolkit/chakra/button';
import { DialogBody, DialogContent, DialogFooter, DialogHeader, DialogRoot } from 'toolkit/chakra/dialog';
import { Link } from 'toolkit/chakra/link';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  appId: string;
};

const MarketplaceDisclaimerModal = ({ isOpen, onClose, appId }: Props) => {
  const { t: tEco } = useTranslation();

  const isMobile = useIsMobile();

  const handleContinueClick = React.useCallback(() => {
    window.localStorage.setItem('marketplace-disclaimer-shown', 'true');
  }, [ ]);

  return (
    <DialogRoot
      open={ isOpen }
      onOpenChange={ onClose }
      size={ isMobile ? 'full' : 'md' }
    >
      <DialogContent>
        <DialogHeader>
          { tEco('marketplaceUI.disclaimer') }</DialogHeader>

        <DialogBody>
          <Text color={{ _light: 'gray.800', _dark: 'whiteAlpha.800' }}>
            { tEco('marketplaceUI.disclaimer_body') }
            <br/><br/>
            { tEco('marketplaceUI.disclaimer_agreement') }</Text>
        </DialogBody>

        <DialogFooter
          display="flex"
          flexDirection="row"
          alignItems="center"
        >
          <Link href={ route({ pathname: '/apps/[id]', query: { id: appId } }) } asChild>
            <Button onClick={ handleContinueClick } >
              { tEco('marketplaceUI.continue_app') }</Button>
          </Link>
          <Button
            variant="outline"
            onClick={ onClose }
          >
            { tEco('common.cancel') }</Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default MarketplaceDisclaimerModal;
