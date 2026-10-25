// Modified by Quat Capital, 2026-10-25: runtime transaction interface localization. GPL-3.0.
import { Text } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { CollapsibleList } from 'toolkit/chakra/collapsible';
import NftEntity from 'ui/shared/entities/nft/NftEntity';

interface Props {
  items: Array<{ total: { token_id: string | null } }>;
  tokenAddress: string;
  isLoading?: boolean;
}

const TxStateTokenIdList = ({ items, tokenAddress, isLoading }: Props) => {
  const { t: tTx } = useTranslation();
  const renderItem = React.useCallback((item: typeof items[number], index: number) => {
    if (item.total.token_id !== null) {
      return <NftEntity key={ index } hash={ tokenAddress } id={ item.total.token_id } isLoading={ isLoading }/>;
    }

    return <Text key={ index } color="text.secondary">{ tTx('home.not_available') }</Text>;
  }, [ isLoading, tokenAddress, tTx ]);

  return (
    <CollapsibleList
      items={ items }
      renderItem={ renderItem }
      triggerProps={{
        pb: { base: '5px', md: 0 },
      }}
      rowGap={ 2 }
    />
  );
};

export default React.memo(TxStateTokenIdList);
