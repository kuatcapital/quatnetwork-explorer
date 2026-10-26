// Modified by Quat Capital, 2026-10-26: localize block, gas and statistics UI. GPL-3.0.
import { createListCollection, Grid, GridItem } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type * as stats from '@blockscout/stats-types';
import type { StatsIntervalIds } from 'types/client/stats';

import { Select } from 'toolkit/chakra/select';
import { FilterInput } from 'toolkit/components/filters/FilterInput';
import ChartIntervalSelect from 'ui/shared/chart/ChartIntervalSelect';

type Props = {
  sections?: Array<stats.LineChartSection>;
  currentSection: string;
  onSectionChange: (newSection: string) => void;
  interval: StatsIntervalIds;
  onIntervalChange: (newInterval: StatsIntervalIds) => void;
  onFilterInputChange: (q: string) => void;
  isLoading: boolean;
  initialFilterValue: string;
};

const StatsFilters = ({
  sections,
  currentSection,
  onSectionChange,
  interval,
  onIntervalChange,
  onFilterInputChange,
  isLoading,
  initialFilterValue,
}: Props) => {
  const { t } = useTranslation();

  const collection = React.useMemo(() => {
    return createListCollection({
      items: [
        { value: 'all', label: t('statistics.all') },
        ...(sections || []).map((section) => ({ value: section.id, label: section.title })),
      ],
    });
  }, [ sections, t ]);

  const handleItemSelect = React.useCallback(({ value }: { value: Array<string> }) => {
    onSectionChange(value[0]);
  }, [ onSectionChange ]);

  return (
    <Grid
      gap={{ base: 2, lg: 6 }}
      templateAreas={{
        base: `"section interval"
                "input input"`,
        lg: `"section interval input"`,
      }}
      gridTemplateColumns={{ base: 'repeat(2, minmax(0, 1fr))', lg: 'auto auto 1fr' }}
      alignItems="center"
    >
      <GridItem
        w={{ base: '100%', lg: 'auto' }}
        area="section"
      >
        <Select
          collection={ collection }
          placeholder={ t('statistics.section') }
          value={ [ currentSection ] }
          onValueChange={ handleItemSelect }
          w={{ base: '100%', lg: '136px' }}
          loading={ isLoading }
        />
      </GridItem>

      <GridItem
        w={{ base: '100%', lg: 'auto' }}
        area="interval"
      >
        <ChartIntervalSelect interval={ interval } onIntervalChange={ onIntervalChange } isLoading={ isLoading } selectTagSize="md"/>
      </GridItem>

      <GridItem
        w="100%"
        area="input"
      >
        <FilterInput
          key={ initialFilterValue }
          loading={ isLoading }
          onChange={ onFilterInputChange }
          placeholder={ t('statistics.find') }
          initialValue={ initialFilterValue }
          size="sm"
        />
      </GridItem>
    </Grid>
  );
};

export default StatsFilters;
