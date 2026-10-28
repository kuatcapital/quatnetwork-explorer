// Modified by Quat Capital, 2026-10-28: runtime Russian and Kazakh showcase labels. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Skeleton } from 'toolkit/chakra/skeleton';

import { Section, Container, SectionHeader, SamplesStack, Sample } from './parts';

const SkeletonShowcase = () => {
  const { t } = useTranslation();

  return (
    <Container value="skeleton">
      <Section>
        <SectionHeader>{ t('showcaseDisplay.variants') }</SectionHeader>
        <SamplesStack >
          <Sample label="default">
            <Skeleton loading>
              <span>{ t('showcaseDisplay.skeleton') }</span>
            </Skeleton>
          </Sample>
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(SkeletonShowcase);
