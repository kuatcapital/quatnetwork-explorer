// Modified by Quat Capital, 2026-10-26: account interface localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { ItemProps } from '../types';

import { MenuItem } from 'toolkit/chakra/menu';
import IconSvg from 'ui/shared/IconSvg';
import { useMetadataUpdateContext } from 'ui/tokenInstance/contexts/metadataUpdate';

import ButtonItem from '../parts/ButtonItem';

const MetadataUpdateMenuItem = ({ type }: ItemProps) => {
  const { t: tAcct } = useTranslation();

  const { status, setStatus } = useMetadataUpdateContext() || {};

  const handleClick = React.useCallback(() => {
    setStatus?.('MODAL_OPENED');
  }, [ setStatus ]);

  const element = (() => {
    switch (type) {
      case 'button': {
        return (
          <ButtonItem
            label={ tAcct('accountUI.refresh_metadata') }
            icon="refresh"
            onClick={ handleClick }
            isDisabled={ status === 'WAITING_FOR_RESPONSE' }
          />
        );
      }
      case 'menu_item': {
        return (
          <MenuItem onClick={ handleClick } disabled={ status === 'WAITING_FOR_RESPONSE' } value="refresh-metadata">
            <IconSvg name="refresh" boxSize={ 5 }/>
            <span>{ tAcct('accountUI.refresh_metadata') }</span>
          </MenuItem>
        );
      }
    }
  })();

  return element;
};

export default React.memo(MetadataUpdateMenuItem);
