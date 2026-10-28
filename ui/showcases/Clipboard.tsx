// Modified by Quat Capital, 2026-10-28: runtime Russian and Kazakh showcase labels. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import CopyToClipboard from 'ui/shared/CopyToClipboard';

import { Section, Container, SectionHeader, SamplesStack, Sample } from './parts';

const ClipboardShowcase = () => {
  const { t } = useTranslation();

  return (
    <Container value="clipboard">
      <Section>
        <SectionHeader>{ t('showcaseDisplay.type') }</SectionHeader>
        <SamplesStack>
          <Sample label="type: text">
            <CopyToClipboard text="Hello, world!" type="text"/>
          </Sample>
          <Sample label="type: link">
            <CopyToClipboard text="Hello, world!" type="link"/>
          </Sample>
          <Sample label="type: share">
            <CopyToClipboard text="Hello, world!" type="share"/>
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>{ t('showcaseDisplay.loading') }</SectionHeader>
        <SamplesStack>
          <Sample label="loading: true">
            <CopyToClipboard text="Hello, world!" type="text" isLoading/>
          </Sample>
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(ClipboardShowcase);
