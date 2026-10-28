// Modified by Quat Capital, 2026-10-28: runtime Russian and Kazakh showcase labels. GPL-3.0.
import { Box } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Badge } from 'toolkit/chakra/badge';
import IconSvg from 'ui/shared/IconSvg';
import StatusTag from 'ui/shared/statusTag/StatusTag';

import { Section, Container, SectionHeader, SamplesStack, Sample, SectionSubHeader } from './parts';

const BadgeShowcase = () => {
  const { t } = useTranslation();
  return (
    <Container value="badge">
      <Section>
        <SectionHeader>{ t('showcaseDisplay.palette') }</SectionHeader>
        <SamplesStack>
          <Sample label="colorPalette: gray">
            <Badge colorPalette="gray">{ t('showcaseDisplay.pending') }</Badge>
          </Sample>
          <Sample label="colorPalette: green">
            <Badge colorPalette="green">{ t('showcaseDisplay.success') }</Badge>
          </Sample>
          <Sample label="colorPalette: red">
            <Badge colorPalette="red">{ t('showcaseDisplay.failed') }</Badge>
          </Sample>
          <Sample label="colorPalette: purple">
            <Badge colorPalette="purple">{ t('showcaseDisplay.transaction') }</Badge>
          </Sample>
          <Sample label="colorPalette: orange">
            <Badge colorPalette="orange">{ t('showcaseDisplay.token_transfer') }</Badge>
          </Sample>
          <Sample label="colorPalette: blue">
            <Badge colorPalette="blue">{ t('showcaseDisplay.contract_call') }</Badge>
          </Sample>
          <Sample label="colorPalette: yellow">
            <Badge colorPalette="yellow">{ t('showcaseDisplay.blob_tx') }</Badge>
          </Sample>
          <Sample label="colorPalette: teal">
            <Badge colorPalette="teal">{ t('showcaseDisplay.multicall') }</Badge>
          </Sample>
          <Sample label="colorPalette: cyan">
            <Badge colorPalette="cyan">{ t('showcaseDisplay.internal_tx') }</Badge>
          </Sample>
          <Sample label="colorPalette: pink">
            <Badge colorPalette="pink">{ t('showcaseDisplay.content') }</Badge>
          </Sample>
          <Sample label="colorPalette: purple_alt">
            <Badge colorPalette="purple_alt">{ t('showcaseDisplay.read') }</Badge>
          </Sample>
          <Sample label="colorPalette: blue_alt">
            <Badge colorPalette="blue_alt">{ t('showcaseDisplay.write') }</Badge>
          </Sample>
          <Sample label="colorPalette: bright_gray">
            <Badge colorPalette="bright_gray">{ t('showcaseDisplay.content') }</Badge>
          </Sample>
          <Sample label="colorPalette: bright_green">
            <Badge colorPalette="bright_green">{ t('showcaseDisplay.content') }</Badge>
          </Sample>
          <Sample label="colorPalette: bright_red">
            <Badge colorPalette="bright_red">{ t('showcaseDisplay.content') }</Badge>
          </Sample>
          <Sample label="colorPalette: bright_blue">
            <Badge colorPalette="bright_blue">{ t('showcaseDisplay.content') }</Badge>
          </Sample>
          <Sample label="colorPalette: bright_yellow">
            <Badge colorPalette="bright_yellow">{ t('showcaseDisplay.content') }</Badge>
          </Sample>
          <Sample label="colorPalette: bright_teal">
            <Badge colorPalette="bright_teal">{ t('showcaseDisplay.content') }</Badge>
          </Sample>
          <Sample label="colorPalette: bright_cyan">
            <Badge colorPalette="bright_cyan">{ t('showcaseDisplay.content') }</Badge>
          </Sample>
          <Sample label="colorPalette: bright_orange">
            <Badge colorPalette="bright_orange">{ t('showcaseDisplay.content') }</Badge>
          </Sample>
          <Sample label="colorPalette: bright_purple">
            <Badge colorPalette="bright_purple">{ t('showcaseDisplay.content') }</Badge>
          </Sample>
          <Sample label="colorPalette: bright_pink">
            <Badge colorPalette="bright_pink">{ t('showcaseDisplay.content') }</Badge>
          </Sample>
        </SamplesStack>
      </Section>
      <Section>
        <SectionHeader>{ t('showcaseDisplay.loading') }</SectionHeader>
        <SamplesStack>
          <Sample label="loading: true">
            <Badge colorPalette="purple" loading>{ t('showcaseDisplay.content') }</Badge>
          </Sample>
        </SamplesStack>
      </Section>
      <Section>
        <SectionHeader>{ t('showcaseDisplay.size') }</SectionHeader>
        <SamplesStack>
          <Sample label="size: sm">
            <Badge size="sm">{ t('showcaseDisplay.content') }</Badge>
          </Sample>
          <Sample label="size: md">
            <Badge size="md">{ t('showcaseDisplay.content') }</Badge>
          </Sample>
          <Sample label="size: lg">
            <Badge size="lg">{ t('showcaseDisplay.content') }</Badge>
          </Sample>
        </SamplesStack>
      </Section>
      <Section>
        <SectionHeader>{ t('showcaseDisplay.variant') }</SectionHeader>
        <SamplesStack>
          <Sample label="variant: subtle">
            <Badge variant="subtle">{ t('showcaseDisplay.content') }</Badge>
          </Sample>
        </SamplesStack>
      </Section>
      <Section>
        <SectionHeader>{ t('showcaseDisplay.truncate') }</SectionHeader>
        <SamplesStack>
          <Sample label="truncated: true">
            <Box maxW="150px">
              <Badge truncated>
                { t('showcaseDisplay.long_content') }
              </Badge>
            </Box>
          </Sample>
        </SamplesStack>
      </Section>
      <Section>
        <SectionHeader>{ t('showcaseDisplay.icon') }</SectionHeader>
        <SamplesStack>
          <Sample label="iconStart: status/success">
            <Badge startElement={ <IconSvg name="status/success" boxSize={ 2.5 }/> }>
              { t('showcaseDisplay.content') }
            </Badge>
          </Sample>
        </SamplesStack>
      </Section>
      <Section>
        <SectionHeader>{ t('showcaseDisplay.examples') }</SectionHeader>
        <SectionSubHeader>{ t('showcaseDisplay.status_tag') }</SectionSubHeader>
        <SamplesStack>
          <Sample label="status: ok">
            <StatusTag type="ok" text={ t('showcaseDisplay.text') }/>
          </Sample>
          <Sample label="status: error">
            <StatusTag type="error" text={ t('showcaseDisplay.text') }/>
          </Sample>
          <Sample label="status: pending">
            <StatusTag type="pending" text={ t('showcaseDisplay.text') }/>
          </Sample>
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(BadgeShowcase);
