// Modified by Quat Capital, 2026-10-28: runtime Russian and Kazakh showcase labels. GPL-3.0.
import { Box } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Alert } from 'toolkit/chakra/alert';
import { Link } from 'toolkit/chakra/link';
import { TableBody, TableColumnHeader, TableHeader, TableRoot, TableRow } from 'toolkit/chakra/table';
import * as SocketNewItemsNotice from 'ui/shared/SocketNewItemsNotice';
import TxPendingAlert from 'ui/tx/TxPendingAlert';

import { Section, Container, SectionHeader, SamplesStack, Sample, SectionSubHeader } from './parts';

const AlertShowcase = () => {
  const { t } = useTranslation();
  return (
    <Container value="alert">
      <Section>
        <SectionHeader>{ t('showcaseRemainder.status') }</SectionHeader>
        <SamplesStack>
          <Sample label="status: info">
            <Alert status="info" title={ t('showcaseRemainder.info') }> { t('showcaseRemainder.alert_content') } </Alert>
          </Sample>
          <Sample label="status: warning">
            <Alert status="warning" title={ t('showcaseRemainder.warning') }> { t('showcaseRemainder.alert_content') } </Alert>
          </Sample>
          <Sample label="status: success">
            <Alert status="success" title={ t('showcaseDisplay.success') }> { t('showcaseRemainder.alert_content') } </Alert>
          </Sample>
          <Sample label="status: error">
            <Alert status="error" title={ t('showcaseRemainder.error_title') }> { t('showcaseRemainder.alert_content') } </Alert>
          </Sample>
        </SamplesStack>
      </Section>
      <Section>
        <SectionHeader>{ t('showcaseDisplay.variant') }</SectionHeader>
        <SamplesStack>
          <Sample label="variant: subtle">
            <Alert status="info" title={ t('showcaseRemainder.info') } showIcon> { t('showcaseRemainder.alert_content') } </Alert>
          </Sample>
        </SamplesStack>
      </Section>
      <Section>
        <SectionHeader>{ t('showcaseDisplay.size') }</SectionHeader>
        <SamplesStack>
          <Sample label="size: sm">
            <Alert status="info" title={ t('showcaseRemainder.info') } showIcon size="sm" closable> { t('showcaseRemainder.alert_content') } </Alert>
          </Sample>
          <Sample label="size: md">
            <Alert status="info" title={ t('showcaseRemainder.info') } showIcon size="md"> { t('showcaseRemainder.alert_content') } </Alert>
          </Sample>
        </SamplesStack>
      </Section>
      <Section>
        <SectionHeader>{ t('showcaseDisplay.closable') }</SectionHeader>
        <SamplesStack>
          <Sample label="closable">
            <Alert status="info" title={ t('showcaseRemainder.info') } showIcon closable> { t('showcaseRemainder.alert_content') } </Alert>
          </Sample>
        </SamplesStack>
      </Section>
      <Section>
        <SectionHeader>{ t('showcaseDisplay.loading') }</SectionHeader>
        <SamplesStack>
          <Sample label="loading: true">
            <Alert status="info" title={ t('showcaseRemainder.info') } loading> { t('showcaseRemainder.alert_content') } </Alert>
          </Sample>
        </SamplesStack>
      </Section>
      <Section>
        <SectionHeader>{ t('showcaseDisplay.examples') }</SectionHeader>
        <SectionSubHeader>{ t('showcaseRemainder.as_link') }</SectionSubHeader>
        <SamplesStack>
          <Sample>
            <Link href="/" asChild>
              <Alert status="info" title={ t('showcaseRemainder.info') }> { t('showcaseRemainder.alert_content') } </Alert>
            </Link>
          </Sample>
        </SamplesStack>
        <SectionSubHeader>{ t('showcaseRemainder.inside_table') }</SectionSubHeader>
        <SamplesStack>
          <Sample label="loading">
            <TableRoot tableLayout="auto">
              <TableHeader>
                <TableRow>
                  <TableColumnHeader w="100px">{ t('showcaseRemainder.block') }</TableColumnHeader>
                  <TableColumnHeader w="100px">{ t('showcaseRemainder.age') }</TableColumnHeader>
                  <TableColumnHeader w="100px">{ t('showcaseRemainder.gas_used') }</TableColumnHeader>
                </TableRow>
              </TableHeader>
              <TableBody>
                <SocketNewItemsNotice.Desktop
                  num={ 1234 }
                  type="block"
                  isLoading
                />
              </TableBody>
            </TableRoot>
          </Sample>
          <Sample label="success">
            <TableRoot tableLayout="auto">
              <TableHeader>
                <TableRow>
                  <TableColumnHeader w="100px">{ t('showcaseRemainder.block') }</TableColumnHeader>
                  <TableColumnHeader w="100px">{ t('showcaseRemainder.age') }</TableColumnHeader>
                  <TableColumnHeader w="100px">{ t('showcaseRemainder.gas_used') }</TableColumnHeader>
                </TableRow>
              </TableHeader>
              <TableBody>
                <SocketNewItemsNotice.Desktop
                  num={ 1234 }
                  type="block"
                  isLoading={ false }
                />
              </TableBody>
            </TableRoot>
          </Sample>
        </SamplesStack>

        <SectionSubHeader>{ t('showcaseRemainder.multiple_lines') }</SectionSubHeader>
        <SamplesStack>
          <Sample label={ t('showcaseRemainder.multiple_title') }>
            <Alert status="warning" title={ t('showcaseRemainder.warning') } inline={ false } maxWidth="500px" showIcon closable>
              <Box>
                { t('showcaseRemainder.scout_badges') }
              </Box>
            </Alert>
          </Sample>
          <Sample label={ t('showcaseRemainder.multiple_no_title') }>
            <Alert status="warning" maxWidth="500px">
              <Box>
                { t('showcaseRemainder.scout_badges') }
              </Box>
            </Alert>
          </Sample>
          <Sample label={ t('showcaseRemainder.with_spinner') }>
            <TxPendingAlert/>
          </Sample>
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(AlertShowcase);
