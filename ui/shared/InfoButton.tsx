// Modified by Quat Capital, 2026-10-26: localize shared controls, details and data feedback. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import useIsMobile from 'lib/hooks/useIsMobile';
import { Button } from 'toolkit/chakra/button';
import { DialogRoot, DialogContent, DialogTrigger, DialogHeader } from 'toolkit/chakra/dialog';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from 'toolkit/chakra/popover';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  children: React.ReactNode;
  isLoading?: boolean;
}

const InfoButton = ({ children, isLoading }: Props) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const triggerButton = (
    <Button
      size="sm"
      variant="dropdown"
      gap={ 0 }
      aria-label={ t('sharedUi.show_info') }
      fontWeight={ 500 }
      pl={ 1 }
      pr={ isMobile ? 1 : 2 }
      loadingSkeleton={ isLoading }
    >
      <IconSvg name="info" boxSize={ 6 } mr={ isMobile ? 0 : 1 }/>
      { !isMobile && <span>{ t('common.info') }</span> }
    </Button>
  );

  if (isMobile) {
    return (
      <DialogRoot size="full">
        <DialogTrigger>
          { triggerButton }
        </DialogTrigger>
        <DialogContent>
          <DialogHeader/>
          { children }
        </DialogContent>
      </DialogRoot>
    );
  }

  return (
    <PopoverRoot>
      <PopoverTrigger>
        { triggerButton }
      </PopoverTrigger>
      <PopoverContent w="500px">
        <PopoverBody>
          { children }
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default React.memo(InfoButton);
