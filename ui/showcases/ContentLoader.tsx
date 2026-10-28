// Modified by Quat Capital, 2026-10-28: runtime Russian and Kazakh showcase labels. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import { ContentLoader } from 'toolkit/components/loaders/ContentLoader';

import { Section, Container, SectionHeader, SamplesStack, Sample } from './parts';

const ContentLoaderShowcase = () => {
  const { t } = useTranslation();

  return (
    <Container value="content-loader">
      <Section>
        <SectionHeader>{ t('showcaseDisplay.variants') }</SectionHeader>
        <SamplesStack >
          <Sample label="default">
            <ContentLoader/>
          </Sample>
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(ContentLoaderShowcase);
