// Modified by Quat Capital, 2026-10-29: localized rating accessibility labels without remounting the store. GPL-3.0.
import { Icon, RatingGroup, useRatingGroup } from '@chakra-ui/react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import StarFilledIcon from 'icons/star_filled.svg';
import StarOutlineIcon from 'icons/star_outline.svg';
import { useLocale } from 'lib/i18n/provider';

import { getRatingTranslations } from './accessibilityTranslations';

export interface RatingProps extends Omit<RatingGroup.RootProviderProps, 'value'> {
  count?: number;
  label?: string | Array<string>;
  defaultValue?: number;
  onValueChange?: ({ value }: { value: number }) => void;
  readOnly?: boolean;
  translations?: RatingGroup.RootProps['translations'];
}

export const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  function Rating(props, ref) {
    const { t } = useTranslation();
    const { locale } = useLocale();
    const { count = 5, label: labelProp, defaultValue, onValueChange, readOnly, translations, ...rest } = props;
    const localizedTranslations = React.useMemo(() => ({
      ...getRatingTranslations(t, locale), ...translations,
    }), [ t, locale, translations ]);
    const store = useRatingGroup({ count, defaultValue, onValueChange, readOnly, translations: localizedTranslations });

    const highlightedIndex = store.hovering && !readOnly ? store.hoveredValue : store.value;
    const label = Array.isArray(labelProp) ? labelProp[highlightedIndex - 1] : labelProp;

    return (
      <RatingGroup.RootProvider ref={ ref } value={ store } { ...rest }>
        <RatingGroup.HiddenInput/>
        <RatingGroup.Control>
          { Array.from({ length: count }).map((_, index) => {
            const icon = index < highlightedIndex ?
              <Icon boxSize={ 5 }><StarFilledIcon/></Icon> :
              <Icon boxSize={ 5 }><StarOutlineIcon/></Icon>;

            return (
              <RatingGroup.Item key={ index } index={ index + 1 }>
                <RatingGroup.ItemIndicator icon={ icon } cursor={ readOnly ? 'default' : 'pointer' }/>
              </RatingGroup.Item>
            );
          }) }
        </RatingGroup.Control>
        { label && <RatingGroup.Label>{ label }</RatingGroup.Label> }
      </RatingGroup.RootProvider>
    );
  },
);
