// Modified by Quat Capital, 2026-10-28: runtime Russian and Kazakh showcase labels. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Tooltip } from 'toolkit/chakra/tooltip';
import Utilization from 'ui/shared/Utilization/Utilization';

import { Section, Container, SectionHeader, SamplesStack, Sample } from './parts';

const TooltipShowcase = () => {
  const { t } = useTranslation();
  return (
    <Container value="tooltip">
      <Section>
        <SectionHeader>{ t('showcaseDisplay.variant') }</SectionHeader>
        <SamplesStack>
          <Sample label="variant: regular">
            <Tooltip content={ t('showcaseRemainder.tooltip_content') }>
              <span>{ t('showcaseDisplay.default') }</span>
            </Tooltip>
            <Tooltip content={ t('showcaseRemainder.tooltip_content') } interactive>
              <Utilization value={ 0.5 }/>
            </Tooltip>
          </Sample>
          <Sample label="variant: popover">
            <Tooltip content={ t('showcaseRemainder.tooltip_content') } variant="popover">
              <span>{ t('showcaseDisplay.default') }</span>
            </Tooltip>
          </Sample>
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(TooltipShowcase);
