// Modified by Quat Capital, 2026-10-27: complete runtime contract-interface localization. GPL-3.0.
// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import { Box } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Element } from 'react-scroll';

import type { FormSubmitHandler, SmartContractMethod } from './types';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import { AccordionItem, AccordionItemContent, AccordionItemTrigger } from 'toolkit/chakra/accordion';
import { Alert } from 'toolkit/chakra/alert';
import { Badge } from 'toolkit/chakra/badge';
import { Hint } from 'toolkit/components/Hint/Hint';
import CopyToClipboard from 'ui/shared/CopyToClipboard';

import ContractMethodForm from './form/ContractMethodForm';
import { getElementId, getElementName } from './useScrollToMethod';
import { isReadMethod } from './utils';

interface Props {
  data: SmartContractMethod;
  index: number;
  id: number;
  addressHash: string;
  sourceAddress?: string;
  tab: string;
  onSubmit: FormSubmitHandler;
  isVisible?: boolean;
  isOpen: boolean;
}

const ContractAbiItem = ({ data, index, id, addressHash, sourceAddress, tab, onSubmit, isVisible = true, isOpen }: Props) => {
  const { t: tQuat } = useTranslation();

  const [ attempt, setAttempt ] = React.useState(0);

  const url = React.useMemo(() => {
    return config.app.baseUrl + route({
      pathname: '/address/[hash]',
      query: {
        hash: addressHash ?? '',
        tab,
        ...(sourceAddress ? { source_address: sourceAddress } : {}),
      },
      hash: getElementId(data),
    });
  }, [ addressHash, data, tab, sourceAddress ]);

  const handleReset = React.useCallback(() => {
    setAttempt((prev) => prev + 1);
  }, []);

  const isRead = isReadMethod(data);

  return (
    <AccordionItem
      as="section"
      value={ String(index) }
      _first={{ borderTopWidth: 0 }}
      _last={{ borderBottomWidth: 0 }}
      display={ isVisible ? 'block' : 'none' }
    >
      <Element as="h2" name={ getElementName(data) }>
        <AccordionItemTrigger
          px={ 0 }
          py={ 3 }
          _hover={{ bgColor: 'inherit' }}
          wordBreak="break-all"
          textAlign="left"
          cursor="pointer"
          display="flex"
          alignItems="center"
          columnGap={ 2 }
        >
          <CopyToClipboard text={ url } type="link" ml={ 0 } as="div"/>
          <Box fontWeight={ 500 } display="flex" alignItems="center">
            { index + 1 }. { data.type === 'fallback' || data.type === 'receive' ? data.type : data.name }
            { data.type === 'fallback' && (
              <Hint
                label={ tQuat('contracts.fallback_hint') }
                ml={ 1 }
                as="div"
              />
            ) }
            { data.type === 'receive' && (
              <Hint
                label={ tQuat('contracts.receive_hint') }
                ml={ 1 }
                as="div"
              />
            ) }
          </Box>
          <Badge colorPalette={ isRead ? 'purple_alt' : 'blue_alt' } flexShrink={ 0 }>
            { isRead ? tQuat('contracts.read_badge') : tQuat('contracts.write_badge') }
          </Badge>
          { 'method_id' in data && (
            <Badge
              flexShrink={ 0 }
              endElement={ <CopyToClipboard text={ data.method_id } as="div"/> }
              gap={ 0 }
            >
              { data.method_id }
            </Badge>
          ) }
        </AccordionItemTrigger>
      </Element>
      <AccordionItemContent pb={ 4 } pr={ 0 } pl="28px" w="calc(100% - 6px)">
        { 'is_invalid' in data && data.is_invalid ? (
          <Alert status="warning">{ tQuat('contracts.signature_error') }</Alert>
        ) : (
          <ContractMethodForm
            key={ id + '_' + index + '_' + attempt }
            data={ data }
            attempt={ attempt }
            onSubmit={ onSubmit }
            onReset={ handleReset }
            isOpen={ isOpen }
          />
        ) }
      </AccordionItemContent>
    </AccordionItem>
  );
};

export default React.memo(ContractAbiItem);
