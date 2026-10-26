// Modified by Quat Capital, 2026-10-26: runtime empty-state messages. GPL-3.0.
import { EmptyState as ChakraEmptyState, VStack } from '@chakra-ui/react';
import { upperFirst } from 'es-toolkit';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import ComingSoonIcon from './assets/empty_state_coming_soon.svg';
import QueryIcon from './assets/empty_state_query.svg';
import StatsIcon from './assets/empty_state_stats.svg';

export type EmptyStateType = 'query' | 'stats' | 'coming_soon';

const ICONS: Partial<Record<EmptyStateType, React.FunctionComponent>> = {
  query: QueryIcon as unknown as React.FunctionComponent,
  stats: StatsIcon as unknown as React.FunctionComponent,
  coming_soon: ComingSoonIcon as unknown as React.FunctionComponent,
};

export interface EmptyStateProps extends ChakraEmptyState.RootProps {
  title?: string;
  description?: React.ReactNode;
  term?: string;
  type?: EmptyStateType;
  icon?: React.ReactNode;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  function EmptyState(props, ref) {
    const { t } = useTranslation();
    const { title, description, term, type = 'query', icon, children, ...rest } = props;
    const localizedTerm = (() => {
      switch (term) {
        case 'chart': return t('toolkit.term_chart');
        case 'transaction': return t('toolkit.term_transaction');
        case 'transactions': return t('toolkit.term_transactions');
        default: return term;
      }
    })();

    const titleContent = (() => {
      if (title) {
        return title;
      }

      if (type === 'stats') {
        return t('toolkit.collecting');
      }

      if (type === 'coming_soon') {
        return t('toolkit.coming_soon');
      }

      return t('toolkit.no_results');
    })();

    const descriptionContent = (() => {
      if (description) {
        return description;
      }

      if (term && type === 'query') {
        return t('toolkit.query_empty', { term: localizedTerm });
      }

      if (type === 'stats') {
        return term ? t('toolkit.stats_term', { term: upperFirst(localizedTerm || term) }) : t('toolkit.stats_soon');
      }

      if (type === 'coming_soon') {
        return t('toolkit.info_soon');
      }
    })();

    const iconContent = (() => {
      const Icon = ICONS[type];
      if (Icon) {
        return <Icon/>;
      }
      return icon;
    })();

    return (
      <ChakraEmptyState.Root ref={ ref } { ...rest }>
        <ChakraEmptyState.Content>
          { iconContent && (
            <ChakraEmptyState.Indicator>{ iconContent }</ChakraEmptyState.Indicator>
          ) }
          { descriptionContent ? (
            <VStack textAlign="center" gap={ 2 }>
              <ChakraEmptyState.Title>{ titleContent }</ChakraEmptyState.Title>
              <ChakraEmptyState.Description>
                { descriptionContent }
              </ChakraEmptyState.Description>
            </VStack>
          ) : (
            <ChakraEmptyState.Title>{ titleContent }</ChakraEmptyState.Title>
          ) }
          { children }
        </ChakraEmptyState.Content>
      </ChakraEmptyState.Root>
    );
  },
);
