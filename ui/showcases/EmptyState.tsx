// Modified by Quat Capital, 2026-10-28: runtime Russian and Kazakh showcase labels. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import { EmptyState } from 'toolkit/chakra/empty-state';

import { Section, Container, SectionHeader, SamplesStack, Sample } from './parts';

const EmptyStateShowcase = () => {
  const { t } = useTranslation();
  return (
    <Container value="empty-state">
      <Section>
        <SectionHeader>{ t('showcaseDisplay.type') }</SectionHeader>
        <SamplesStack>
          <Sample label="type: query">
            <EmptyState term="transaction" outline="1px dashed deepskyblue"/>
          </Sample>
          <Sample label="type: stats">
            <EmptyState type="stats" term="transactions" outline="1px dashed deepskyblue"/>
          </Sample>
          <Sample label="type: coming_soon">
            <EmptyState type="coming_soon" outline="1px dashed deepskyblue"/>
          </Sample>
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(EmptyStateShowcase);
