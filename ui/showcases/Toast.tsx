// Modified by Quat Capital, 2026-10-28: runtime Russian and Kazakh showcase labels. GPL-3.0.
/* eslint-disable react/jsx-no-bind */
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from 'toolkit/chakra/button';
import { toaster } from 'toolkit/chakra/toaster';

import { Section, Container, SectionHeader, SamplesStack, Sample } from './parts';
import { TEXT } from './utils';

const ToastShowcase = () => {
  const { t } = useTranslation();
  return (
    <Container value="toast">
      <Section>
        <SectionHeader>{ t('showcaseDisplay.type') }</SectionHeader>
        <SamplesStack>
          <Sample label="type: info">
            <Button onClick={ () => toaster.create({ title: t('showcaseRemainder.info'), description: TEXT.slice(0, 100), type: 'info' }) }>
              { t('showcaseRemainder.info') }
            </Button>
          </Sample>
          <Sample label="type: success">
            <Button onClick={ () => toaster.success({ title: t('showcaseDisplay.success'), description: t('showcaseRemainder.toast_content') }) }>
              { t('showcaseDisplay.success') }
            </Button>
          </Sample>
          <Sample label="type: warning">
            <Button onClick={ () => toaster.create({
              title: t('showcaseRemainder.warning'), description: t('showcaseRemainder.toast_content'), type: 'warning',
            }) }>
              { t('showcaseRemainder.warning') }
            </Button>
          </Sample>
          <Sample label="type: error">
            <Button onClick={ () => toaster.error({ title: t('showcaseRemainder.error_title'), description: t('showcaseRemainder.toast_content') }) }>
              { t('showcaseRemainder.error_title') }
            </Button>
          </Sample>
          <Sample label="type: loading">
            <Button onClick={ () => toaster.loading({ title: t('showcaseDisplay.loading'), description: t('showcaseRemainder.please_wait') }) }>
              { t('showcaseDisplay.loading') }
            </Button>
          </Sample>
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(ToastShowcase);
