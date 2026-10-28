// Modified by Quat Capital, 2026-10-28: runtime Russian and Kazakh showcase labels. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import Pagination from 'ui/shared/pagination/Pagination';

import { Section, Container, SectionHeader, SamplesStack, Sample, SectionSubHeader } from './parts';

const PaginationShowcase = () => {
  const { t } = useTranslation();
  const [ page, setPage ] = React.useState(1);

  const handleNextPageClick = () => {
    setPage(page + 1);
  };

  const handlePrevPageClick = () => {
    setPage(page - 1);
  };

  const props = {
    page,
    onNextPageClick: handleNextPageClick,
    onPrevPageClick: handlePrevPageClick,
    resetPage: () => setPage(1),
    hasNextPage: page < 10,
    hasPages: true,
    isVisible: true,
    canGoBackwards: true,
    isLoading: false,
  };

  return (
    <Container value="pagination">
      <Section>
        <SectionHeader>{ t('showcaseDisplay.examples') }</SectionHeader>

        <SectionSubHeader>{ t('showcaseDisplay.list_pagination') }</SectionSubHeader>
        <SamplesStack>
          <Sample label={ t('showcaseDisplay.loaded_state') }>
            <Pagination { ...props }/>
          </Sample>
          <Sample label={ t('showcaseDisplay.initial_loading') }>
            <Pagination { ...props } hasPages={ false } page={ 1 } isLoading/>
          </Sample>
          <Sample label={ t('showcaseDisplay.next_loading') }>
            <Pagination { ...props } isLoading/>
          </Sample>
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(PaginationShowcase);
