// Modified by Quat Capital, 2026-10-25: complete rich-text action translations and precise locale values. GPL-3.0.
import { Flex, chakra } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import type { TxAction } from 'types/api/txAction';

import config from 'configs/app';
import { formatBigNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import NftEntity from 'ui/shared/entities/nft/NftEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  action: TxAction;
}

const ACTION_KEYS = {
  mint: 'transactions.action_add_liquidity',
  burn: 'transactions.action_remove_liquidity',
  collect: 'transactions.action_collect',
  swap: 'transactions.action_swap',
} as const;

const TxDetailsAction = ({ action }: Props) => {
  const { t: tTx } = useTranslation();
  const { locale } = useLocale();
  const { protocol, type, data } = action;

  if (protocol !== 'uniswap_v3') return null;

  switch (type) {
    case 'mint':
    case 'burn':
    case 'collect':
    case 'swap': {
      const token0 = {
        address_hash: data.symbol0 === 'Ether' ? '' : data.address0,
        name: data.symbol0 === 'Ether' ? config.chain.currency.symbol || null : data.symbol0,
        type: 'ERC-20' as const,
        symbol: null,
        icon_url: null,
        reputation: null,
      };
      const token1 = {
        address_hash: data.symbol1 === 'Ether' ? '' : data.address1,
        name: data.symbol1 === 'Ether' ? config.chain.currency.symbol || null : data.symbol1,
        type: 'ERC-20' as const,
        symbol: null,
        icon_url: null,
        reputation: null,
      };

      return (
        <Flex flexWrap="wrap" columnGap={ 2 } rowGap={ 2 } alignItems="center" fontWeight={ 500 }>
          <Trans
            t={ tTx }
            i18nKey={ ACTION_KEYS[type] }
            values={{ amount0: formatBigNumber(BigNumber(data.amount0), locale), amount1: formatBigNumber(BigNumber(data.amount1), locale) }}
            components={{
              token0: <TokenEntity
                token={ token0 }
                noLink={ data.symbol0 === 'Ether' }
                noCopy
                noIcon
                noSymbol
                w="auto"
                maxW="200px"
                flexShrink={ 0 }
              />,
              token1: <TokenEntity
                token={ token1 }
                noLink={ data.symbol1 === 'Ether' }
                noCopy
                noIcon
                noSymbol
                w="auto"
                maxW="200px"
                flexShrink={ 0 }
              />,
              protocol: <Flex columnGap={ 2 }>
                <IconSvg name="uniswap" boxSize={ 5 } color="white" bgColor="#ff007a" borderRadius="full" p="2px"/>
                <chakra.span>Uniswap V3</chakra.span>
              </Flex>,
            }}
          />
        </Flex>
      );
    }
    case 'mint_nft': {
      const token = {
        address_hash: data.address,
        name: data.name,
        type: 'ERC-20' as const,
        symbol: null,
        icon_url: null,
        reputation: null,
      };
      return (
        <div>
          <Flex rowGap={ 2 } columnGap={ 2 } flexWrap="wrap" alignItems="center" whiteSpace="pre-wrap" fontWeight={ 500 }>
            <Trans
              t={ tTx }
              i18nKey="transactions.action_mint_nft"
              components={{
                token: <TokenEntity token={ token } noCopy w="auto" rowGap={ 2 }/>,
                address: <AddressEntity address={{ hash: data.to }} truncation="constant" noIcon noCopy/>,
              }}
            />
          </Flex>
          <Flex columnGap={ 1 } rowGap={ 2 } pl={ 3 } flexDirection="column" mt={ 2 } fontWeight={ 500 }>
            { data.ids.map((id: string) => (
              <Flex key={ data.address + id } whiteSpace="pre-wrap" columnGap={ 2 }>
                <Trans
                  t={ tTx }
                  i18nKey="transactions.action_nft_item"
                  components={{ nft: <NftEntity hash={ data.address } id={ id } w="min-content" variant="content"/> }}
                />
              </Flex>
            )) }
          </Flex>
        </div>
      );
    }
    default: return null;
  }
};

export default React.memo(TxDetailsAction);
