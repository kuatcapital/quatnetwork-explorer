// Modified by Quat Capital, 2026-10-28: runtime Russian and Kazakh showcase labels. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import * as addressMetadataMock from 'mocks/metadata/address';
import { Tag } from 'toolkit/chakra/tag';
import EntityTag from 'ui/shared/EntityTags/EntityTag';

import { Section, Container, SectionHeader, SamplesStack, Sample, SectionSubHeader } from './parts';

const TagShowcase = () => {
  const { t } = useTranslation();
  return (
    <Container value="tag">
      <Section>
        <SectionHeader>{ t('showcaseDisplay.variant') }</SectionHeader>
        <SamplesStack>
          <Sample label="variant: subtle">
            <Tag>{ t('showcaseDisplay.my_tag') }</Tag>
          </Sample>
          <Sample label="variant: clickable">
            <Tag variant="clickable">{ t('showcaseDisplay.my_tag') }</Tag>
          </Sample>
          <Sample label="variant: filter">
            <Tag variant="filter">{ t('showcaseDisplay.my_tag') }</Tag>
          </Sample>
          <Sample label="variant: select">
            <Tag variant="select">{ t('showcaseDisplay.default') }</Tag>
            <Tag variant="select" selected>{ t('showcaseDisplay.selected') }</Tag>
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>{ t('showcaseDisplay.size') }</SectionHeader>
        <SamplesStack>
          <Sample label="size: md">
            <Tag size="md">{ t('showcaseDisplay.my_tag') }</Tag>
          </Sample>
          <Sample label="size: lg">
            <Tag size="lg">{ t('showcaseDisplay.my_tag') }</Tag>
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>{ t('showcaseDisplay.truncated') }</SectionHeader>
        <SamplesStack>
          <Sample label="truncated: true">
            <Tag maxW="150px" truncated>{ t('showcaseDisplay.long_text') }</Tag>
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>{ t('showcaseDisplay.closable') }</SectionHeader>
        <SamplesStack>
          <Sample label="closable: true">
            <Tag closable>{ t('showcaseDisplay.my_tag') }</Tag>
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>{ t('showcaseDisplay.loading') }</SectionHeader>
        <SamplesStack>
          <Sample label="loading: true">
            <Tag loading>{ t('showcaseDisplay.my_tag') }</Tag>
            <Tag maxW="150px" truncated loading>{ t('showcaseDisplay.long_text') }</Tag>
          </Sample>
          <Sample label="loading: true, variant: select">
            <Tag variant="select" loading>{ t('showcaseDisplay.default') }</Tag>
            <Tag variant="select" selected loading>{ t('showcaseDisplay.selected') }</Tag>
          </Sample>
          <Sample label="loading: false">
            <Tag>{ t('showcaseDisplay.my_tag') }</Tag>
            <Tag maxW="150px" truncated>{ t('showcaseDisplay.long_text') }</Tag>
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>{ t('showcaseDisplay.examples') }</SectionHeader>
        <SectionSubHeader>{ t('showcaseDisplay.public_tags') }</SectionSubHeader>
        <SamplesStack>
          <Sample>
            <EntityTag data={ addressMetadataMock.nameTag }/>
            <EntityTag data={ addressMetadataMock.customNameTag }/>
            <EntityTag data={ addressMetadataMock.warpcastTag }/>
            <EntityTag data={ addressMetadataMock.genericTag }/>
            <EntityTag data={ addressMetadataMock.protocolTag }/>
            <EntityTag data={ addressMetadataMock.infoTagWithLink } maxW="150px"/>
            <EntityTag data={ addressMetadataMock.tagWithTooltip }/>
            <EntityTag data={ addressMetadataMock.nameTag } isLoading/>
          </Sample>
        </SamplesStack>

        <SectionSubHeader>{ t('showcaseDisplay.filter_tags') }</SectionSubHeader>
        <SamplesStack>
          <Sample>
            <Tag variant="filter" label={ t('showcaseDisplay.type') }>{ t('showcaseDisplay.all') }</Tag>
            <Tag variant="filter" label={ t('showcaseDisplay.address') } truncated maxW="150px" closable>0x1234567890123456789012345678901234567890</Tag>
            <Tag variant="filter" label={ t('showcaseDisplay.type') } loading>{ t('showcaseDisplay.all') }</Tag>
          </Sample>
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(TagShowcase);
