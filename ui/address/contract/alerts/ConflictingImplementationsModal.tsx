// Modified by Quat Capital, 2026-10-27: complete runtime contract-interface localization. GPL-3.0.
// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import { Grid, GridItem, HStack, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { SmartContractConflictingImplementation } from 'types/api/contract';

import { Button } from 'toolkit/chakra/button';
import { DialogActionTrigger, DialogBody, DialogContent, DialogHeader, DialogRoot, DialogTrigger } from 'toolkit/chakra/dialog';
import { Link } from 'toolkit/chakra/link';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';

import { getLocalizedProxyInfo } from '../localization';

interface Props {
  data: Array<SmartContractConflictingImplementation>;
  children: React.ReactNode;
}

const ConflictingImplementationsModal = ({ data, children }: Props) => {
  const { t: tQuat } = useTranslation();

  return (
    <DialogRoot size={{ lgDown: 'full', lg: 'md' }}>
      <DialogTrigger>
        { children }
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>{ tQuat('contracts.detected_implementations') }</DialogHeader>
        <DialogBody>
          <Text>{ tQuat('contracts.proxy_spoof_warning') }</Text>
          <VStack alignItems="stretch" mt={ 6 } textStyle="sm">
            { data.map((item) => {
              const addressNum = item.implementations.length;
              const addressText = addressNum === 1 ? tQuat('contracts.implementation_label') : tQuat('contracts.implementations_label');
              const proxyType = getLocalizedProxyInfo(item.proxy_type, tQuat)?.name || tQuat('contracts.proxy_unknown');

              return (
                <Grid
                  key={ item.proxy_type }
                  templateColumns="115px minmax(0px, 1fr)"
                  w="100%"
                  p={ 4 }
                  columnGap={ 5 }
                  rowGap={ 2 }
                  borderRadius="md"
                  bgColor={{ _light: 'blackAlpha.50', _dark: 'whiteAlpha.50' }}
                >
                  <GridItem>{ tQuat('contracts.proxy_type') }</GridItem>
                  <GridItem>{ proxyType }</GridItem>
                  <GridItem>{ addressText }</GridItem>
                  <GridItem>
                    <VStack alignItems="stretch">
                      { item.implementations.map((implementation) => (
                        <AddressEntity
                          key={ implementation.address_hash }
                          address={{ hash: implementation.address_hash, name: implementation.name }}
                        />
                      )) }
                    </VStack>
                  </GridItem>
                </Grid>
              );
            }) }
          </VStack>
          <HStack mt={ 6 } gap={ 6 }>
            <DialogActionTrigger asChild>
              <Button>{ tQuat('contracts.acknowledge') }</Button>
            </DialogActionTrigger>
            <Link external noIcon href="https://discord.com/invite/blockscout">{ tQuat('contracts.contact_us') }</Link>
          </HStack>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default React.memo(ConflictingImplementationsModal);
