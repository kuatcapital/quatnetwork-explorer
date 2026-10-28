// Modified by Quat Capital, 2026-10-28: runtime Russian and Kazakh showcase labels. GPL-3.0.
import { Box, createListCollection } from '@chakra-ui/react';
import { noop } from 'es-toolkit';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Checkbox } from 'toolkit/chakra/checkbox';
import type { SelectOption } from 'toolkit/chakra/select';
import { Select, SelectAsync } from 'toolkit/chakra/select';
import PopoverFilterRadio from 'ui/shared/filters/PopoverFilterRadio';
import IconSvg from 'ui/shared/IconSvg';
import Sort from 'ui/shared/sort/Sort';
import TokenTransferFilter from 'ui/shared/TokenTransfer/TokenTransferFilter';
import { getSortOptions } from 'ui/txs/useTxsSort';

import { Section, Container, SectionHeader, SamplesStack, Sample, SectionSubHeader } from './parts';

const SelectShowcase = () => {
  const { t } = useTranslation();
  const frameworks = React.useMemo(() => createListCollection<SelectOption>({
    items: [
      {
        label: t('showcaseRemainder.react_label'),
        value: 'react',
        icon: <IconSvg name="navigation/api_keys" boxSize={ 5 } flexShrink={ 0 }/>,
      },
      { label: t('showcaseRemainder.vue_label'), value: 'vue' },
      {
        value: 'angular',
        label: 'Angular',
        renderLabel: () => (
          <div>
            <Trans
              t={ t }
              i18nKey="showcaseRemainder.angular_label"
              components={{ emphasis: <Box as="span" color="red" fontWeight="700"/> }}
            />
          </div>
        ),
      },
      { label: 'Svelte', value: 'svelte' },
    ],
  }), [ t ]);
  const txSortingOptions = React.useMemo(() => createListCollection<SelectOption>({ items: getSortOptions(t) }), [ t ]);
  const loadFrameworks = React.useCallback(() => Promise.resolve(frameworks), [ frameworks ]);
  const [ hasActiveFilter, setHasActiveFilter ] = React.useState(false);

  const handleFilterChange = React.useCallback((nextValue: string) => {
    setHasActiveFilter(nextValue !== txSortingOptions.items[0].value);
  }, [ txSortingOptions ]);

  return (
    <Container value="select">
      <Section>
        <SectionHeader>{ t('showcaseDisplay.variant') }</SectionHeader>
        <SamplesStack>
          <Sample label="variant: outline">
            <Select
              collection={ frameworks }
              placeholder={ t('showcaseRemainder.select_framework') }
              size="sm"
              w="200px"
            />
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>{ t('showcaseDisplay.size') }</SectionHeader>
        <SamplesStack>
          { [ 'sm' as const, 'lg' as const ].map((size) => {

            return (
              <Sample label={ `size: ${ size }` } key={ size }>
                <Select
                  collection={ frameworks }
                  placeholder={ t('showcaseRemainder.select_framework') }
                  size={ size }
                  w="300px"
                />
                <Select
                  collection={ frameworks }
                  placeholder={ t('showcaseRemainder.select_framework') }
                  defaultValue={ [ frameworks.items[0].value ] }
                  size={ size }
                  w="300px"
                />
                <Select
                  collection={ frameworks }
                  placeholder={ t('showcaseRemainder.select_framework') }
                  defaultValue={ [ frameworks.items[0].value ] }
                  size={ size }
                  w="300px"
                  readOnly
                />
                <Select
                  collection={ frameworks }
                  placeholder={ t('showcaseRemainder.select_framework') }
                  defaultValue={ [ frameworks.items[0].value ] }
                  size={ size }
                  w="300px"
                  disabled
                />
                <Select
                  collection={ frameworks }
                  placeholder={ t('showcaseRemainder.select_framework') }
                  size={ size }
                  w="300px"
                  required
                  invalid
                  errorText={ t('showcaseRemainder.error_message') }
                />
                <Select
                  collection={ frameworks }
                  placeholder={ t('showcaseRemainder.select_framework') }
                  defaultValue={ [ frameworks.items[0].value ] }
                  size={ size }
                  w="300px"
                  required
                  invalid
                  errorText={ t('showcaseRemainder.error_message') }
                />
              </Sample>
            );
          }) }
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>{ t('showcaseRemainder.search_async') }</SectionHeader>
        <SamplesStack>
          <Sample label="variant: outline">
            <SelectAsync
              placeholder={ t('showcaseRemainder.select_framework') }
              size="lg"
              w="300px"
              loadOptions={ loadFrameworks }
              extraControls={ <Checkbox mt={ 2 } size="sm">{ t('showcaseRemainder.nightly') }</Checkbox> }
            />
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>{ t('showcaseDisplay.examples') }</SectionHeader>

        <SectionSubHeader>{ t('showcaseRemainder.sort') }</SectionSubHeader>
        <SamplesStack>
          <Sample>
            <Sort
              name="transactions_sorting"
              defaultValue={ [ txSortingOptions.items[0].value ] }
              collection={ txSortingOptions }
              w="fit-content"
            />
            <Sort
              name="transactions_sorting"
              defaultValue={ [ txSortingOptions.items[0].value ] }
              collection={ txSortingOptions }
              isLoading
              w="fit-content"
            />
          </Sample>
        </SamplesStack>

        <SectionSubHeader>{ t('showcaseRemainder.token_filter') }</SectionSubHeader>
        <SamplesStack>
          <Sample>
            <TokenTransferFilter defaultTypeFilters={ [ ] } onTypeFilterChange={ noop } withAddressFilter/>
            <TokenTransferFilter defaultTypeFilters={ [ ] } onTypeFilterChange={ noop } appliedFiltersNum={ 2 }/>
            <TokenTransferFilter defaultTypeFilters={ [ ] } onTypeFilterChange={ noop } appliedFiltersNum={ 2 } isLoading/>
          </Sample>
        </SamplesStack>

        <SectionSubHeader>{ t('showcaseRemainder.radio_filter') }</SectionSubHeader>
        <SamplesStack>
          <Sample flexWrap="nowrap">
            <PopoverFilterRadio
              name="transactions_sorting"
              collection={ txSortingOptions }
              hasActiveFilter={ hasActiveFilter }
              onChange={ handleFilterChange }
            />
            <PopoverFilterRadio
              name="transactions_sorting"
              collection={ txSortingOptions }
              hasActiveFilter
              onChange={ noop }
              isLoading
            />
          </Sample>
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(SelectShowcase);
