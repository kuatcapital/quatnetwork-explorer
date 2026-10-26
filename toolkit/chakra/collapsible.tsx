// Modified by Quat Capital, 2026-10-26: runtime toolkit labels for RU/KK/EN. GPL-3.0.
import { Flex, type FlexProps } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { scroller, Element } from 'react-scroll';

import { useUpdateEffect } from '../hooks/useUpdateEffect';
import type { LinkProps } from './link';
import { Link } from './link';

export interface CollapsibleDetailsProps extends LinkProps {
  children: React.ReactNode;
  id?: string;
  isExpanded?: boolean;
  text?: [string, string];
  noScroll?: boolean;
}

const SCROLL_CONFIG = {
  duration: 500,
  smooth: true,
};

const CUT_ID = 'CollapsibleDetails';

export const CollapsibleDetails = (props: CollapsibleDetailsProps) => {
  const { t } = useTranslation();

  const { children, id = CUT_ID, onClick, isExpanded: isExpandedProp = false, text: textProp, loading, noScroll, ...rest } = props;

  const [ isExpanded, setIsExpanded ] = React.useState(isExpandedProp);

  const handleClick = React.useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    setIsExpanded((flag) => !flag);
    if (!noScroll) {
      scroller.scrollTo(id, SCROLL_CONFIG);
    }
    onClick?.(event);
  }, [ id, noScroll, onClick ]);

  useUpdateEffect(() => {
    setIsExpanded(isExpandedProp);
    isExpandedProp && !noScroll && scroller.scrollTo(id, SCROLL_CONFIG);
  }, [ isExpandedProp, id, noScroll ]);

  const text = isExpanded ? (textProp?.[1] ?? t('toolkit.hide_details')) : (textProp?.[0] ?? t('toolkit.view_details'));

  return (
    <>
      <Link
        textStyle="sm"
        textDecorationLine="underline"
        textDecorationStyle="dashed"
        w="fit-content"
        onClick={ handleClick }
        loading={ loading }
        { ...rest }
      >
        <Element name={ id }>{ text }</Element>
      </Link>
      { isExpanded && children }
    </>
  );
};

interface CollapsibleListProps<T> extends FlexProps {
  items: Array<T>;
  renderItem: (item: T, index: number) => React.ReactNode;
  triggerProps?: LinkProps;
  cutLength?: number;
  text?: [React.ReactNode, React.ReactNode];
  defaultExpanded?: boolean;
}

export const CollapsibleList = <T,>(props: CollapsibleListProps<T>) => {
  const { t } = useTranslation();
  const CUT_LENGTH = 3;

  const { items, renderItem, triggerProps, cutLength = CUT_LENGTH, text: textProp, defaultExpanded = false, ...rest } = props;

  const [ isExpanded, setIsExpanded ] = React.useState(defaultExpanded);

  React.useEffect(() => {
    setIsExpanded(defaultExpanded);
  }, [ defaultExpanded ]);

  const handleToggle = React.useCallback(() => {
    setIsExpanded((flag) => !flag);
  }, []);

  const text = isExpanded ? (textProp?.[1] ?? t('toolkit.hide')) : (textProp?.[0] ?? t('toolkit.show_all'));

  return (
    <Flex flexDir="column" w="100%" { ...rest }>
      { items.slice(0, isExpanded ? undefined : cutLength).map(renderItem) }
      { items.length > cutLength && (
        <Link
          textStyle="sm"
          textDecorationLine="underline"
          textDecorationStyle="dashed"
          w="fit-content"
          minW="auto"
          onClick={ handleToggle }
          { ...triggerProps }
        >
          { text }
        </Link>
      ) }
    </Flex>
  );
};
