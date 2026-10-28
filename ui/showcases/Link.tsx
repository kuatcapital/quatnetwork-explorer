// Modified by Quat Capital, 2026-10-28: runtime Russian and Kazakh showcase labels. GPL-3.0.
import { Box } from '@chakra-ui/react';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import type { TokenInfo } from 'types/api/token';

import * as addressMock from 'mocks/address/address';
import * as implementationsMock from 'mocks/address/implementations';
import * as blobsMock from 'mocks/blobs/blobs';
import * as blockMock from 'mocks/blocks/block';
import * as ensMock from 'mocks/ens/domain';
import * as poolMock from 'mocks/pools/pool';
import * as txMock from 'mocks/txs/tx';
import { Link, LinkBox, LinkOverlay } from 'toolkit/chakra/link';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import BlobEntity from 'ui/shared/entities/blob/BlobEntity';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import EnsEntity from 'ui/shared/entities/ens/EnsEntity';
import NftEntity from 'ui/shared/entities/nft/NftEntity';
import PoolEntity from 'ui/shared/entities/pool/PoolEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';

import { Section, Container, SectionHeader, SamplesStack, Sample, SectionSubHeader } from './parts';

export const TOKEN = {
  address_hash: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  circulating_market_cap: '139446916652.6728',
  decimals: '6',
  exchange_rate: '0.999921',
  holders_count: '8348277',
  icon_url: 'https://assets.coingecko.com/coins/images/325/small/Tether.png?1696501661',
  name: 'Tether',
  symbol: 'USDT',
  total_supply: '76923002799740785',
  type: 'ERC-20' as const,
  reputation: 'ok' as const,
} satisfies TokenInfo;

