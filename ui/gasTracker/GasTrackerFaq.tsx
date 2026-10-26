// Modified by Quat Capital, 2026-10-26: runtime locale for block and statistics UI. GPL-3.0.
import { Box } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import config from 'configs/app';
import { currencyUnits } from 'lib/units';
import { AccordionRoot } from 'toolkit/chakra/accordion';
import { Heading } from 'toolkit/chakra/heading';

import GasTrackerFaqItem from './GasTrackerFaqItem';

const GasTrackerFaq = () => {
  const { t } = useTranslation();
  const params = { chain: config.chain.name, unit: currencyUnits.gwei };
  const items = [
    { question: t('gasTracker.q1'), answer: t('gasTracker.a1') },
    { question: t('gasTracker.q2', params), answer: t('gasTracker.a2', params) },
    { question: t('gasTracker.q3', params), answer: t('gasTracker.a3', params) },
    { question: t('gasTracker.q4'), answer: t('gasTracker.a4') },
  ];
  return (
    <Box mt={ 12 }>
      <Heading level="2" mb={ 4 }>{ t('gasTracker.faq') }</Heading>
      <AccordionRoot variant="faq">
        { items.map((item, index) => (
          <GasTrackerFaqItem key={ index } question={ item.question } answer={ item.answer }/>
        )) }
      </AccordionRoot>
    </Box>
  );
};

export default GasTrackerFaq;
