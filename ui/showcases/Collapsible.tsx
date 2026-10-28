// Modified by Quat Capital, 2026-10-28: runtime Russian and Kazakh showcase labels. GPL-3.0.
/* eslint-disable react/jsx-no-bind */
import { Box, Text } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { CollapsibleDetails, CollapsibleList } from 'toolkit/chakra/collapsible';

import { Section, Container, SectionHeader, SamplesStack, Sample, SectionSubHeader } from './parts';
import { TEXT } from './utils';

const CollapsibleShowcase = () => {
  const { t } = useTranslation();
  return (
    <Container value="collapsible">
      <Section>
        <SectionHeader>{ t('showcaseDisplay.variant') }</SectionHeader>
        <SamplesStack >
          <Sample label="variant: default" flexDirection="column" alignItems="flex-start">
            <CollapsibleDetails id="CutLink_1">
              <Box maxW="500px">{ TEXT }</Box>
            </CollapsibleDetails>
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>{ t('showcaseDisplay.loading') }</SectionHeader>
        <SamplesStack >
          <Sample label="loading: true" flexDirection="column" alignItems="flex-start">
            <CollapsibleDetails id="CutLink_2" loading>
              <Box maxW="500px">{ TEXT }</Box>
            </CollapsibleDetails>
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>{ t('showcaseDisplay.examples') }</SectionHeader>

        <SectionSubHeader>{ t('showcaseRemainder.cut_link') }</SectionSubHeader>
        <SamplesStack>
          <Sample label={ t('showcaseRemainder.show_details') } flexDirection="column" alignItems="flex-start">
            <CollapsibleDetails id="CutLink_3">
              <Box maxW="500px">{ TEXT }</Box>
            </CollapsibleDetails>
          </Sample>
          <Sample label={ t('showcaseRemainder.expand_list') } flexDirection="row" alignItems="flex-start" flexWrap="nowrap">
            <CollapsibleList
              items={ [ 'foo', 'bar', 'baz', 'qux', 'quux', 'corgi', 'gaunt', 'garply', 'waldo', 'fred', 'pugh', 'fuzzy', 'thud' ] }
              renderItem={ (item) => <Text>{ item }</Text> }
            />
          </Sample>
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(CollapsibleShowcase);
