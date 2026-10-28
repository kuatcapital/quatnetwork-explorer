// Modified by Quat Capital, 2026-10-28: runtime Russian and Kazakh showcase labels. GPL-3.0.
import { Box } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'toolkit/chakra/tabs';
import AdaptiveTabs from 'toolkit/components/AdaptiveTabs/AdaptiveTabs';

import { Section, Container, SectionHeader, SamplesStack, Sample, SectionSubHeader } from './parts';

const TabsShowcase = () => {
  const { t } = useTranslation();
  const tabs = [
    { id: 'tab1', title: t('showcaseDisplay.swaps'), component: <div>{ t('showcaseDisplay.swaps_content') }</div>, count: 10 },
    { id: 'tab2', title: t('showcaseDisplay.bridges'), component: <div>{ t('showcaseDisplay.bridges_content') }</div>, count: 0 },
    {
      id: 'tab3',
      title: t('showcaseDisplay.liquidity_staking'),
      component: <div>{ t('showcaseDisplay.liquidity_content') }</div>,
      count: 300,
    },
    { id: 'tab4', title: t('showcaseDisplay.lending'), component: <div>{ t('showcaseDisplay.lending_content') }</div>, count: 400 },
    { id: 'tab5', title: t('showcaseDisplay.yield_farming'), component: <div>{ t('showcaseDisplay.yield_content') }</div> },
  ];

  return (
    <Container value="tabs">
      <Section>
        <SectionHeader>{ t('showcaseDisplay.variants') }</SectionHeader>
        <SamplesStack>
          <Sample label="variant: solid">
            <TabsRoot defaultValue="tab1" variant="solid">
              <TabsList>
                <TabsTrigger value="tab1">{ t('showcaseDisplay.first_tab') }</TabsTrigger>
                <TabsTrigger value="tab2">{ t('showcaseDisplay.second_tab') }</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1">{ t('showcaseDisplay.first_content') }</TabsContent>
              <TabsContent value="tab2">{ t('showcaseDisplay.second_content') }</TabsContent>
            </TabsRoot>
          </Sample>
          <Sample label="variant: secondary">
            <TabsRoot defaultValue="tab1" variant="secondary" size="sm">
              <TabsList>
                <TabsTrigger value="tab1">{ t('showcaseDisplay.first_tab') }</TabsTrigger>
                <TabsTrigger value="tab2">{ t('showcaseDisplay.second_tab') }</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1">{ t('showcaseDisplay.first_content') }</TabsContent>
              <TabsContent value="tab2">{ t('showcaseDisplay.second_content') }</TabsContent>
            </TabsRoot>
          </Sample>
          <Sample label="variant: segmented">
            <TabsRoot defaultValue="tab1" variant="segmented" size="sm">
              <TabsList>
                <TabsTrigger value="tab1">{ t('showcaseDisplay.first_tab') }</TabsTrigger>
                <TabsTrigger value="tab2">{ t('showcaseDisplay.second_tab') }</TabsTrigger>
                <TabsTrigger value="tab3">{ t('showcaseDisplay.third_tab') }</TabsTrigger>
                <TabsTrigger value="tab4">{ t('showcaseDisplay.fourth_tab') }</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1">{ t('showcaseDisplay.first_content') }</TabsContent>
              <TabsContent value="tab2">{ t('showcaseDisplay.second_content') }</TabsContent>
              <TabsContent value="tab3">{ t('showcaseDisplay.third_content') }</TabsContent>
              <TabsContent value="tab4">{ t('showcaseDisplay.fourth_content') }</TabsContent>
            </TabsRoot>
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>{ t('showcaseDisplay.examples') }</SectionHeader>

        <SectionSubHeader>{ t('showcaseDisplay.adaptive_tabs') }</SectionSubHeader>
        <SamplesStack>
          <Sample gridColumn="1 / 3" w="100%" maxW={{ base: '100vw', lg: '700px' }}>
            <AdaptiveTabs
              w="100%"
              tabs={ tabs }
              defaultValue={ tabs[0].id }
              outline="1px dashed lightpink"
              leftSlot={ <Box display={{ base: 'none', lg: 'block' }}>{ t('showcaseDisplay.left_element') }</Box> }
              leftSlotProps={{ pr: { base: 0, lg: 4 }, color: 'text.secondary' }}
              rightSlot={ (
                <Box display={{ base: 'none', lg: 'flex' }} justifyContent="space-between">
                  <span>{ t('showcaseDisplay.right_element') }</span><span>🙈</span>
                </Box>
              ) }
              rightSlotProps={{ pl: { base: 0, lg: 4 }, color: 'text.secondary', widthAllocation: 'available' }}
            />
          </Sample>
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(TabsShowcase);
