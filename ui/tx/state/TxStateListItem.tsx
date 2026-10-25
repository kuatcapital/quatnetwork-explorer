// Modified by Quat Capital, 2026-10-25: runtime transaction interface localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { TxStateChange } from 'types/api/txStateChanges';

import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';

import { useStateElements } from './utils';

interface Props {
  data: TxStateChange;
  isLoading?: boolean;
}

const TxStateListItem = ({ data, isLoading }: Props) => {
  const { t: tTx } = useTranslation();

  const { before, after, change, tag, tokenId } = useStateElements(data, isLoading);

  return (
    <ListItemMobileGrid.Container>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tTx('common.address') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value py="3px" display="flex" flexWrap="nowrap" columnGap={ 3 }>
        <AddressEntity
          address={ data.address }
          isLoading={ isLoading }
          truncation="constant"
        />
        { tag }
      </ListItemMobileGrid.Value>

      { before && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>{ tTx('transactions.before') }</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>{ before }</ListItemMobileGrid.Value>
        </>
      ) }

      { after && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>{ tTx('transactions.after') }</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>{ after }</ListItemMobileGrid.Value>
        </>
      ) }

      { change && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>{ tTx('transactions.change') }</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>{ change }</ListItemMobileGrid.Value>
        </>
      ) }

      { tokenId && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>{ tTx('transactions.token_id') }</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value py="0">{ tokenId }</ListItemMobileGrid.Value>
        </>
      ) }

    </ListItemMobileGrid.Container>
  );
};

export default TxStateListItem;
