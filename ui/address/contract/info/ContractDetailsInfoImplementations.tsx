// Modified by Quat Capital, 2026-10-27: complete runtime contract-interface localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { AddressImplementation } from 'types/api/addressParams';
import type { SmartContractProxyType } from 'types/api/contract';

import ContainerWithScrollY from 'ui/shared/ContainerWithScrollY';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';

import ContractDetailsInfoItem from './ContractDetailsInfoItem';

interface Props {
  implementations: Array<AddressImplementation>;
  proxyType?: SmartContractProxyType;
}

const ContractDetailsInfoImplementations = ({ implementations, proxyType }: Props) => {
  const { t } = useTranslation();
  const label = (() => {
    if (proxyType === 'eip7702') return t('contracts.delegated_to');
    return implementations.length > 1 ? t('contracts.implementations') : t('contracts.implementation');
  })();
  return (
    <ContractDetailsInfoItem
      label={ label }
      contentProps={{ gridColumn: { lg: '2 / span 3' }, position: 'relative' }}
    >
      <ContainerWithScrollY gradientHeight={ 48 } maxH="200px" w="100%">
        { implementations.map((item) => (
          <AddressEntity
            key={ item.address_hash }
            address={{
              hash: item.address_hash,
              filecoin: { robust: item.filecoin_robust_address },
              name: item.name,
              is_contract: true,
            }}
            noIcon
          />
        )) }
      </ContainerWithScrollY>
    </ContractDetailsInfoItem>
  );
};

export default React.memo(ContractDetailsInfoImplementations);
