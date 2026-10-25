// Modified by Quat Capital, 2026-10-25: precise locale-aware transaction numbers. GPL-3.0.
import React from 'react';

import type { TxBlob } from 'types/api/blobs';

import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import BlobDataType from 'ui/shared/blob/BlobDataType';
import BlobEntity from 'ui/shared/entities/blob/BlobEntity';

interface Props {
  data: TxBlob;
  isLoading?: boolean;
}

const TxBlobsTableItem = ({ data, isLoading }: Props) => {
  const { locale } = useLocale();
  const size = data.blob_data ? data.blob_data.replace('0x', '').length / 2 : '-';

  return (
    <TableRow alignItems="top">
      <TableCell>
        <BlobEntity hash={ data.hash } noIcon isLoading={ isLoading }/>
      </TableCell>
      <TableCell verticalAlign="middle">
        { data.blob_data ? <BlobDataType isLoading={ isLoading } data={ data.blob_data }/> : '-' }
      </TableCell>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading } display="inline-block">
          { typeof size === 'number' ? formatNumber(size, locale) : size }
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(TxBlobsTableItem);
