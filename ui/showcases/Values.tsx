// Modified by Quat Capital, 2026-10-28: runtime Russian and Kazakh showcase labels. GPL-3.0.
import BigNumber from 'bignumber.js';
import React from 'react';
import { useTranslation } from 'react-i18next';

import AssetValue from 'ui/shared/value/AssetValue';
import GasPriceValue from 'ui/shared/value/GasPriceValue';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';
import SimpleValue from 'ui/shared/value/SimpleValue';
import TokenValue from 'ui/shared/value/TokenValue';

import { TOKEN } from './Link';
import { Section, Container, SectionHeader, SamplesStack, Sample, SectionSubHeader } from './parts';

const ValuesShowcase = () => {
  const { t } = useTranslation();
  // Keep one complete phrase so each language can place the value naturally.
  const [ beforeValue, afterValue ] = t('showcaseDisplay.get_duck', { value: '\uFFFC' }).split('\uFFFC');
  return (
    <Container value="values">
      <Section>
        <SectionHeader>SimpleValue</SectionHeader>
        <SectionSubHeader>{ t('showcaseDisplay.basic_examples') }</SectionSubHeader>
        <SamplesStack>
          <Sample label={ t('showcaseDisplay.big_value') }>
            <SimpleValue
              value={ BigNumber('1000000000000000000000000') }
              startElement={ beforeValue }
              endElement={ afterValue }
              maxW="400px"
            />
          </Sample>
          <Sample label={ t('showcaseDisplay.small_value') }>
            <SimpleValue
              value={ BigNumber(1).div('1000000000000000000') }
              prefix="$"
              maxW="400px"
            />
          </Sample>
          <Sample label={ t('showcaseDisplay.no_accuracy') }>
            <SimpleValue
              value={ BigNumber(1).div('1000000000000000000') }
              accuracy={ 0 }
              startElement={ beforeValue }
              endElement={ afterValue }
              maxW="400px"
            />
          </Sample>
        </SamplesStack>

        <SectionSubHeader>{ t('showcaseDisplay.overflowed') }</SectionSubHeader>
        <SamplesStack>
          <Sample label={ t('showcaseDisplay.big_value') }>
            <SimpleValue
              value={ BigNumber('1000000000000000000000000') }
              endElement="ETH"
              overflowed
              maxW="200px"
            />
          </Sample>
          <Sample label={ t('showcaseDisplay.small_value') }>
            <SimpleValue
              value={ BigNumber(1).div('1000000000000000000') }
              prefix="$"
              overflowed
              maxW="200px"
            />
          </Sample>
        </SamplesStack>

        <SectionSubHeader>{ t('showcaseDisplay.loading') }</SectionSubHeader>
        <SamplesStack>
          <Sample label="loading: true">
            <SimpleValue
              loading
              value={ BigNumber('1000000000000000000000000') }
              startElement={ beforeValue }
              endElement={ afterValue }
              maxW="400px"
            />
          </Sample>
        </SamplesStack>

      </Section>

      <Section>
        <SectionHeader>NativeCoinValue</SectionHeader>
        <SectionSubHeader>{ t('showcaseDisplay.units') }</SectionSubHeader>
        <SamplesStack>
          <Sample label="wei">
            <NativeCoinValue
              amount="1000000000000000000000000"
              units="wei"
              maxW="200px"
            />
          </Sample>
        </SamplesStack>
        <SamplesStack>
          <Sample label="gwei">
            <NativeCoinValue
              amount="1000000000000000000000000"
              units="gwei"
              maxW="200px"
            />
          </Sample>
        </SamplesStack>
        <SamplesStack>
          <Sample label="ether">
            <NativeCoinValue
              amount="1000000000000000000000000"
              units="ether"
              maxW="200px"
            />
          </Sample>
        </SamplesStack>

        <SectionSubHeader>{ t('showcaseDisplay.gwei_threshold') }</SectionSubHeader>
        <SamplesStack>
          <Sample label="gweiThreshold: undefined">
            <NativeCoinValue
              amount="100000000000"
              units="wei"
              maxW="200px"
            />
          </Sample>
          <Sample label="gweiThreshold: 5">
            <NativeCoinValue
              amount="100000000000"
              units="wei"
              gweiThreshold={ 5 }
              maxW="200px"
            />
          </Sample>
        </SamplesStack>

        <SectionSubHeader>{ t('showcaseDisplay.tooltip_units') }</SectionSubHeader>
        <SamplesStack>
          <Sample label="unitsTooltip: 'gwei'">
            <NativeCoinValue
              amount="100000000000"
              units="wei"
              unitsTooltip="gwei"
              maxW="200px"
            />
          </Sample>
        </SamplesStack>

        <SectionSubHeader>{ t('showcaseDisplay.layout') }</SectionSubHeader>
        <SamplesStack>
          <Sample label="horizontal">
            <NativeCoinValue
              amount="1000000000000000"
              exchangeRate="4200"
              layout="horizontal"
              maxW="200px"
            />
          </Sample>
          <Sample label="vertical">
            <NativeCoinValue
              amount="1000000000000000"
              exchangeRate="4200"
              layout="vertical"
              maxW="200px"
            />
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>TokenValue</SectionHeader>
        <SectionSubHeader>{ t('showcaseDisplay.examples') }</SectionSubHeader>
        <SamplesStack>
          <Sample label={ t('showcaseDisplay.convertible_token') }>
            <TokenValue amount="1000000000000000000000000" token={ TOKEN } maxW="400px"/>
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>AssetValue</SectionHeader>
        <SectionSubHeader>{ t('showcaseDisplay.layout') }</SectionSubHeader>
        <SamplesStack>
          <Sample label="horizontal">
            <AssetValue
              amount="1000000000000000000000000"
              asset="DUCK"
              decimals="6"
              exchangeRate="4200"
              maxW="400px"
            />
          </Sample>
          <Sample label="vertical">
            <AssetValue
              amount="1000000000000000000000000"
              asset="DUCK"
              decimals="6"
              exchangeRate="4200"
              maxW="250px"
              layout="vertical"
            />
          </Sample>
        </SamplesStack>

        <SectionSubHeader>{ t('showcaseDisplay.loading') }</SectionSubHeader>
        <SamplesStack>
          <Sample label="loading: true">
            <AssetValue
              amount="1000000000000000000000000"
              asset="DUCK"
              decimals="6"
              exchangeRate="4200"
              maxW="400px"
              loading
            />
            <AssetValue
              amount="1000000000000000000000000"
              asset="DUCK"
              decimals="6"
              exchangeRate="4200"
              maxW="300px"
              layout="vertical"
              loading
            />
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>GasPriceValue</SectionHeader>
        <SectionSubHeader>{ t('showcaseDisplay.examples') }</SectionSubHeader>
        <SamplesStack>
          <Sample label="default">
            <GasPriceValue
              amount="420000"
            />
          </Sample>
        </SamplesStack>
      </Section>

    </Container>
  );
};

export default React.memo(ValuesShowcase);
