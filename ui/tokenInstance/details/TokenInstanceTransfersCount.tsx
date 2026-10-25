// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import { route } from 'nextjs-routes';

import useApiQuery from 'lib/api/useApiQuery';
import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';

interface Props {
  hash: string;
  id: string;
  onClick: () => void;
}

const TokenInstanceTransfersCount = ({ hash, id, onClick }: Props) => {
  const { t: tQuat } = useTranslation();
  const { locale } = useLocale();

  const transfersCountQuery = useApiQuery('general:token_instance_transfers_count', {
    pathParams: { hash, id },
    queryOptions: {
      enabled: Boolean(hash && id),
      placeholderData: {
        transfers_count: 420,
      },
    },
  });

  if (transfersCountQuery.isError) {
    return null;
  }

  if (!transfersCountQuery.data?.transfers_count) {
    return null;
  }

  const url = transfersCountQuery.data.transfers_count > 0 ?
    route({ pathname: '/token/[hash]/instance/[id]', query: { hash, id, tab: 'token_transfers' } }) :
    undefined;

  return (
    <>
      <DetailedInfo.ItemLabel
        hint={ tQuat('tokenUi.instance_transfers_hint') }
        isLoading={ transfersCountQuery.isPlaceholderData }
      >{ tQuat('tokenUi.transfers') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton loading={ transfersCountQuery.isPlaceholderData } display="inline-block">
          <Link
            href={ url }
            onClick={ transfersCountQuery.data.transfers_count > 0 ? onClick : undefined }
          >
            { formatNumber(transfersCountQuery.data.transfers_count, locale) }
          </Link>
        </Skeleton>
      </DetailedInfo.ItemValue>
    </>
  );
};

export default TokenInstanceTransfersCount;
