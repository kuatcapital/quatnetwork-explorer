// Modified by Quat Capital, 2026-10-25: runtime transaction interface localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import { Link } from 'toolkit/chakra/link';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';

import useTxCrossChainTransfersQuery from '../useTxCrossChainTransfersQuery';

interface Props {
  hash: string;
  isLoading: boolean;
}

const TxDetailsCrossChainTransfers = ({ hash, isLoading: isLoadingProp }: Props) => {
  const { t: tTx } = useTranslation();

  const { data, isPending } = useTxCrossChainTransfersQuery({ hash });

  const isLoading = isLoadingProp || isPending;

  if ((!isPending && (!data || !data.items.length)) || !config.features.crossChainTxs.isEnabled) {
    return null;
  }

  const text = (() => {
    if (!data) {
      return '0';
    }

    return data.next_page_params ? '50+' : data.items.length;
  })();

  return (
    <>
      <DetailedInfo.ItemLabel
        hint={ tTx('transactions.cross_chain_count_hint') }
        isLoading={ isLoading }
      >
        { tTx('transactions.cross_chain_transfers') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Link
          href={ route({ pathname: '/tx/[hash]', query: { hash, tab: 'token_transfers_cross_chain' } }) }
          loading={ isLoading }
        >
          { text }
        </Link>
      </DetailedInfo.ItemValue>
    </>
  );
};

export default React.memo(TxDetailsCrossChainTransfers);
