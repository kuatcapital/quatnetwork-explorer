// Modified by Quat Capital, 2026-10-25: localize event log and status labels. GPL-3.0.
import { Flex, Grid } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { DecodedInput } from 'types/api/decodedInput';
import type { ArrayElement } from 'types/utils';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { TruncatedText } from 'toolkit/components/truncation/TruncatedText';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';

interface Props {
  data: DecodedInput['parameters'];
  isLoading?: boolean;
}

const HeaderItem = ({ children, isLoading }: { children: React.ReactNode; isLoading?: boolean }) => {
  return (
    <Skeleton
      fontWeight={ 600 }
      pb={ 1 }
      display="inline-block"
      width="fit-content"
      maxW="100%"
      overflowWrap="anywhere"
      height="fit-content"
      loading={ isLoading }
    >
      { children }
    </Skeleton>
  );
};

const Row = ({ name, type, indexed, value, isLoading }: ArrayElement<DecodedInput['parameters']> & { isLoading?: boolean }) => {
  const content = (() => {
    if (type === 'address' && typeof value === 'string') {
      return (
        <AddressEntity
          address={{ hash: value, name: '' }}
          isLoading={ isLoading }
        />
      );
    }

    if (typeof value === 'object') {
      const text = JSON.stringify(value, undefined, 4);
      return (
        <Flex alignItems="flex-start" whiteSpace="normal" wordBreak="break-all">
          <TruncatedText text={ text } loading={ isLoading }/>
          <CopyToClipboard text={ text } isLoading={ isLoading }/>
        </Flex>
      );
    }

    return (
      <Flex alignItems="flex-start" whiteSpace="normal" wordBreak="break-all">
        <TruncatedText text={ value } loading={ isLoading }/>
        <CopyToClipboard text={ value } isLoading={ isLoading }/>
      </Flex>
    );
  })();

  return (
    <>
      <TruncatedText text={ name } loading={ isLoading }/>
      <TruncatedText text={ type } loading={ isLoading }/>
      { indexed !== undefined && (
        <Skeleton loading={ isLoading } display="inline-block">{ indexed ? 'true' : 'false' }</Skeleton>
      ) }
      <Skeleton loading={ isLoading } display="inline-block">{ content }</Skeleton>
    </>
  );
};

const LogDecodedInputDataTable = ({ data, isLoading }: Props) => {
  const { t } = useTranslation();
  const hasIndexed = data.some(({ indexed }) => indexed !== undefined);

  const gridTemplateColumnsBase = hasIndexed ?
    '50px 60px 40px minmax(0, 1fr)' :
    '50px 60px minmax(0, 1fr)';
  const gridTemplateColumnsLg = hasIndexed ?
    '80px 80px 80px minmax(0, 1fr)' :
    '80px 80px minmax(0, 1fr)';

  return (
    <Grid
      gridTemplateColumns={{ base: gridTemplateColumnsBase, lg: gridTemplateColumnsLg }}
      textStyle="sm"
      bgColor={{ _light: 'blackAlpha.50', _dark: 'whiteAlpha.50' }}
      p={ 4 }
      mt={ 2 }
      w="100%"
      columnGap={ 5 }
      rowGap={ 5 }
      borderBottomLeftRadius="md"
      borderBottomRightRadius="md"
    >
      <HeaderItem isLoading={ isLoading }>{ t('common.name') }</HeaderItem>
      <HeaderItem isLoading={ isLoading }>{ t('common.type') }</HeaderItem>
      { hasIndexed && <HeaderItem isLoading={ isLoading }>{ t('sharedLogs.indexed') }</HeaderItem> }
      <HeaderItem isLoading={ isLoading }>{ t('sharedLogs.data') }</HeaderItem>
      { data.map((item) => {

        return <Row key={ item.name } { ...item } isLoading={ isLoading }/>;
      }) }
    </Grid>
  );
};

export default LogDecodedInputDataTable;
