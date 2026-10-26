// Modified by Quat Capital, 2026-10-26: localize shared controls, details and data feedback. GPL-3.0.
import { chakra } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from 'toolkit/chakra/button';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from 'toolkit/chakra/popover';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  columnName: string;
  isLoading?: boolean;
  selected?: boolean;
  className?: string;
  children: React.ReactNode;
  value?: string;
}

const TableColumnFilterWrapper = ({ columnName, className, children, isLoading, selected, value }: Props) => {
  const { t } = useTranslation();
  return (
    <PopoverRoot>
      <PopoverTrigger>
        <Button
          display="inline-flex"
          aria-label={ t('sharedUi.filter_by', { column: columnName }) }
          variant="icon_secondary"
          borderWidth="0"
          h="20px"
          minW="auto"
          disabled={ isLoading }
          selected={ selected }
          borderRadius="4px"
          size="sm"
          textStyle="sm"
          fontWeight={ 500 }
          padding={ 0 }
        >
          <IconSvg name="filter" w="19px" h="19px"/>
          { Boolean(value) && <chakra.span>{ value }</chakra.span> }
        </Button>
      </PopoverTrigger>
      <PopoverContent className={ className }>
        <PopoverBody display="flex" flexDir="column" rowGap={ 3 }>
          { children }
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default chakra(TableColumnFilterWrapper);
