// Modified by Quat Capital, 2026-10-28: runtime Russian and Kazakh showcase labels. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Radio, RadioGroup } from 'toolkit/chakra/radio';

import { Section, Container, SectionHeader, SamplesStack, Sample } from './parts';

const RadioShowcase = () => {
  const { t } = useTranslation();

  return (
    <Container value="radio">
      <Section>
        <SectionHeader>{ t('showcaseDisplay.variant') }</SectionHeader>
        <SamplesStack>
          <Sample label="variant: subtle">
            <RadioGroup defaultValue="1">
              <Radio value="1">{ t('showcaseRemainder.option_1') }</Radio>
              <Radio value="2">{ t('showcaseRemainder.option_2') }</Radio>
            </RadioGroup>
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>{ t('showcaseDisplay.size') }</SectionHeader>
        <SamplesStack>
          <Sample label="size: xs">
            <RadioGroup defaultValue="1" size="xs">
              <Radio value="1">{ t('showcaseRemainder.option_1') }</Radio>
              <Radio value="2">{ t('showcaseRemainder.option_2') }</Radio>
            </RadioGroup>
          </Sample>
          <Sample label="size: sm">
            <RadioGroup defaultValue="1" size="sm">
              <Radio value="1">{ t('showcaseRemainder.option_1') }</Radio>
              <Radio value="2">{ t('showcaseRemainder.option_2') }</Radio>
            </RadioGroup>
          </Sample>
          <Sample label="size: md">
            <RadioGroup defaultValue="1" size="md">
              <Radio value="1">{ t('showcaseRemainder.option_1') }</Radio>
              <Radio value="2">{ t('showcaseRemainder.option_2') }</Radio>
            </RadioGroup>
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>{ t('showcaseRemainder.orientation') }</SectionHeader>
        <SamplesStack>
          <Sample label="orientation: horizontal">
            <RadioGroup defaultValue="1" orientation="horizontal">
              <Radio value="1">{ t('showcaseRemainder.option_1') }</Radio>
              <Radio value="2">{ t('showcaseRemainder.option_2') }</Radio>
            </RadioGroup>
          </Sample>
          <Sample label="orientation: vertical">
            <RadioGroup defaultValue="1" orientation="vertical">
              <Radio value="1">{ t('showcaseRemainder.option_1') }</Radio>
              <Radio value="2">{ t('showcaseRemainder.option_2') }</Radio>
            </RadioGroup>
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>{ t('showcaseRemainder.disabled') }</SectionHeader>
        <SamplesStack>
          <Sample label="disabled: true">
            <RadioGroup defaultValue="1" disabled>
              <Radio value="1">{ t('showcaseRemainder.option_1') }</Radio>
              <Radio value="2">{ t('showcaseRemainder.option_2') }</Radio>
            </RadioGroup>
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>{ t('showcaseRemainder.read_only') }</SectionHeader>
        <SamplesStack>
          <Sample label="readOnly: true">
            <RadioGroup defaultValue="1" readOnly>
              <Radio value="1">{ t('showcaseRemainder.option_1') }</Radio>
              <Radio value="2">{ t('showcaseRemainder.option_2') }</Radio>
            </RadioGroup>
          </Sample>
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(RadioShowcase);
