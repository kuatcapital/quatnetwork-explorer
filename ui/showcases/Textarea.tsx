// Modified by Quat Capital, 2026-10-28: runtime Russian and Kazakh showcase labels. GPL-3.0.
import { Box } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Field } from 'toolkit/chakra/field';
import { Textarea } from 'toolkit/chakra/textarea';

import { Section, Container, SectionHeader, SamplesStack, Sample } from './parts';
import { TEXT } from './utils';

const TextareaShowcase = () => {
  const { t } = useTranslation();

  return (
    <Container value="textarea">
      <Section>
        <SectionHeader>{ t('showcaseDisplay.variant') }</SectionHeader>
        <SamplesStack >
          <Sample label="variant: outline" w="360px">
            <Field label={ t('showcaseRemainder.description') } required floating size="2xl">
              <Textarea/>
            </Field>
            <Field label={ t('showcaseRemainder.description') } required floating size="2xl">
              <Textarea value={ TEXT }/>
            </Field>
            <Field label={ t('showcaseRemainder.description_invalid') } required floating invalid size="2xl">
              <Textarea value={ TEXT }/>
            </Field>
            <Field label={ t('showcaseRemainder.description_readonly') } required floating readOnly size="2xl">
              <Textarea value={ TEXT }/>
            </Field>
            <Field label={ t('showcaseRemainder.description_disabled') } required floating disabled size="2xl">
              <Textarea value={ TEXT }/>
            </Field>
            <Box bgColor={{ _light: 'blackAlpha.200', _dark: 'whiteAlpha.200' }} p={ 4 } borderRadius="base" w="100%">
              <Field label={ t('showcaseRemainder.description') } required floating size="2xl">
                <Textarea value={ TEXT }/>
              </Field>
            </Box>
          </Sample>
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(TextareaShowcase);
