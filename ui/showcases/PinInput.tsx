// Modified by Quat Capital, 2026-10-28: runtime Russian and Kazakh showcase labels. GPL-3.0.
import { Box } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { PinInput } from 'toolkit/chakra/pin-input';

import { Section, Container, SectionHeader, SamplesStack, Sample } from './parts';

const PinInputShowcase = () => {
  const { t } = useTranslation();

  return (
    <Container value="pin-input">
      <Section>
        <SectionHeader>{ t('showcaseDisplay.variant') }</SectionHeader>
        <SamplesStack >
          <Sample label="variant: outline">
            <PinInput otp count={ 3 }/>
            <Box bgColor={{ _light: 'blackAlpha.200', _dark: 'whiteAlpha.200' }} p={ 2 } borderRadius="base" w="100%">
              <PinInput otp count={ 3 } value={ [ '1', '2', '3' ] }/>
            </Box>
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>{ t('showcaseRemainder.disabled') }</SectionHeader>
        <SamplesStack >
          <Sample label="disabled: true">
            <PinInput otp count={ 3 } disabled value={ [ '1', '2', '3' ] }/>
            <Box bgColor={{ _light: 'blackAlpha.200', _dark: 'whiteAlpha.200' }} p={ 2 } borderRadius="base" w="100%">
              <PinInput otp count={ 3 } disabled value={ [ '1', '2', '3' ] }/>
            </Box>
          </Sample>
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(PinInputShowcase);
