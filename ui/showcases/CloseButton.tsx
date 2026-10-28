// Modified by Quat Capital, 2026-10-28: runtime Russian and Kazakh showcase labels. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import { CloseButton } from 'toolkit/chakra/close-button';

import { Section, Container, SectionHeader, SamplesStack, Sample } from './parts';

const CloseButtonShowcase = () => {
  const { t } = useTranslation();

  return (
    <Container value="close-button">
      <Section>
        <SectionHeader>{ t('showcaseDisplay.variants') }</SectionHeader>
        <SamplesStack>
          <Sample label="variant: default">
            <CloseButton/>
            <CloseButton data-hover/>
            <CloseButton disabled/>
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>{ t('showcaseDisplay.size') }</SectionHeader>
        <SamplesStack>
          <Sample label="size: md">
            <CloseButton size="md" outline="1px dashed lightpink"/>
          </Sample>
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(CloseButtonShowcase);
