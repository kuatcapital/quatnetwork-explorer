// Modified by Quat Capital, 2026-10-25: runtime transaction interface localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { TxBlob } from 'types/api/blobs';

import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { Skeleton } from 'toolkit/chakra/skeleton';
import BlobDataType from 'ui/shared/blob/BlobDataType';
import BlobEntity from 'ui/shared/entities/blob/BlobEntity';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';

interface Props {
  data: TxBlob;
  isLoading?: boolean;
}

const TxBlobListItem = ({ data, isLoading }: Props) => {
  const { locale } = useLocale();
  const { t: tTx } = useTranslation();
  const size = data.blob_data ? data.blob_data.replace('0x', '').length / 2 : '-';

  return (
    <ListItemMobileGrid.Container>
      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tTx('transactions.blob_hash') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <BlobEntity hash={ data.hash } isLoading={ isLoading }/>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tTx('transactions.data_type') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        { data.blob_data ? <BlobDataType isLoading={ isLoading } data={ data.blob_data }/> : '-' }
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tTx('blocks.size_bytes') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton loading={ isLoading }>
          { typeof size === 'number' ? formatNumber(size, locale) : size }
        </Skeleton>
      </ListItemMobileGrid.Value>
    </ListItemMobileGrid.Container>
  );
};

export default React.memo(TxBlobListItem);
