// Modified by Quat Capital, 2026-10-28: runtime Russian and Kazakh showcase labels. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import { ProgressCircleRoot, ProgressCircleRing, ProgressCircleValueText } from 'toolkit/chakra/progress-circle';

import { Section, Container, SectionHeader, SamplesStack, Sample } from './parts';

const ProgressCircleShowcase = () => {
  const { t } = useTranslation();

  return (
    <Container value="progress-circle">
      <Section>
        <SectionHeader>{ t('showcaseDisplay.variant') }</SectionHeader>
        <SamplesStack >
          <Sample label="colorPalette: blue">
            <ProgressCircleRoot
              value={ 45 }
              colorPalette="blue"
            >
              <ProgressCircleRing/>
            </ProgressCircleRoot>
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>{ t('showcaseDisplay.size') }</SectionHeader>
        <SamplesStack >
          { ([ 'sm', 'md', 'lg' ] as const).map((size) => (
            <Sample key={ size } label={ `size: ${ size }` }>
              <ProgressCircleRoot
                value={ 45 }
                colorPalette="blue"
                size={ size }
              >
                <ProgressCircleRing/>
                { size === 'lg' && <ProgressCircleValueText/> }
              </ProgressCircleRoot>
            </Sample>
          )) }
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(ProgressCircleShowcase);
