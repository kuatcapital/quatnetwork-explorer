// Modified by Quat Capital, 2026-10-28: runtime Russian and Kazakh showcase labels. GPL-3.0.
import { noop } from 'es-toolkit';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from 'toolkit/chakra/button';
import { DialogActionTrigger, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogRoot, DialogTitle, DialogTrigger } from 'toolkit/chakra/dialog';

import { Section, Container, SectionHeader, SamplesStack, Sample } from './parts';
import { TEXT } from './utils';

const DialogShowcase = () => {
  const { t } = useTranslation();

  return (
    <Container value="dialog">
      <Section>
        <SectionHeader>{ t('showcaseDisplay.size') }</SectionHeader>
        <SamplesStack>
          <Sample label="size: sm">
            <DialogRoot size="sm">
              <DialogTrigger asChild>
                <Button size="sm">
                  { t('showcaseRemainder.open_dialog') }
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{ t('showcaseRemainder.dialog_title') }</DialogTitle>
                </DialogHeader>
                <DialogBody>
                  <p>{ TEXT }</p>
                </DialogBody>
                <DialogFooter>
                  <Button>{ t('showcaseRemainder.save') }</Button>
                  <DialogActionTrigger asChild>
                    <Button variant="link">{ t('showcaseRemainder.later') }</Button>
                  </DialogActionTrigger>
                </DialogFooter>
              </DialogContent>
            </DialogRoot>
          </Sample>

          <Sample label="size: md">
            <DialogRoot size="md">
              <DialogTrigger asChild>
                <Button size="sm">
                  { t('showcaseRemainder.open_dialog') }
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader onBackToClick={ noop }>
                  <DialogTitle>{ t('showcaseRemainder.dialog_title') }</DialogTitle>
                </DialogHeader>
                <DialogBody>
                  <p>{ TEXT }</p>
                </DialogBody>
                <DialogFooter>
                  <DialogActionTrigger asChild>
                    <Button variant="outline">{ t('showcaseRemainder.cancel') }</Button>
                  </DialogActionTrigger>
                  <Button>{ t('showcaseRemainder.save') }</Button>
                </DialogFooter>
              </DialogContent>
            </DialogRoot>
          </Sample>

          <Sample label="size: full">
            <DialogRoot size="full">
              <DialogTrigger asChild>
                <Button size="sm">
                  { t('showcaseRemainder.open_dialog') }
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{ t('showcaseRemainder.dialog_title') }</DialogTitle>
                </DialogHeader>
                <DialogBody>
                  <p>{ TEXT }</p>
                </DialogBody>
                <DialogFooter>
                  <DialogActionTrigger asChild>
                    <Button variant="outline">{ t('showcaseRemainder.cancel') }</Button>
                  </DialogActionTrigger>
                  <Button>{ t('showcaseRemainder.save') }</Button>
                </DialogFooter>
              </DialogContent>
            </DialogRoot>
          </Sample>
        </SamplesStack>
      </Section>

    </Container>
  );
};

export default React.memo(DialogShowcase);
