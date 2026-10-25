// Modified by Quat Capital, 2026-10-25: runtime transaction interface localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { InterchainMessage } from '@blockscout/interchain-indexer-types';

import useApiQuery from 'lib/api/useApiQuery';
import { INTERCHAIN_MESSAGE } from 'stubs/interchainIndexer';
import { generateListStub } from 'stubs/utils';
import { CollapsibleList } from 'toolkit/chakra/collapsible';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';

import TxDetailsCrossChainMessage from './TxDetailsCrossChainMessage';

interface Props {
  hash: string;
  isLoading: boolean;
}

const TxDetailsCrossChainMessages = ({ hash, isLoading: isLoadingProp }: Props) => {
  const { t: tTx } = useTranslation();

  const { data, isPlaceholderData } = useApiQuery('interchainIndexer:tx_messages', {
    pathParams: { hash },
    queryOptions: {
      placeholderData: generateListStub<'interchainIndexer:tx_messages'>(INTERCHAIN_MESSAGE, 1, { next_page_params: undefined }),
    },
  });

  const isLoading = isLoadingProp || isPlaceholderData;

  const renderItem = React.useCallback((item: InterchainMessage) => {
    return (
      <TxDetailsCrossChainMessage key={ item.message_id } data={ item } isLoading={ isLoading }/>
    );
  }, [ isLoading ]);

  if ((!isPlaceholderData && (!data || !data.items.length))) {
    return null;
  }

  return (
    <>
      <DetailedInfo.ItemLabel
        hint={ tTx('transactions.cross_chain_messages_hint') }
        isLoading={ isLoading }
      >
        { tTx('transactions.cross_chain_messages', { count: (data?.items ?? []).length }) }
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <CollapsibleList
          items={ data?.items ?? [] }
          renderItem={ renderItem }
          cutLength={ 5 }
          text={ [ tTx('transactions.view_messages'), tTx('transactions.hide_messages') ] }
          py={ 1 }
          rowGap="14px"
        />
      </DetailedInfo.ItemValue>
    </>
  );
};

export default React.memo(TxDetailsCrossChainMessages);
