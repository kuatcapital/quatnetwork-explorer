// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import { Box, Flex, chakra, createListCollection } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { TokenInstance } from 'types/api/token';

import { Alert } from 'toolkit/chakra/alert';
import type { SelectOption } from 'toolkit/chakra/select';
import { Select } from 'toolkit/chakra/select';
import { ContentLoader } from 'toolkit/components/loaders/ContentLoader';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import RawDataSnippet from 'ui/shared/RawDataSnippet';

import { useMetadataUpdateContext } from './contexts/metadataUpdate';
import MetadataAccordion from './metadata/MetadataAccordion';

type Format = 'Table' | 'JSON';

interface Props {
  data: TokenInstance['metadata'] | undefined;
  isPlaceholderData?: boolean;
}

const TokenInstanceMetadata = ({ data, isPlaceholderData }: Props) => {
  const { t: tQuat } = useTranslation();
  const collection = React.useMemo(() => createListCollection<SelectOption>({
    items: [ { label: tQuat('tokenUi.table'), value: 'Table' }, { label: 'JSON', value: 'JSON' } ],
  }), [ tQuat ]);

  const [ format, setFormat ] = React.useState<Array<Format>>([ 'Table' ]);

  const { status: refetchStatus } = useMetadataUpdateContext() || {};

  const handleValueChange = React.useCallback(({ value }: { value: Array<string> }) => {
    setFormat(value as Array<Format>);
  }, []);

  if (isPlaceholderData || refetchStatus === 'WAITING_FOR_RESPONSE') {
    return <ContentLoader/>;
  }

  if (!data) {
    return <Box>{ tQuat('tokenUi.no_metadata') }</Box>;
  }

  const content = format[0] === 'Table' ?
    <MetadataAccordion data={ data }/> :
    <RawDataSnippet data={ JSON.stringify(data, undefined, 4) } showCopy={ false }/>;

  return (
    <Box>
      { refetchStatus === 'ERROR' && (
        <Alert status="warning" mb={ 6 } title={ tQuat('tokenUi.oops') } display={{ base: 'block', lg: 'flex' }}>
          <span>{ tQuat('tokenUi.refresh_retry') }</span>
        </Alert>
      ) }
      <Flex alignItems="center" mb={ 6 }>
        <chakra.span fontWeight={ 500 }>{ tQuat('tokenUi.metadata') }</chakra.span>
        <Select
          collection={ collection }
          placeholder={ tQuat('tokenUi.select_type') }
          value={ format }
          onValueChange={ handleValueChange }
          ml={ 5 }
          w="100px"
        />
        { format[0] === 'JSON' && <CopyToClipboard text={ JSON.stringify(data) } ml="auto"/> }
      </Flex>
      { content }
    </Box>
  );
};

export default React.memo(TokenInstanceMetadata);
