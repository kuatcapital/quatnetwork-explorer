import type { StackProps } from '@chakra-ui/react';
import { createListCollection, HStack } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useSettingsContext } from 'lib/contexts/settings';
import dayjs from 'lib/date/dayjs';
import { useLocale } from 'lib/i18n/provider';
import { IconButton } from 'toolkit/chakra/icon-button';
import type { SelectOption } from 'toolkit/chakra/select';
import { SelectContent, SelectItem, SelectRoot, SelectControl } from 'toolkit/chakra/select';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TruncatedText } from 'toolkit/components/truncation/TruncatedText';
import IconSvg from 'ui/shared/IconSvg';
import TextSeparator from 'ui/shared/TextSeparator';

type Format = 'local' | 'utc' | 'unix';

interface Props extends StackProps {
  timestamp: string | number;
  isLoading?: boolean;
  noRelativeTime?: boolean;
};

const DetailedInfoTimestamp = ({ timestamp, isLoading, noRelativeTime, ...rest }: Props) => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const collection = React.useMemo(() => createListCollection<SelectOption>({
    items: [
      { label: t('common.local'), value: 'local' },
      { label: 'UTC', value: 'utc' },
      { label: t('sharedUi.unix'), value: 'unix' },
    ],
  }), [ t ]);
  const settings = useSettingsContext();

  const [ format, setFormat ] = React.useState<Array<Format>>(settings?.isLocalTime === false ? [ 'utc' ] : [ 'local' ]);

  const handleFormatChange = React.useCallback(({ value }: { value: Array<string> }) => {
    setFormat(value as Array<Format>);
  }, []);

  const timeText = (() => {
    if (format.includes('local')) {
      return dayjs(timestamp).locale(locale).format('llll');
    }

    if (format.includes('utc')) {
      return dayjs(timestamp).utc().locale(locale).format('LL LTS');
    }

    return dayjs(timestamp).unix().toString();
  })();

  return (
    <HStack maxW="100%" minW="0" { ...rest }>
      { !noRelativeTime && (
        <>
          <Skeleton loading={ isLoading } flexShrink={ 0 }>
            { dayjs(timestamp).locale(locale).fromNow() }
          </Skeleton>
          <TextSeparator mx={ 0 }/>
        </>
      ) }
      <HStack gap={ 1 } minW="0">
        <SelectRoot
          name="time_format"
          collection={ collection }
          value={ format }
          onValueChange={ handleFormatChange }
          variant="plain"
          w="fit-content"
        >
          <SelectControl
            triggerProps={{ asChild: true, minH: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            noIndicator
            defaultValue={ format }
          >
            <IconButton
              aria-label={ t('common.toggle_time_format') }
              variant="icon_secondary"
              boxSize={ 5 }
              borderRadius="sm"
              selected={ !isLoading }
              loadingSkeleton={ isLoading }
            >
              <IconSvg name="clock-light" boxSize="14px"/>
            </IconButton>
          </SelectControl>
          <SelectContent>
            { collection.items.map((item) => (
              <SelectItem item={ item } key={ item.value }>
                { item.label }
              </SelectItem>
            )) }
          </SelectContent>
        </SelectRoot>
        <TruncatedText
          text={ timeText }
          loading={ isLoading }
          minW="0"
        />
      </HStack>
    </HStack>
  );
};

export default DetailedInfoTimestamp;
// Modified by Quat Capital, 2026-10-26: localized timestamps and controls without global Day.js locale. GPL-3.0.
