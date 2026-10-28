// Modified by Quat Capital, 2026-10-28: runtime Russian and Kazakh showcase labels. GPL-3.0.
import { Box } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { TableColumnHeader, TableHeaderSticky, TableRoot, TableRow, TableCell, TableBody, TableColumnHeaderSortable } from 'toolkit/chakra/table';
import getNextSortValue from 'ui/shared/sort/getNextSortValue';

import { Section, Container, SectionHeader, SamplesStack, Sample } from './parts';

const ITEMS = [
  { id: 1, nameKey: 'showcaseDisplay.product_1', categoryKey: 'showcaseDisplay.electronics', price: 999.99 },
  { id: 2, nameKey: 'showcaseDisplay.product_2', categoryKey: 'showcaseDisplay.appliances', price: 49.99 },
  { id: 3, nameKey: 'showcaseDisplay.product_3', categoryKey: 'showcaseDisplay.furniture', price: 150.0 },
  { id: 4, nameKey: 'showcaseDisplay.product_4', categoryKey: 'showcaseDisplay.electronics', price: 799.99 },
  { id: 5, nameKey: 'showcaseDisplay.product_5', categoryKey: 'showcaseDisplay.accessories', price: 199.99 },
];

type Item = typeof ITEMS[number];

type SortField = 'category' | 'price';
type SortValue = 'category-asc' | 'category-desc' | 'price-asc' | 'price-desc' | 'default';

const SORT_SEQUENCE: Record<SortField, Array<SortValue>> = {
  category: [ 'category-desc', 'category-asc', 'default' ],
  price: [ 'price-desc', 'price-asc', 'default' ],
};

const TableShowcase = () => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const [ sort, setSort ] = React.useState<SortValue>('default');

  const handleSortToggle = React.useCallback((sortField: string) => {
    const value = getNextSortValue<SortField, SortValue>(SORT_SEQUENCE, sortField as SortField)(sort);
    setSort(value);
  }, [ sort, setSort ]);

  const sortFn = (a: Item, b: Item) => {
    if (sort === 'category-asc') {
      return t(a.categoryKey).localeCompare(t(b.categoryKey), locale);
    }
    if (sort === 'category-desc') {
      return t(b.categoryKey).localeCompare(t(a.categoryKey), locale);
    }
    if (sort === 'price-asc') {
      return a.price - b.price;
    }
    if (sort === 'price-desc') {
      return b.price - a.price;
    }
    return 0;
  };

  return (
    <Container value="table">
      <Section>
        <SectionHeader>{ t('showcaseDisplay.variant') }</SectionHeader>
        <SamplesStack >
          <Sample label="variant: line">
            <TableRoot>
              <TableHeaderSticky>
                <TableRow>
                  <TableColumnHeader>{ t('showcaseDisplay.product') }</TableColumnHeader>
                  <TableColumnHeaderSortable
                    sortField="category"
                    sortValue={ sort }
                    onSortToggle={ handleSortToggle }
                  >
                    { t('showcaseDisplay.category') }
                  </TableColumnHeaderSortable>
                  <TableColumnHeaderSortable
                    sortField="price"
                    sortValue={ sort }
                    onSortToggle={ handleSortToggle }
                    isNumeric
                  >
                    { t('showcaseDisplay.price') }
                  </TableColumnHeaderSortable>
                </TableRow>
              </TableHeaderSticky>
              <TableBody>
                { ITEMS.slice().sort(sortFn).map((item) => (
                  <TableRow key={ item.id }>
                    <TableCell>{ t(item.nameKey) }</TableCell>
                    <TableCell>{ t(item.categoryKey) }</TableCell>
                    <TableCell isNumeric>{ formatNumber(item.price, locale) }</TableCell>
                  </TableRow>
                )) }
              </TableBody>
            </TableRoot>
            <Box h="1000px"/>
          </Sample>
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(TableShowcase);
