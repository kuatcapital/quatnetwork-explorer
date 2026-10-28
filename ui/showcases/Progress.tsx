// Modified by Quat Capital, 2026-10-28: runtime Russian and Kazakh showcase labels. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Progress } from 'toolkit/chakra/progress';

import { Section, Container, SectionHeader, SamplesStack, Sample } from './parts';

const ProgressShowcase = () => {
  const { t } = useTranslation();

  return (
    <Container value="progress">
      <Section>
        <SectionHeader>{ t('showcaseDisplay.size') }</SectionHeader>
        <SamplesStack >
          { ([ 'sm', 'md', 'lg', 'xl' ] as const).map((size) => (
            <Sample key={ size } label={ `size: ${ size }` }>
              <Progress
                w="200px"
                min={ 0 }
                max={ 100 }
                value={ 45 }
                size={ size }
              />
            </Sample>
          )) }
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(ProgressShowcase);
