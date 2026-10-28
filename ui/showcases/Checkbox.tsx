// Modified by Quat Capital, 2026-10-28: runtime Russian and Kazakh showcase labels. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Checkbox, CheckboxGroup } from 'toolkit/chakra/checkbox';

import { Section, Container, SectionHeader, SamplesStack, Sample } from './parts';

const CheckboxShowcase = () => {
  const { t } = useTranslation();

  return (
    <Container value="checkbox">
      <Section>
        <SectionHeader>{ t('showcaseDisplay.variant') }</SectionHeader>
        <SamplesStack>
          <Sample label="variant: subtle">
            <Checkbox>{ t('showcaseRemainder.option_1') }</Checkbox>
            <Checkbox checked>{ t('showcaseRemainder.option_2') }</Checkbox>
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>{ t('showcaseDisplay.size') }</SectionHeader>
        <SamplesStack>
          <Sample label="size: md">
            <Checkbox size="md">{ t('showcaseRemainder.option_1') }</Checkbox>
            <Checkbox size="md">{ t('showcaseRemainder.option_2') }</Checkbox>
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>{ t('showcaseRemainder.disabled') }</SectionHeader>
        <SamplesStack>
          <Sample label="disabled: true">
            <Checkbox disabled>{ t('showcaseRemainder.option_1') }</Checkbox>
            <Checkbox checked disabled>{ t('showcaseRemainder.option_2') }</Checkbox>
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>{ t('showcaseRemainder.read_only') }</SectionHeader>
        <SamplesStack>
          <Sample label="readOnly: true">
            <Checkbox readOnly>{ t('showcaseRemainder.option_1') }</Checkbox>
            <Checkbox checked readOnly>{ t('showcaseRemainder.option_2') }</Checkbox>
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>{ t('showcaseRemainder.orientation') }</SectionHeader>
        <SamplesStack>
          <Sample label="orientation: vertical">
            <CheckboxGroup orientation="vertical">
              <Checkbox value="1">{ t('showcaseRemainder.option_1') }</Checkbox>
              <Checkbox value="2">{ t('showcaseRemainder.option_2') }</Checkbox>
            </CheckboxGroup>
          </Sample>
          <Sample label="orientation: horizontal">
            <CheckboxGroup orientation="horizontal">
              <Checkbox value="1">{ t('showcaseRemainder.option_1') }</Checkbox>
              <Checkbox value="2">{ t('showcaseRemainder.option_2') }</Checkbox>
            </CheckboxGroup>
          </Sample>
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(CheckboxShowcase);
