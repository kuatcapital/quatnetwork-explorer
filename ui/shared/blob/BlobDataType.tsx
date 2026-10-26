import { Flex } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import * as blobUtils from 'lib/blob';
import { Skeleton } from 'toolkit/chakra/skeleton';
import type { IconName } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';
interface Props {
  data: string;
  isLoading?: boolean;
}

const TYPES: Record<string, { iconName: IconName; labelKey: string }> = {
  image: { iconName: 'blobs/image', labelKey: 'sharedUi.image' },
  text: { iconName: 'blobs/text', labelKey: 'sharedUi.text' },
  raw: { iconName: 'blobs/raw', labelKey: 'sharedUi.raw' },
};

const BlobDataType = ({ data, isLoading }: Props) => {
  const { t } = useTranslation();
  const guessedType = React.useMemo(() => {
    if (isLoading) {
      return;
    }
    return blobUtils.guessDataType(data);
  }, [ data, isLoading ]);

  const { iconName, labelKey } = (() => {
    if (guessedType?.mime?.startsWith('image/')) {
      return TYPES.image;
    }

    if (
      guessedType?.mime?.startsWith('text/') ||
      [
        'application/json',
        'application/xml',
        'application/javascript',
      ].includes(guessedType?.mime || '')
    ) {
      return TYPES.text;
    }

    return TYPES.raw;
  })();

  return (
    <Flex alignItems="center" columnGap={ 2 }>
      <IconSvg name={ iconName } boxSize={ 5 } color="icon.primary" isLoading={ isLoading }/>
      <Skeleton loading={ isLoading }>{ t(labelKey) }</Skeleton>
    </Flex>
  );
};

export default React.memo(BlobDataType);
// Modified by Quat Capital, 2026-10-26: localized blob type labels with stable MIME detection. GPL-3.0.