const LinkShowcase = () => {
  const { t } = useTranslation();

  return (
    <Container value="link">

      <Section title={ t('showcaseDisplay.variants') }>
        <SectionHeader>{ t('showcaseDisplay.variants') }</SectionHeader>
        <SamplesStack>
          <Sample label="variant: primary">
            <Link href="/blocks" variant="primary">{ t('showcaseDisplay.default') }</Link>
            <Link href="/" variant="primary" data-hover>{ t('showcaseDisplay.hover') }</Link>
          </Sample>
          <Sample label="variant: secondary">
            <Link href="/" variant="secondary">{ t('showcaseDisplay.default') }</Link>
            <Link href="/" variant="secondary" data-hover>{ t('showcaseDisplay.hover') }</Link>
          </Sample>
          <Sample label="variant: subtle">
            <Link href="/" variant="subtle">{ t('showcaseDisplay.default') }</Link>
            <Link href="/" variant="subtle" data-hover>{ t('showcaseDisplay.hover') }</Link>
          </Sample>
          <Sample label="variant: navigation">
            <Link href="/" variant="navigation" p={ 2 } borderRadius="base">{ t('showcaseDisplay.default') }</Link>
            <Link href="/" variant="navigation" p={ 2 } borderRadius="base" data-hover>{ t('showcaseDisplay.hover') }</Link>
            <Link href="/" variant="navigation" p={ 2 } borderRadius="base" data-selected>{ t('showcaseDisplay.selected') }</Link>
            <Link href="/" variant="navigation" p={ 2 } borderRadius="base" data-active>{ t('showcaseDisplay.active') }</Link>
          </Sample>
          <Sample label="variant: underlaid">
            <Link href="/" variant="underlaid" external>{ t('showcaseDisplay.default') }</Link>
            <Link href="/" variant="underlaid" external data-hover>{ t('showcaseDisplay.hover') }</Link>
          </Sample>
          <Sample label="variant: menu">
            <Link href="/" variant="menu">{ t('showcaseDisplay.default') }</Link>
            <Link href="/" variant="menu" data-hover>{ t('showcaseDisplay.hover') }</Link>
          </Sample>
        </SamplesStack>
      </Section>

      <Section title={ t('showcaseDisplay.loading') }>
        <SectionHeader>{ t('showcaseDisplay.loading') }</SectionHeader>
        <SamplesStack>
          <Sample label="loading: true, variant: primary">
            <Link href="/" loading>{ t('showcaseDisplay.hello_three') }</Link>
            <span><Trans i18nKey="showcaseDisplay.within_link" components={{ link: <Link loading/> }}/></span>
          </Sample>
          <Sample label="loading: true, variant: underlaid">
            <Link href="/" loading variant="underlaid">{ t('showcaseDisplay.hello_three') }</Link>
            <span><Trans i18nKey="showcaseDisplay.within_link_double" components={{ link: <Link loading variant="underlaid"/> }}/></span>
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>{ t('showcaseDisplay.examples') }</SectionHeader>

        <SectionSubHeader>{ t('showcaseDisplay.address_link') }</SectionSubHeader>
        <SamplesStack>
          <Sample label={ t('showcaseDisplay.without_name') } vertical>
            <AddressEntity address={ addressMock.withoutName }/>
            <AddressEntity address={ addressMock.withoutName } link={{ external: true }}/>
            <AddressEntity address={{ ...addressMock.filecoin, name: null }}/>
            <Box maxW="200px">
              <AddressEntity address={ addressMock.withoutName }/>
            </Box>
            <AddressEntity address={ addressMock.withoutName } isLoading/>
          </Sample>
          <Sample label="Variant: content, subheading" vertical>
            <AddressEntity address={ addressMock.withoutName } variant="content"/>
            <AddressEntity address={ addressMock.withoutName } variant="subheading"/>
          </Sample>
          <Sample label={ t('showcaseDisplay.with_name') } vertical>
            <AddressEntity address={ addressMock.withName }/>
            <AddressEntity address={ addressMock.withNameTag }/>
            <AddressEntity address={ addressMock.withEns }/>
            <Box maxW="150px">
              <AddressEntity address={ addressMock.withEns }/>
            </Box>
          </Sample>
          <Sample label={ t('showcaseDisplay.contract') } vertical>
            <AddressEntity address={{ ...addressMock.contract, is_verified: false, name: null, implementations: [] }}/>
            <AddressEntity address={{ ...addressMock.contract, implementations: [] }}/>
            <AddressEntity address={{ ...addressMock.contract, implementations: implementationsMock.multiple }}/>
            <AddressEntity address={ addressMock.contract }/>
          </Sample>
        </SamplesStack>

        <SectionSubHeader>{ t('showcaseDisplay.token_link') }</SectionSubHeader>
        <SamplesStack>
          <Sample label={ t('showcaseDisplay.with_info') } vertical w="100%">
            <TokenEntity token={ TOKEN }/>
            <Box maxW="200px">
              <TokenEntity token={{ ...TOKEN, name: 'Token with very very very long name' }} noSymbol/>
            </Box>
            <Box maxW="300px">
              <TokenEntity token={{ ...TOKEN, symbol: 'Token with very very very long symbol' }}/>
            </Box>
            <TokenEntity token={ TOKEN } jointSymbol/>
            <TokenEntity token={ TOKEN } onlySymbol/>
            <TokenEntity token={ TOKEN } isLoading/>
          </Sample>
          <Sample label={ t('showcaseDisplay.partial_info') } vertical w="100%">
            <TokenEntity token={{ ...TOKEN, icon_url: null }}/>
            <TokenEntity token={{ ...TOKEN, icon_url: null, name: null, symbol: null }}/>
          </Sample>
          <Sample label="Variant: content, subheading" vertical w="100%">
            <TokenEntity token={ TOKEN } variant="content"/>
            <TokenEntity token={ TOKEN } variant="subheading" jointSymbol/>
          </Sample>
        </SamplesStack>

        <SectionSubHeader>{ t('showcaseDisplay.tx_link') }</SectionSubHeader>
        <SamplesStack>
          <Sample label={ t('showcaseDisplay.default') } vertical w="100%">
            <TxEntity hash={ txMock.base.hash }/>
            <TxEntity hash={ txMock.base.hash } link={{ external: true }}/>
            <Box maxW="200px">
              <TxEntity hash={ txMock.base.hash }/>
            </Box>
            <TxEntity hash={ txMock.base.hash } isLoading/>
          </Sample>
        </SamplesStack>

        <SectionSubHeader>{ t('showcaseDisplay.block_link') }</SectionSubHeader>
        <SamplesStack>
          <Sample label={ t('showcaseDisplay.default') } vertical w="100%">
            <BlockEntity number={ blockMock.base.height }/>
            <BlockEntity number={ blockMock.base.height } link={{ external: true }} icon={{ name: 'txn_batches' }}/>
            <Box maxW="150px">
              <BlockEntity number={ 1234567890123456 }/>
            </Box>
            <BlockEntity number={ blockMock.base.height } isLoading/>
          </Sample>
        </SamplesStack>

        <SectionSubHeader>{ t('showcaseDisplay.nft_link') }</SectionSubHeader>
        <SamplesStack>
          <Sample label={ t('showcaseDisplay.default') } vertical w="100%">
            <NftEntity id="42" hash={ TOKEN.address_hash }/>
            <Box maxW="250px">
              <NftEntity id="32925298983216553915666621415831103694597106215670571463977478984525997408266" hash={ TOKEN.address_hash }/>
            </Box>
            <NftEntity id="4200000" hash={ TOKEN.address_hash } isLoading/>
          </Sample>
        </SamplesStack>

        <SectionSubHeader>{ t('showcaseDisplay.ens_link') }</SectionSubHeader>
        <SamplesStack>
          <Sample label={ t('showcaseDisplay.default') } vertical w="100%">
            <EnsEntity domain={ ensMock.ensDomainA.name } protocol={ ensMock.ensDomainA.protocol }/>
            <Box maxW="150px">
              <EnsEntity domain={ ensMock.ensDomainB.name } protocol={ ensMock.ensDomainB.protocol }/>
            </Box>
            <EnsEntity domain={ ensMock.ensDomainA.name } protocol={ ensMock.ensDomainA.protocol } isLoading/>
          </Sample>
          <Sample label="Variant: content, subheading" vertical w="100%">
            <EnsEntity domain={ ensMock.ensDomainA.name } protocol={ ensMock.ensDomainA.protocol } variant="content"/>
            <EnsEntity domain={ ensMock.ensDomainA.name } protocol={ ensMock.ensDomainA.protocol } variant="subheading"/>
          </Sample>
        </SamplesStack>

        <SectionSubHeader>{ t('showcaseDisplay.blob_link') }</SectionSubHeader>
        <SamplesStack>
          <Sample label={ t('showcaseDisplay.default') } vertical w="100%">
            <BlobEntity hash={ blobsMock.base1.hash }/>
            <Box maxW="200px">
              <BlobEntity hash={ blobsMock.base1.hash } link={{ external: true }}/>
            </Box>
            <BlobEntity hash={ blobsMock.base1.hash } isLoading/>
          </Sample>
        </SamplesStack>

        <SectionSubHeader>{ t('showcaseDisplay.pool_link') }</SectionSubHeader>
        <SamplesStack>
          <Sample label={ t('showcaseDisplay.default') } vertical w="100%">
            <PoolEntity pool={{
              ...poolMock.base,
              base_token_icon_url: 'https://coin-images.coingecko.com/coins/images/39926/large/usds.webp?1726666683',
              quote_token_icon_url: 'https://coin-images.coingecko.com/coins/images/39925/large/sky.jpg?1724827980',
            }}/>
            <Box maxW="150px">
              <PoolEntity pool={ poolMock.noIcons } link={{ external: true }}/>
            </Box>
            <PoolEntity pool={ poolMock.noIcons } isLoading/>
          </Sample>
        </SamplesStack>

        <SectionSubHeader>{ t('showcaseDisplay.link_overlay') }</SectionSubHeader>
        <SamplesStack>
          <Sample label={ t('showcaseDisplay.internal_link') }>
            <LinkBox p={ 2 } display="flex" flexDirection="column" columnGap={ 2 } borderWidth="1px" borderColor="border.divider" borderRadius="base">
              <LinkOverlay href="/blocks">{ t('showcaseDisplay.main_link') }</LinkOverlay>
              <Link href="/txs">{ t('showcaseDisplay.inner_link') }</Link>
            </LinkBox>
          </Sample>
          <Sample label={ t('showcaseDisplay.external_link') }>
            <LinkBox p={ 2 } display="flex" flexDirection="column" columnGap={ 2 } borderWidth="1px" borderColor="border.divider" borderRadius="base">
              <LinkOverlay href="https://blockscout.com" external>{ t('showcaseDisplay.main_link') }</LinkOverlay>
              <Link href="https://blockscout.com/txs" external>{ t('showcaseDisplay.inner_link') }</Link>
            </LinkBox>
          </Sample>
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(LinkShowcase);
