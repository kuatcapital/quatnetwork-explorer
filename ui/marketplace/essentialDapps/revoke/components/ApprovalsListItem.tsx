// Modified by Quat Capital, 2026-10-26: marketplace, rewards or token info localization. GPL-3.0.
import { Text } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { EssentialDappsChainConfig } from 'types/client/marketplace';
import type { AllowanceType } from 'types/client/revoke';

import dayjs from 'lib/date/dayjs';
import { useLocale } from 'lib/i18n/provider';
import { Button } from 'toolkit/chakra/button';
import { Skeleton } from 'toolkit/chakra/skeleton';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';
import NumberEntity from 'ui/shared/NumberEntity';
import Time from 'ui/shared/time/Time';

import useRevoke from '../hooks/useRevoke';
import formatAllowance from '../lib/formatAllowance';

type Props = {
  selectedChain: EssentialDappsChainConfig | undefined;
  approval: AllowanceType;
  isLoading?: boolean;
  isAddressMatch?: boolean;
  hideApproval: (approval: AllowanceType) => void;
};

export default function ApprovalsListItem({
  selectedChain,
  approval,
  isLoading,
  isAddressMatch,
  hideApproval,
}: Props) {
  const { t: tEco } = useTranslation();
  const { locale } = useLocale();
  const revoke = useRevoke();
  const [ isPending, setIsPending ] = useState(false);

  const allowance = formatAllowance(approval);

  const handleRevoke = useCallback(async() => {
    setIsPending(true);
    const success = await revoke(approval, Number(selectedChain?.id));
    if (success) {
      hideApproval(approval);
    }
    setIsPending(false);
  }, [ revoke, hideApproval, approval, selectedChain?.id ]);

  return (
    <ListItemMobileGrid.Container
      gridTemplateColumns="minmax(0, 1fr) minmax(0, 1fr)"
      fontWeight="500"
      _first={{
        borderTop: 0,
        paddingTop: 0,
      }}
      _last={{
        borderBottom: 0,
        paddingBottom: 0,
      }}
    >
      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tEco('marketplaceUI.token') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value display="flex" flexDir="column" gap={ 2 } color="inherit">
        <TokenEntity
          token={{
            address_hash: approval.address,
            type: approval.type,
            symbol: approval.symbol || null,
            name: approval.name || null,
            icon_url: approval.tokenIcon || null,
            reputation: approval.tokenReputation,
          }}
          isLoading={ isLoading }
          noCopy
          jointSymbol
          chain={ selectedChain }
          link={{ noIcon: true, external: true }}
        />
        <AddressEntity
          address={{ hash: approval.address }}
          truncation="constant"
          noIcon
          isLoading={ isLoading }
          chain={ selectedChain }
          link={{ noIcon: true, external: true }}
        />
      </ListItemMobileGrid.Value>
      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tEco('marketplaceUI.approved_spender') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <AddressEntity
          address={{ hash: approval.spender }}
          truncation="constant"
          noIcon
          isLoading={ isLoading }
          chain={ selectedChain }
          link={{ noIcon: true, external: true }}
        />
      </ListItemMobileGrid.Value>
      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tEco('marketplaceUI.approved_amount') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value color="inherit">
        <Skeleton loading={ isLoading }>
          <NumberEntity
            value={ allowance === 'Unlimited' ? tEco('marketplaceUI.unlimited') : allowance }
            postfix={
              [ 'Unlimited', 'N/A' ].includes(allowance) ? '' : approval.symbol
            }
          />
        </Skeleton>
      </ListItemMobileGrid.Value>
      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tEco('marketplaceUI.value_at_risk') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value color="inherit">
        <Skeleton loading={ isLoading }>
          { approval.valueAtRiskUsd ? (
            <NumberEntity
              value={ approval.valueAtRiskUsd.toString() }
              suffix="$"
            />
          ) : '-' }
        </Skeleton>
      </ListItemMobileGrid.Value>
      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tEco('marketplaceUI.last_updated') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value color="inherit">
        <Skeleton loading={ isLoading } display="flex" flexDir="column" rowGap={ 2 }>
          <Time timestamp={ approval.timestamp }/>
          <Text>{ dayjs(approval.timestamp).locale(locale).fromNow() }</Text>
        </Skeleton>
      </ListItemMobileGrid.Value>
      { isAddressMatch && (
        <Button
          size="sm"
          variant="outline"
          loading={ isLoading || isPending }
          onClick={ handleRevoke }
          gridColumn="span 2"
        >
          { tEco('marketplaceUI.revoke') }</Button>
      ) }
    </ListItemMobileGrid.Container>
  );
}
