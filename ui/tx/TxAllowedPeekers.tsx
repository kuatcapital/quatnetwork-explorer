// Modified by Quat Capital, 2026-10-25: runtime transaction interface localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import { CollapsibleList } from 'toolkit/chakra/collapsible';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';

interface Props {
  items: Array<string>;
}

const TxAllowedPeekers = ({ items }: Props) => {
  const { t: tTx } = useTranslation();
  const renderItem = React.useCallback((item: string) => {
    return <AddressEntity key={ item } address={{ hash: item, is_contract: true }}/>;
  }, []);

  return (
    <>
      <DetailedInfo.ItemLabel
        hint={ tTx('transactions.allowed_peekers_hint') }
      >
        { tTx('transactions.allowed_peekers') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <CollapsibleList
          items={ items }
          renderItem={ renderItem }
          cutLength={ 2 }
          rowGap={ 3 }
        />
      </DetailedInfo.ItemValue>
    </>
  );
};

export default React.memo(TxAllowedPeekers);
