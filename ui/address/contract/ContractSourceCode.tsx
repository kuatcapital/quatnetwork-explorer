// Modified by Quat Capital, 2026-10-27: complete runtime contract-interface localization. GPL-3.0.
// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import { Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { SmartContract } from 'types/api/contract';

import { route } from 'nextjs/routes';

import { useMultichainContext } from 'lib/contexts/multichain';
import formatLanguageName from 'lib/contracts/formatLanguageName';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import CodeEditor from 'ui/shared/monaco/CodeEditor';
import formatFilePath from 'ui/shared/monaco/utils/formatFilePath';

import ContractCodeIdes from './ContractCodeIdes';
import ContractExternalLibraries from './ContractExternalLibraries';

function getEditorData(contractInfo: SmartContract | undefined) {
  if (!contractInfo || !contractInfo.source_code) {
    return undefined;
  }

  const extension = (() => {
    switch (contractInfo.language) {
      case 'vyper':
        return 'vy';
      case 'yul':
        return 'yul';
      case 'scilla':
        return 'scilla';
      case 'stylus_rust':
        return 'rs';
      case 'geas':
        return 'eas';
      default:
        return 'sol';
    }
  })();

  return [
    { file_path: formatFilePath(contractInfo.file_path || `index.${ extension }`), source_code: contractInfo.source_code },
    ...(contractInfo.additional_sources || []).map((source) => ({ ...source, file_path: formatFilePath(source.file_path) })),
  ];
}

interface Props {
  data: SmartContract | undefined;
  sourceAddress: string;
  isLoading?: boolean;
}

export const ContractSourceCode = ({ data, isLoading, sourceAddress }: Props) => {
  const { t: tQuat } = useTranslation();

  const multichainContext = useMultichainContext();

  const editorData = React.useMemo(() => {
    return getEditorData(data);
  }, [ data ]);

  const heading = (
    <Skeleton loading={ isLoading } fontWeight={ 500 }>
      <span>{ tQuat('contracts.source_code') }</span>
      { data?.language &&
        <Text whiteSpace="pre" as="span" color="text.secondary"> ({ formatLanguageName(data.language) })</Text> }
    </Skeleton>
  );

  const externalLibraries = data?.external_libraries ?
    <ContractExternalLibraries data={ data.external_libraries } isLoading={ isLoading }/> :
    null;

  const diagramLink = data?.can_be_visualized_via_sol2uml ? (
    <Tooltip content={ tQuat('contracts.uml_hint') }>
      <Link
        href={ route({ pathname: '/visualize/sol2uml', query: { address: sourceAddress } }, multichainContext) }
        ml={{ base: '0', lg: 'auto' }}
        loading={ isLoading }
      >
        <Skeleton loading={ isLoading }>{ tQuat('contracts.view_uml') }</Skeleton>
      </Link>
    </Tooltip>
  ) : null;

  const ides = data?.language && [ 'solidity', 'vyper', 'yul' ].includes(data.language) ?
    <ContractCodeIdes hash={ sourceAddress } isLoading={ isLoading }/> :
    null;

  const copyToClipboard = data && editorData?.length === 1 && data.source_code ? (
    <CopyToClipboard
      text={ data.source_code }
      isLoading={ isLoading }
      ml={{ base: 'auto', lg: diagramLink ? '0' : 'auto' }}
    />
  ) :
    null;

  const content = (() => {
    if (isLoading) {
      return <Skeleton loading h="557px" w="100%"/>;
    }

    if (!editorData) {
      return null;
    }

    return (
      <CodeEditor
        key={ sourceAddress }
        data={ editorData }
        remappings={ data?.compiler_settings?.remappings }
        libraries={ data?.external_libraries ?? undefined }
        language={ data?.language ?? undefined }
        mainFile={ editorData[0]?.file_path }
        contractName={ data?.name ?? undefined }
      />
    );
  })();

  return (
    <section>
      <Flex alignItems="center" mb={ 3 } columnGap={ 3 } rowGap={ 2 } flexWrap="wrap">
        { heading }
        { externalLibraries }
        { diagramLink }
        { ides }
        { copyToClipboard }
      </Flex>
      { content }
    </section>
  );
};

export default React.memo(ContractSourceCode);
