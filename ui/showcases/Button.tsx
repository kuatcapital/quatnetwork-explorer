// Modified by Quat Capital, 2026-10-28: runtime Russian and Kazakh showcase labels. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button, ButtonGroupRadio } from 'toolkit/chakra/button';
import { Checkbox } from 'toolkit/chakra/checkbox';
import { Link } from 'toolkit/chakra/link';
import { PopoverContent, PopoverRoot, PopoverTrigger, PopoverBody } from 'toolkit/chakra/popover';
import { Tooltip } from 'toolkit/chakra/tooltip';
import { BACKGROUND_DEFAULT } from 'ui/home/HeroBanner';
import IconSvg from 'ui/shared/IconSvg';

import { Section, Container, SectionHeader, SamplesStack, Sample, SectionSubHeader } from './parts';

const ButtonShowcase = () => {
  const { t } = useTranslation();
  return (
    <Container value="button">
      <Section>
        <SectionHeader>{ t('showcaseDisplay.size') }</SectionHeader>
        <SamplesStack>
          <Sample label="size: 2xs">
            <Button size="2xs">{ t('showcaseDisplay.content') }</Button>
          </Sample>
          <Sample label="size: xs">
            <Button size="xs">{ t('showcaseDisplay.content') }</Button>
          </Sample>
          <Sample label="size: sm">
            <Button size="sm">{ t('showcaseDisplay.content') }</Button>
          </Sample>
          <Sample label="size: md">
            <Button size="md">{ t('showcaseDisplay.content') }</Button>
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>{ t('showcaseDisplay.variants') }</SectionHeader>
        <SamplesStack>

          <Sample label="variant: solid">
            <Button variant="solid">{ t('showcaseDisplay.default') }</Button>
            <Button variant="solid" data-hover>{ t('showcaseRemainder.hovered') }</Button>
            <Button variant="solid" disabled>{ t('showcaseRemainder.disabled') }</Button>
            <Button variant="solid" loading>{ t('showcaseDisplay.loading') }</Button>
            <Button variant="solid" loadingSkeleton>{ t('showcaseRemainder.loading_skeleton') }</Button>
          </Sample>

          <Sample label="variant: solid_danger">
            <Button variant="solid_danger">{ t('showcaseDisplay.default') }</Button>
            <Button variant="solid_danger" data-hover>{ t('showcaseRemainder.hovered') }</Button>
            <Button variant="solid_danger" disabled>{ t('showcaseRemainder.disabled') }</Button>
            <Button variant="solid_danger" loading>{ t('showcaseDisplay.loading') }</Button>
            <Button variant="solid_danger" loadingSkeleton>{ t('showcaseRemainder.loading_skeleton') }</Button>
          </Sample>

          <Sample label="variant: outline">
            <Button variant="outline">{ t('showcaseDisplay.default') }</Button>
            <Button variant="outline" data-hover>{ t('showcaseRemainder.hovered') }</Button>
            <Button variant="outline" disabled>{ t('showcaseRemainder.disabled') }</Button>
            <Button variant="outline" loading>{ t('showcaseDisplay.loading') }</Button>
            <Button variant="outline" loadingSkeleton>{ t('showcaseRemainder.loading_skeleton') }</Button>
          </Sample>

          <Sample label="variant: outline_danger">
            <Button variant="outline_danger">{ t('showcaseDisplay.default') }</Button>
            <Button variant="outline_danger" data-hover>{ t('showcaseRemainder.hovered') }</Button>
            <Button variant="outline_danger" disabled>{ t('showcaseRemainder.disabled') }</Button>
            <Button variant="outline_danger" loading>{ t('showcaseDisplay.loading') }</Button>
            <Button variant="outline_danger" loadingSkeleton>{ t('showcaseRemainder.loading_skeleton') }</Button>
          </Sample>

          <Sample label="variant: link">
            <Button variant="link">{ t('showcaseDisplay.default') }</Button>
            <Button variant="link" data-hover>{ t('showcaseRemainder.hovered') }</Button>
            <Button variant="link" disabled>{ t('showcaseRemainder.disabled') }</Button>
            <Button variant="link" loadingSkeleton>{ t('showcaseRemainder.disabled') }</Button>
          </Sample>

          <Sample label="variant: dropdown">
            <PopoverRoot>
              <PopoverTrigger>
                <Button variant="dropdown">{ t('showcaseDisplay.default') }</Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverBody>
                  { t('showcaseDisplay.popover') }
                </PopoverBody>
              </PopoverContent>
            </PopoverRoot>
            <PopoverRoot>
              <PopoverTrigger>
                <Button variant="dropdown" data-hover>{ t('showcaseRemainder.hovered') }</Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverBody>
                  { t('showcaseDisplay.popover') }
                </PopoverBody>
              </PopoverContent>
            </PopoverRoot>
            <PopoverRoot>
              <PopoverTrigger>
                <Button variant="dropdown" expanded>{ t('showcaseRemainder.expended') }</Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverBody>
                  { t('showcaseDisplay.popover') }
                </PopoverBody>
              </PopoverContent>
            </PopoverRoot>
            <PopoverRoot>
              <PopoverTrigger>
                <Button variant="dropdown" selected>{ t('showcaseDisplay.selected') }</Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverBody display="flex" flexDirection="column" gap={ 2 }>
                  <Checkbox defaultChecked>{ t('showcaseDisplay.first_option') }</Checkbox>
                  <Checkbox>{ t('showcaseDisplay.second_option') }</Checkbox>
                </PopoverBody>
              </PopoverContent>
            </PopoverRoot>
            <Button variant="dropdown" disabled>{ t('showcaseRemainder.disabled') }</Button>
            <Button variant="dropdown" loading>{ t('showcaseDisplay.loading') }</Button>
            <Button variant="dropdown" loadingSkeleton>{ t('showcaseRemainder.loading_skeleton') }</Button>

            <PopoverRoot>
              <Tooltip content={ t('showcaseRemainder.tooltip_content') }>
                <div>
                  <PopoverTrigger>
                    <Button variant="dropdown" size="md" px={ 2 }>
                      <IconSvg name="explorer" boxSize={ 5 }/>
                      { t('showcaseRemainder.with_tooltip') }
                    </Button>
                  </PopoverTrigger>
                </div>
              </Tooltip>
              <PopoverContent>
                <PopoverBody>
                  { t('showcaseDisplay.popover') }
                </PopoverBody>
              </PopoverContent>
            </PopoverRoot>
          </Sample>

          <Sample label="variant: header">
            <Button variant="header">{ t('showcaseDisplay.default') }</Button>
            <Button variant="header" data-hover>{ t('showcaseRemainder.hovered') }</Button>
            <Button variant="header" loading loadingText={ t('showcaseDisplay.loading') }>{ t('showcaseDisplay.loading') }</Button>
            <PopoverRoot>
              <PopoverTrigger>
                <Button variant="header" selected>{ t('showcaseDisplay.selected') }</Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverBody>
                  { t('showcaseRemainder.profile_menu') }
                </PopoverBody>
              </PopoverContent>
            </PopoverRoot>
            <PopoverRoot>
              <PopoverTrigger>
                <Button variant="header" selected expanded>{ t('showcaseRemainder.selected_expended') }</Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverBody>
                  { t('showcaseRemainder.profile_menu') }
                </PopoverBody>
              </PopoverContent>
            </PopoverRoot>
            <PopoverRoot>
              <PopoverTrigger>
                <Button variant="header" selected highlighted>{ t('showcaseRemainder.selected_highlighted') }</Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverBody>
                  { t('showcaseRemainder.profile_menu') }
                </PopoverBody>
              </PopoverContent>
            </PopoverRoot>
          </Sample>

          <Sample label="variant: hero" p={ 6 } background={ BACKGROUND_DEFAULT }>
            <Button variant="hero">{ t('showcaseDisplay.default') }</Button>
            <Button variant="hero" data-hover>{ t('showcaseRemainder.hovered') }</Button>
            <Button variant="hero" loading loadingText={ t('showcaseDisplay.loading') }>{ t('showcaseDisplay.loading') }</Button>
            <PopoverRoot>
              <PopoverTrigger>
                <Button variant="hero" selected>{ t('showcaseDisplay.selected') }</Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverBody>
                  { t('showcaseRemainder.profile_menu') }
                </PopoverBody>
              </PopoverContent>
            </PopoverRoot>
            <PopoverRoot>
              <PopoverTrigger>
                <Button variant="hero" selected expanded>{ t('showcaseRemainder.selected_expended') }</Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverBody>
                  { t('showcaseRemainder.profile_menu') }
                </PopoverBody>
              </PopoverContent>
            </PopoverRoot>
          </Sample>

          <Sample label="variant: subtle">
            <Button variant="subtle" size="xs">{ t('showcaseRemainder.default_now') }</Button>
            <Button variant="subtle" size="xs" data-hover>{ t('showcaseRemainder.hovered_now') }</Button>
            <Button variant="subtle" size="xs" disabled>{ t('showcaseRemainder.disabled_now') }</Button>
            <Button variant="subtle" size="xs" loadingSkeleton>{ t('showcaseRemainder.loading_skeleton') }</Button>
          </Sample>

          <Sample label="variant: plain">
            <Button variant="plain">{ t('showcaseDisplay.default') }</Button>
            <Button variant="plain" data-hover>{ t('showcaseRemainder.hovered') }</Button>
            <Button variant="plain" disabled>{ t('showcaseRemainder.disabled') }</Button>
            <Button variant="plain" loadingSkeleton>{ t('showcaseRemainder.loading_skeleton') }</Button>
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>{ t('showcaseDisplay.loading') }</SectionHeader>
        <SamplesStack>
          <Sample label="loading: true, loadingText: 'Loading'">
            <Button loading loadingText={ t('showcaseDisplay.loading') }>{ t('showcaseDisplay.content') }</Button>
            <Button loading loadingText={ t('showcaseDisplay.loading') } size="sm">{ t('showcaseDisplay.content') }</Button>
            <Button loading loadingText={ t('showcaseDisplay.loading') } size="xs">{ t('showcaseDisplay.content') }</Button>
            <Button loading loadingText={ t('showcaseDisplay.loading') } size="2xs">{ t('showcaseDisplay.content') }</Button>
          </Sample>
          <Sample label="loading: true, loadingText: undefined">
            <Button loading>{ t('showcaseDisplay.content') }</Button>
          </Sample>
          <Sample label="loadingSkeleton: true">
            <Button loadingSkeleton>{ t('showcaseDisplay.content') }</Button>
            <Button loadingSkeleton variant="outline">{ t('showcaseDisplay.content') }</Button>
            <Button loadingSkeleton variant="dropdown">{ t('showcaseDisplay.content') }</Button>
            <Button loadingSkeleton variant="subtle">{ t('showcaseDisplay.content') }</Button>
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>{ t('showcaseDisplay.examples') }</SectionHeader>
        <SectionSubHeader>{ t('showcaseRemainder.as_link') }</SectionSubHeader>
        <SamplesStack>
          <Sample>
            <Link href="/" asChild>
              <Button>{ t('showcaseRemainder.am_link') }</Button>
            </Link>
          </Sample>
        </SamplesStack>

        <SectionSubHeader>{ t('showcaseRemainder.button_radio') }</SectionSubHeader>
        <SamplesStack>
          <Sample>
            <ButtonGroupRadio>
              <Button value="option-1">{ t('showcaseRemainder.option_1') }</Button>
              <Button value="option-2">{ t('showcaseRemainder.option_2') }</Button>
              <Button value="option-3">{ t('showcaseRemainder.option_3') }</Button>
            </ButtonGroupRadio>
            <ButtonGroupRadio loading>
              <Button value="option-1">{ t('showcaseRemainder.option_1') }</Button>
              <Button value="option-2">{ t('showcaseRemainder.option_2') }</Button>
              <Button value="option-3">{ t('showcaseRemainder.option_3') }</Button>
            </ButtonGroupRadio>
          </Sample>
        </SamplesStack>
      </Section>

    </Container>
  );
};

export default React.memo(ButtonShowcase);
