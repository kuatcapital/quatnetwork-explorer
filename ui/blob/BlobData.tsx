// Modified by Quat Capital, 2026-10-26: localize blob and statistics metadata. GPL-3.0.
import { createListCollection, Flex } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import * as blobUtils from 'lib/blob';
import removeNonSignificantZeroBytes from 'lib/blob/removeNonSignificantZeroBytes';
import bytesToBase64 from 'lib/bytesToBase64';
import hexToBase64 from 'lib/hexToBase64';
import hexToBytes from 'lib/hexToBytes';
import hexToUtf8 from 'lib/hexToUtf8';
import { Button } from 'toolkit/chakra/button';
import type { SelectOption } from 'toolkit/chakra/select';
import { Select } from 'toolkit/chakra/select';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { downloadBlob } from 'toolkit/utils/file';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import RawDataSnippet from 'ui/shared/RawDataSnippet';

import BlobDataImage from './BlobDataImage';

const FORMATS = [
  { label: 'Image', value: 'Image' as const },
  { label: 'Raw', value: 'Raw' as const },
  { label: 'UTF-8', value: 'UTF-8' as const },
  { label: 'Base64', value: 'Base64' as const },
];

type Format = typeof FORMATS[number]['value'];

interface Props {
  data: string;
  hash: string;
  isLoading?: boolean;
}

const BlobData = ({ data, isLoading, hash }: Props) => {
  const { t } = useTranslation();
  const [ format, setFormat ] = React.useState<Array<Format>>([ 'Raw' ]);

  const guessedType = React.useMemo(() => {
    if (isLoading) {
      return;
    }
    return blobUtils.guessDataType(data);
  }, [ data, isLoading ]);

  const isImage = guessedType?.mime?.startsWith('image/');
  const collection = React.useMemo(() => {
    const availableFormats = isImage ? FORMATS : FORMATS.filter((format) => format.value !== 'Image');
    const labels: Record<Format, string> = {
      Image: t('blobUI.image'), Raw: t('blobUI.raw'), 'UTF-8': 'UTF-8', Base64: 'Base64',
    };
    const formats = availableFormats.map(item => ({ ...item, label: labels[item.value] }));
    return createListCollection<SelectOption>({
      items: formats,
    });
  }, [ isImage, t ]);

  React.useEffect(() => {
    if (isImage) {
      setFormat([ 'Image' ]);
    }
  }, [ isImage ]);

  const handleFormatChange = React.useCallback(({ value }: { value: Array<string> }) => {
    setFormat(value as Array<Format>);
  }, []);

  const handleDownloadButtonClick = React.useCallback(() => {
    const fileBlob = (() => {
      switch (format[0]) {
        case 'Image': {
          const bytes = hexToBytes(data);
          const filteredBytes = removeNonSignificantZeroBytes(bytes);
          return new Blob([ filteredBytes ], { type: guessedType?.mime });
        }
        case 'UTF-8': {
          return new Blob([ hexToUtf8(data) ], { type: guessedType?.mime ?? 'text/plain' });
        }
        case 'Base64': {
          return new Blob([ hexToBase64(data) ], { type: 'application/octet-stream' });
        }
        case 'Raw': {
          return new Blob([ data ], { type: 'application/octet-stream' });
        }
      }
    })();
    const fileName = `blob_${ hash }`;

    downloadBlob(fileBlob, fileName);
  }, [ data, format, guessedType, hash ]);

  const content = (() => {
    switch (format[0]) {
      case 'Image': {
        if (!guessedType?.mime?.startsWith('image/')) {
          return <RawDataSnippet data={ t('blobUI.not_image') } showCopy={ false } isLoading={ isLoading } w="100%"/>;
        }

        const bytes = hexToBytes(data);
        const filteredBytes = removeNonSignificantZeroBytes(bytes);
        const base64 = bytesToBase64(filteredBytes);

        const imgSrc = `data:${ guessedType.mime };base64,${ base64 }`;

        return <BlobDataImage src={ imgSrc }/>;
      }
      case 'UTF-8':
        return <RawDataSnippet data={ hexToUtf8(data) } showCopy={ false } isLoading={ isLoading } contentProps={{ wordBreak: 'break-word' }} w="100%"/>;
      case 'Base64':
        return <RawDataSnippet data={ hexToBase64(data) } showCopy={ false } isLoading={ isLoading } w="100%"/>;
      case 'Raw':
        return <RawDataSnippet data={ data } showCopy={ false } isLoading={ isLoading } w="100%"/>;
      default:
        return <span/>;
    }
  })();

  return (
    <>
      <DetailedInfo.ItemLabel
        hint={ t('blobUI.data') }
        isLoading={ isLoading }
      >
        { t('blobUI.data') }
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue flexWrap="wrap">
        <Flex alignItems="center" w="100%" mb={{ base: 1, lg: 3 }} mt={{ base: 1, lg: 0 }}>
          <Select
            collection={ collection }
            placeholder={ t('blobUI.type') }
            value={ format }
            onValueChange={ handleFormatChange }
            w="100px"
            loading={ isLoading }
          />
          <Skeleton ml="auto" mr={ 2 } loading={ isLoading }>
            <Button
              variant="outline"
              size="sm"
              onClick={ handleDownloadButtonClick }
            >
              { t('blobUI.download') }
            </Button>
          </Skeleton>
          <CopyToClipboard text={ data } isLoading={ isLoading }/>
        </Flex>
        { content }
      </DetailedInfo.ItemValue>
    </>
  );
};

export default React.memo(BlobData);
