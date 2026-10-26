// Modified by Quat Capital, 2026-10-25: localized entity labels and accessibility text. GPL-3.0.
import { chakra } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import * as tac from '@blockscout/tac-operation-lifecycle-types';

import { route } from 'nextjs-routes';

import config from 'configs/app';

import * as AddressEntity from './AddressEntity';

const tacFeature = config.features.tac;

interface Props extends AddressEntity.EntityProps {
  chainType: tac.BlockchainType | null;
}

const AddressEntityTacTon = (props: Props) => {
  const { t } = useTranslation();
  if (!tacFeature.isEnabled) {
    return null;
  }

  const href = (() => {
    switch (props.chainType) {
      case tac.BlockchainType.TON:
        return tacFeature.tonExplorerUrl + route({
          pathname: '/address/[hash]',
          query: {
            ...props.query,
            hash: encodeURIComponent(props.address.hash),
          },
        });
      case tac.BlockchainType.TAC:
        return route({
          pathname: '/address/[hash]',
          query: {
            ...props.query,
            hash: props.address.hash,
          },
        });
      default:
        return null;
    }
  })();

  if (!href) {
    return null;
  }

  return (
    <AddressEntity.default
      { ...props }
      href={ href }
      link={{ external: props.chainType === tac.BlockchainType.TON }}
      icon={ props.chainType === tac.BlockchainType.TON ? {
        shield: { name: 'brands/ton' },
        hint: t('sharedEntities.address_ton'),
        hintPostfix: t('sharedEntities.on_ton'),
      } : undefined }
    />
  );
};

export default chakra(AddressEntityTacTon);
