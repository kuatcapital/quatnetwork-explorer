// Modified by Quat Capital, 2026-10-26: runtime translation and locale formatting. GPL-3.0.
import { createListCollection } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { StatsInterval, StatsIntervalIds } from 'types/client/stats';

import { Select } from 'toolkit/chakra/select';
import { Skeleton } from 'toolkit/chakra/skeleton';
import type { TagProps } from 'toolkit/chakra/tag';
import TagGroupSelect from 'ui/shared/tagGroupSelect/TagGroupSelect';
import { getStatsIntervals } from 'ui/stats/constants';

type Props = {
  interval: StatsIntervalIds;
  onIntervalChange: (newInterval: StatsIntervalIds) => void;
  isLoading?: boolean;
  selectTagSize?: TagProps['size'];
};

const ChartIntervalSelect = ({ interval, onIntervalChange, isLoading, selectTagSize }: Props) => {
  const { t } = useTranslation();
  const intervals = React.useMemo(() => getStatsIntervals(t), [ t ]);
  const intervalCollection = React.useMemo(() => createListCollection({
    items: Object.entries(intervals).map(([ id, item ]) => ({ value: id, label: item.title })),
  }), [ intervals ]);
  const intervalListShort: Array<StatsInterval> = React.useMemo(() => Object.entries(intervals).map(([ id, item ]) => ({
    id: id as StatsIntervalIds, title: item.shortTitle,
  })), [ intervals ]);

  const handleItemSelect = React.useCallback(({ value }: { value: Array<string> }) => {
    onIntervalChange(value[0] as StatsIntervalIds);
  }, [ onIntervalChange ]);

  return (
    <>
      <Skeleton hideBelow="lg" borderRadius="base" loading={ isLoading }>
        <TagGroupSelect<StatsIntervalIds> items={ intervalListShort } onChange={ onIntervalChange } value={ interval } tagSize={ selectTagSize }/>
      </Skeleton>
      <Select
        collection={ intervalCollection }
        placeholder={ t('statistics.select_interval') }
        value={ [ interval ] }
        onValueChange={ handleItemSelect }
        hideFrom="lg"
        w="100%"
        loading={ isLoading }
      />
    </>
  );
};

export default React.memo(ChartIntervalSelect);
