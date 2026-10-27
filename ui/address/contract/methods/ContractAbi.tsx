// Modified by Quat Capital, 2026-10-27: complete runtime contract-interface localization. GPL-3.0.
// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import { Box, Flex } from '@chakra-ui/react';
import { range } from 'es-toolkit';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import type { SmartContractMethod } from './types';

import { route } from 'nextjs-routes';

import { AccordionRoot } from 'toolkit/chakra/accordion';
import { Link } from 'toolkit/chakra/link';

import ContractAbiItem from './ContractAbiItem';
import useFormSubmit from './useFormSubmit';
import useScrollToMethod from './useScrollToMethod';

interface Props {
  abi: Array<SmartContractMethod>;
  visibleItems?: Array<number>;
  addressHash: string;
  tab: string;
  sourceAddress?: string;
}

const ContractAbi = ({ abi, addressHash, sourceAddress, tab, visibleItems }: Props) => {
  const { t: tQuat } = useTranslation();

  const [ expandedSections, setExpandedSections ] = React.useState<Array<string>>(abi.length === 1 ? [ '0' ] : []);
  const [ id, setId ] = React.useState(0);

  useScrollToMethod(abi, setExpandedSections);

  const handleFormSubmit = useFormSubmit({ addressHash });

  const handleAccordionStateChange = React.useCallback(({ value }: { value: Array<string> }) => {
    setExpandedSections(value);
  }, []);

  const handleExpandAll = React.useCallback(() => {
    if (!abi) {
      return;
    }

    if (expandedSections.length < abi.length) {
      setExpandedSections(range(0, abi.length).map(String));
    } else {
      setExpandedSections([]);
    }
  }, [ abi, expandedSections.length ]);

  const handleReset = React.useCallback(() => {
    setId((id) => id + 1);
  }, []);

  const hasVisibleItems = !visibleItems || visibleItems.length > 0;

  return (
    <div>
      <Flex mb={ 3 }>
        <Box fontWeight={ 500 } mr="auto">{ tQuat('contracts.information') }</Box>
        { abi.length > 1 && (
          <Link onClick={ handleExpandAll } variant="secondary">
            { expandedSections.length === abi.length ? tQuat('contracts.collapse_all') : tQuat('contracts.expand_all') }
          </Link>
        ) }
        <Link onClick={ handleReset } ml={ 3 } variant="secondary">{ tQuat('common.reset') }</Link>
      </Flex>
      <AccordionRoot multiple lazyMount position="relative" onValueChange={ handleAccordionStateChange } value={ expandedSections }>
        { abi.map((item, index) => (
          <ContractAbiItem
            key={ index }
            id={ id }
            index={ index }
            data={ item }
            isOpen={ expandedSections.includes(String(index)) }
            isVisible={ !visibleItems || visibleItems.includes(index) }
            addressHash={ addressHash }
            sourceAddress={ sourceAddress }
            tab={ tab }
            onSubmit={ handleFormSubmit }
          />
        )) }
      </AccordionRoot>
      { !hasVisibleItems && (
        <div>
          <div>{ tQuat('contracts.no_matching_method') }</div>
          <div>
            <Trans
              t={ tQuat }
              i18nKey="contracts.use_custom_abi"
              components={{
                custom: <Link
                  href={ route({ pathname: '/address/[hash]', query: { hash: addressHash, tab: 'read_write_custom_methods' } }) }
                  scroll={ false }
                />,
              }}
            />
          </div>
        </div>
      ) }
    </div>
  );
};

export default React.memo(ContractAbi);
