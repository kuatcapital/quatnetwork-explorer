// Modified by Quat Capital, 2026-10-28: runtime Russian and Kazakh showcase labels. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from 'toolkit/chakra/button';
import { PopoverRoot, PopoverTrigger, PopoverContent, PopoverBody } from 'toolkit/chakra/popover';

import { Section, Container, SectionHeader, SamplesStack, Sample } from './parts';

const PopoverShowcase = () => {
  const { t } = useTranslation();
  return (
    <Container value="popover">
      <Section>
        <SectionHeader>{ t('showcaseDisplay.size') }</SectionHeader>
        <SamplesStack>
          <Sample label="size: sm">
            <PopoverRoot>
              <PopoverTrigger>
                <Button variant="dropdown">{ t('showcaseRemainder.trigger') }</Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverBody>
                  { t('showcaseDisplay.popover') }
                </PopoverBody>
              </PopoverContent>
            </PopoverRoot>
          </Sample>
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(PopoverShowcase);
