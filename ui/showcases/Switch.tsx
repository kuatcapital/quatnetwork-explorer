// Modified by Quat Capital, 2026-10-28: runtime Russian and Kazakh showcase labels. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Switch } from 'toolkit/chakra/switch';

import { Section, Container, SectionHeader, SamplesStack, Sample } from './parts';

const SwitchShowcase = () => {
  const { t } = useTranslation();

  return (
    <Container value="switch">
      <Section>
        <SectionHeader>{ t('showcaseDisplay.size') }</SectionHeader>
        <SamplesStack>
          <Sample label="size: sm">
            <Switch size="sm">
              { t('showcaseRemainder.show_duck') }
            </Switch>
          </Sample>
          <Sample label="size: md">
            <Switch size="md">
              { t('showcaseRemainder.show_duck') }
            </Switch>
          </Sample>
          <Sample label="size: lg">
            <Switch size="lg" defaultChecked>
              { t('showcaseRemainder.show_duck') }
            </Switch>
          </Sample>
        </SamplesStack>
      </Section>
      <Section>
        <SectionHeader>{ t('showcaseRemainder.disabled') }</SectionHeader>
        <SamplesStack>
          <Sample label="disabled: true">
            <Switch disabled>
              { t('showcaseRemainder.show_duck') }
            </Switch>
          </Sample>
        </SamplesStack>
      </Section>
      <Section>
        <SectionHeader>{ t('showcaseRemainder.direction') }</SectionHeader>
        <SamplesStack>
          <Sample label="direction: rtl">
            <Switch size="sm" direction="rtl">
              { t('showcaseRemainder.show_duck') }
            </Switch>
          </Sample>
          <Sample label="direction: ltr">
            <Switch size="md" direction="ltr">
              { t('showcaseRemainder.show_duck') }
            </Switch>
          </Sample>
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(SwitchShowcase);
