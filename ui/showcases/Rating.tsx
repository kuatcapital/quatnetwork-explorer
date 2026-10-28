// Modified by Quat Capital, 2026-10-28: runtime Russian and Kazakh showcase labels. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Rating } from 'toolkit/chakra/rating';

import { Section, Container, SectionHeader, SamplesStack, Sample } from './parts';

const RatingShowcase = () => {
  const { t } = useTranslation();
  const labels = React.useMemo(() => [
    t('showcaseRemainder.very_bad'),
    t('showcaseRemainder.bad'),
    t('showcaseRemainder.average'),
    t('showcaseRemainder.good'),
    t('showcaseRemainder.excellent'),
  ], [ t ]);
  return (
    <Container value="rating">
      <Section>
        <SectionHeader>{ t('showcaseDisplay.size') }</SectionHeader>
        <SamplesStack>
          <Sample label="size: md">
            <Rating defaultValue={ 3 } label={ labels }/>
          </Sample>
        </SamplesStack>
      </Section>
      <Section>
        <SectionHeader>{ t('showcaseRemainder.read_only') }</SectionHeader>
        <SamplesStack>
          <Sample label="readOnly: true">
            <Rating defaultValue={ 3 } label={ labels } readOnly/>
          </Sample>
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(RatingShowcase);
