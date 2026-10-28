// Modified by Quat Capital, 2026-10-28: runtime Russian and Kazakh showcase labels. GPL-3.0.
import { Spinner } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Section, Container, SectionHeader, SamplesStack, Sample, SectionSubHeader } from './parts';

const SpinnerShowcase = () => {
  const { t } = useTranslation();

  return (
    <Container value="spinner">
      <Section>
        <SectionHeader>{ t('showcaseDisplay.spinner') }</SectionHeader>
        <SectionSubHeader>{ t('showcaseDisplay.sizes') }</SectionSubHeader>
        <SamplesStack>
          { ([ 'xs', 'sm', 'md', 'lg', 'xl' ] as const).map((size) => (
            <Sample key={ size } label={ `size: ${ size }` }>
              <Spinner size={ size }/>
            </Sample>
          )) }
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(SpinnerShowcase);
