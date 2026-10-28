// Modified by Quat Capital, 2026-10-28: runtime Russian and Kazakh showcase labels. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Field } from 'toolkit/chakra/field';
import { Input } from 'toolkit/chakra/input';
import { InputGroup } from 'toolkit/chakra/input-group';
import { FilterInput } from 'toolkit/components/filters/FilterInput';
import IconSvg from 'ui/shared/IconSvg';

import { Section, Container, SectionHeader, SamplesStack, Sample, SectionSubHeader } from './parts';

const InputShowcase = () => {
  const { t } = useTranslation();
  return (
    <Container value="input">
      <Section>
        <SectionHeader>{ t('showcaseDisplay.size') }</SectionHeader>
        <SamplesStack>
          <Sample label="size: sm">
            <Input type="text" placeholder={ t('showcaseRemainder.name') } size="sm"/>
          </Sample>
          <Sample label="size: md">
            <Input type="text" placeholder={ t('showcaseRemainder.name') } size="md"/>
          </Sample>
          <Sample label="size: lg">
            <Input type="text" placeholder={ t('showcaseRemainder.name') } size="lg"/>
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>{ t('showcaseDisplay.variant') }</SectionHeader>
        <SamplesStack>
          <Sample label="variant: outline" maxW="300px">
            <Input type="text" placeholder={ t('showcaseRemainder.name') }/>
            <Input type="text" placeholder={ t('showcaseRemainder.name_disabled') } disabled/>
            <Input type="text" placeholder={ t('showcaseRemainder.name_readonly') } readOnly/>
            <Input type="text" placeholder={ t('showcaseRemainder.name_invalid') } data-invalid/>
            <Input type="text" placeholder={ t('showcaseRemainder.name_invalid') } data-invalid value="duck"/>
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>{ t('showcaseRemainder.input_group') }</SectionHeader>
        <SamplesStack>
          <Sample label={ t('showcaseRemainder.with_end') }>
            <Field label={ t('showcaseRemainder.referral') } required floating size="lg" w="300px" flexShrink={ 0 }>
              <InputGroup endElement={ <IconSvg name="copy" boxSize={ 5 }/> } endElementProps={{ px: 3 }}>
                <Input/>
              </InputGroup>
            </Field>
          </Sample>
          <Sample label={ t('showcaseRemainder.with_start') }>
            <InputGroup startElement={ <IconSvg name="collection" boxSize={ 5 }/> } startElementProps={{ px: 2 }}>
              <Input placeholder={ t('showcaseRemainder.type_something') }/>
            </InputGroup>
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>{ t('showcaseDisplay.examples') }</SectionHeader>
        <SectionSubHeader>{ t('showcaseRemainder.filter_input') }</SectionSubHeader>
        <SamplesStack>
          <Sample>
            <FilterInput placeholder={ t('showcaseRemainder.search_method') }/>
            <FilterInput placeholder={ t('showcaseRemainder.search_method') } loading/>
          </Sample>
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(InputShowcase);
