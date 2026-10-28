// Modified by Quat Capital, 2026-10-28: runtime Russian and Kazakh showcase labels. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import { IconButton } from 'toolkit/chakra/icon-button';
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from 'toolkit/chakra/menu';
import IconSvg from 'ui/shared/IconSvg';

import { Section, Container, SectionHeader, SamplesStack, Sample } from './parts';

const MenuShowcase = () => {
  const { t } = useTranslation();

  return (
    <Container value="menu">
      <Section>
        <SectionHeader>{ t('showcaseDisplay.variant') }</SectionHeader>
        <SamplesStack>
          <Sample label="variant: subtle">
            <MenuRoot>
              <MenuTrigger asChild>
                <IconButton variant="icon_background" size="md">
                  <IconSvg name="dots"/>
                </IconButton>
              </MenuTrigger>
              <MenuContent>
                <MenuItem value="refresh-metadata">{ t('showcaseRemainder.refresh_metadata') }</MenuItem>
                <MenuItem value="add-token-info">{ t('showcaseRemainder.add_token') }</MenuItem>
                <MenuItem value="add-private-tag">{ t('showcaseRemainder.add_private_tag') }</MenuItem>
                <MenuItem value="add-public-tag">{ t('showcaseRemainder.add_public_tag') }</MenuItem>
              </MenuContent>
            </MenuRoot>

            <MenuRoot>
              <MenuTrigger asChild>
                <IconButton variant="icon_background" size="md" loadingSkeleton>
                  <IconSvg name="dots"/>
                </IconButton>
              </MenuTrigger>
              <MenuContent>
                <MenuItem value="refresh-metadata">{ t('showcaseRemainder.refresh_metadata') }</MenuItem>
                <MenuItem value="add-token-info">{ t('showcaseRemainder.add_token') }</MenuItem>
                <MenuItem value="add-private-tag">{ t('showcaseRemainder.add_private_tag') }</MenuItem>
                <MenuItem value="add-public-tag">{ t('showcaseRemainder.add_public_tag') }</MenuItem>
              </MenuContent>
            </MenuRoot>
          </Sample>
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(MenuShowcase);
