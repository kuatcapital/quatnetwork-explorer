// Modified by Quat Capital, 2026-10-28: runtime Russian and Kazakh showcase labels. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Field } from 'toolkit/chakra/field';
import { Input } from 'toolkit/chakra/input';

import { Section, Container, SectionHeader, SamplesStack, Sample, SectionSubHeader } from './parts';

const FieldShowcase = () => {
  const { t } = useTranslation();
  return (
    <Container value="field">
      <Section>
        <SectionHeader>{ t('showcaseDisplay.size') }</SectionHeader>
        <SectionSubHeader>{ t('showcaseDisplay.default') }</SectionSubHeader>
        <SamplesStack>
          { ([ 'sm', 'md', 'lg' ] as const).map((size) => (
            <Sample label={ `size: ${ size }` } w="100%" key={ size } alignItems="flex-start">
              <Field label={ t('showcaseRemainder.email') } required size={ size } helperText={ t('showcaseRemainder.helper') } maxWidth="200px">
                <Input/>
              </Field>
              <Field label={ t('showcaseRemainder.email_disabled') } required size={ size } maxWidth="200px">
                <Input disabled value="me@example.com"/>
              </Field>
              <Field label={ t('showcaseRemainder.email_readonly') } required size={ size } maxWidth="200px">
                <Input readOnly value="me@example.com"/>
              </Field>
              <Field label={ t('showcaseRemainder.email_invalid') } required size={ size } errorText={ t('showcaseRemainder.error') } invalid maxWidth="200px">
                <Input value="duck"/>
              </Field>
            </Sample>
          )) }

          <Sample label="size: xl" w="100%" alignItems="flex-start">
            <Field label={ t('showcaseRemainder.email') } required floating size="lg" helperText={ t('showcaseRemainder.helper') } maxWidth="300px">
              <Input/>
            </Field>
            <Field label={ t('showcaseRemainder.email_disabled') } required floating disabled size="lg" maxWidth="300px">
              <Input value="me@example.com"/>
            </Field>
            <Field label={ t('showcaseRemainder.email_readonly') } required floating readOnly size="lg" maxWidth="300px">
              <Input value="me@example.com"/>
            </Field>
            <Field
              label={ t('showcaseRemainder.email_invalid') } required floating size="lg"
              errorText={ t('showcaseRemainder.error') } invalid maxWidth="300px"
            >
              <Input value="duck"/>
            </Field>
          </Sample>
        </SamplesStack>

        <SectionSubHeader>{ t('showcaseRemainder.custom_background') }</SectionSubHeader>
        <SamplesStack>
          <Sample label={ t('showcaseRemainder.no_floating') } p={ 4 } bgColor={{ _light: 'blackAlpha.200', _dark: 'whiteAlpha.200' }} alignItems="flex-start">
            <Field label={ t('showcaseRemainder.email') } required helperText={ t('showcaseRemainder.helper') } maxWidth="200px">
              <Input/>
            </Field>
            <Field label={ t('showcaseRemainder.email_disabled') } required disabled maxWidth="200px">
              <Input value="me@example.com"/>
            </Field>
            <Field label={ t('showcaseRemainder.email_readonly') } required readOnly maxWidth="200px">
              <Input value="me@example.com"/>
            </Field>
            <Field label={ t('showcaseRemainder.email_invalid') } required errorText={ t('showcaseRemainder.error') } invalid maxWidth="200px">
              <Input value="duck"/>
            </Field>
          </Sample>
          <Sample label={ t('showcaseRemainder.floating') } p={ 4 } bgColor={{ _light: 'blackAlpha.200', _dark: 'whiteAlpha.200' }} alignItems="flex-start">
            <Field label={ t('showcaseRemainder.email') } required floating size="lg" helperText={ t('showcaseRemainder.helper') } maxWidth="300px">
              <Input/>
            </Field>
            <Field label={ t('showcaseRemainder.email_disabled') } required disabled floating size="lg" maxWidth="300px">
              <Input value="me@example.com"/>
            </Field>
            <Field label={ t('showcaseRemainder.email_readonly') } required readOnly floating size="lg" maxWidth="300px">
              <Input value="me@example.com"/>
            </Field>
            <Field
              label={ t('showcaseRemainder.email_invalid') } required floating size="lg"
              errorText={ t('showcaseRemainder.error') } invalid maxWidth="300px"
            >
              <Input value="duck"/>
            </Field>
          </Sample>
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(FieldShowcase);
