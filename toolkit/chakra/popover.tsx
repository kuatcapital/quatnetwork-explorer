// Modified by Quat Capital, 2026-10-29: override Ark close aria text using runtime translations. GPL-3.0.
import { Popover as ChakraPopover, Portal } from '@chakra-ui/react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { CloseButton } from './close-button';

export interface PopoverContentProps extends ChakraPopover.ContentProps {
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement>;
}

export const PopoverContent = React.forwardRef<
  HTMLDivElement,
  PopoverContentProps
>(function PopoverContent(props, ref) {
  const { portalled = true, portalRef, ...rest } = props;
  return (
    <Portal disabled={ !portalled } container={ portalRef }>
      <ChakraPopover.Positioner>
        <ChakraPopover.Content ref={ ref } { ...rest }/>
      </ChakraPopover.Positioner>
    </Portal>
  );
});

export const PopoverArrow = React.forwardRef<
  HTMLDivElement,
  ChakraPopover.ArrowProps
>(function PopoverArrow(props, ref) {
  return (
    <ChakraPopover.Arrow { ...props } ref={ ref }>
      <ChakraPopover.ArrowTip/>
    </ChakraPopover.Arrow>
  );
});

export const PopoverCloseTrigger = React.forwardRef<
  HTMLButtonElement,
  ChakraPopover.CloseTriggerProps
>(function PopoverCloseTrigger(props, ref) {
  const { t } = useTranslation();
  return (
    <ChakraPopover.CloseTrigger
      position="absolute"
      top="1"
      insetEnd="1"
      aria-label={ t('arkUi.close_popover') }
      { ...props }
      asChild
      ref={ ref }
    >
      <CloseButton/>
    </ChakraPopover.CloseTrigger>
  );
});

export const PopoverCloseTriggerWrapper = React.forwardRef<
  HTMLButtonElement,
  ChakraPopover.CloseTriggerProps
>(function PopoverCloseTriggerWrapper(props, ref) {
  const { t } = useTranslation();
  const { disabled, ...rest } = props;

  if (disabled) {
    return props.children;
  }

  return (
    <ChakraPopover.CloseTrigger
      ref={ ref }
      aria-label={ t('arkUi.close_popover') }
      { ...rest }
      asChild
    />
  );
});

export const PopoverRoot = (props: ChakraPopover.RootProps) => {
  const positioning = {
    placement: 'bottom-start' as const,
    overflowPadding: 4,
    ...props.positioning,
    offset: {
      mainAxis: 4,
      ...props.positioning?.offset,
    },
  };
  const { lazyMount = true, unmountOnExit = true, ...rest } = props;

  return (
    <ChakraPopover.Root
      autoFocus={ false }
      lazyMount={ lazyMount }
      unmountOnExit={ unmountOnExit }
      { ...rest }
      positioning={ positioning }
    />
  );
};

export const PopoverTrigger = React.forwardRef<
  HTMLButtonElement,
  ChakraPopover.TriggerProps
>(function PopoverTrigger(props, ref) {
  const { asChild = true, ...rest } = props;
  return <ChakraPopover.Trigger asChild={ asChild } ref={ ref } { ...rest }/>;
});

export const PopoverTitle = ChakraPopover.Title;
export const PopoverDescription = ChakraPopover.Description;
export const PopoverFooter = ChakraPopover.Footer;
export const PopoverHeader = ChakraPopover.Header;
export const PopoverBody = ChakraPopover.Body;
