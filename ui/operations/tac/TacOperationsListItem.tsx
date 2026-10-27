// Modified by Quat Capital, 2026-10-27: continue runtime RU/KK/EN localization. GPL-3.0.
// Modified by Quat Capital, 2026-10-26: T18 reviewed literal localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type * as tac from '@blockscout/tac-operation-lifecycle-types';

import AddressEntityTacTon from 'ui/shared/entities/address/AddressEntityTacTon';
import OperationEntity from 'ui/shared/entities/operation/OperationEntity';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';
import TacOperationStatus from 'ui/shared/statusTag/TacOperationStatus';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';

type Props = { item: tac.OperationBriefDetails; isLoading?: boolean };

const TacOperationsListItem = ({ item, isLoading }: Props) => {
  const { t: tQuat } = useTranslation();

  return (
    <ListItemMobileGrid.Container>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('l2Ui.operation') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <OperationEntity
          id={ item.operation_id }
          type={ item.type }
          isLoading={ isLoading }
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('l2Ui.age') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TimeWithTooltip
          timestamp={ item.timestamp }
          isLoading={ isLoading }
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('l2Ui.status') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TacOperationStatus status={ item.type } isLoading={ isLoading }/>
      </ListItemMobileGrid.Value>

      { item.sender && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('l2Ui.sender') }</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <AddressEntityTacTon
              address={{ hash: item.sender.address }}
              chainType={ item.sender.blockchain }
              isLoading={ isLoading }
            />
          </ListItemMobileGrid.Value>
        </>
      ) }

    </ListItemMobileGrid.Container>
  );
};

export default TacOperationsListItem;
