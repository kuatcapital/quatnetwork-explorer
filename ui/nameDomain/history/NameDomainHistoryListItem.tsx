// Modified by Quat Capital, 2026-10-26: T18 reviewed literal localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type * as bens from '@blockscout/bens-types';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import { Badge } from 'toolkit/chakra/badge';
import { stripTrailingSlash } from 'toolkit/utils/url';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';

interface Props {
  event: bens.DomainEvent;
  domain: bens.DetailedDomain | undefined;
  isLoading?: boolean;
}

const NameDomainHistoryListItem = ({ isLoading, domain, event }: Props) => {
  const { t: tQuat } = useTranslation();

  const isProtocolBaseChain = stripTrailingSlash(domain?.protocol?.deployment_blockscout_base_url ?? '') === config.app.baseUrl;
  const txEntityProps = {
    link: { external: !isProtocolBaseChain ? true : false },
    href: !isProtocolBaseChain ? (
      stripTrailingSlash(domain?.protocol?.deployment_blockscout_base_url ?? '') +
      route({ pathname: '/tx/[hash]', query: { hash: event.transaction_hash } })
    ) : undefined,
  };

  return (
    <ListItemMobileGrid.Container>
      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('common.txn_hash') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TxEntity { ...txEntityProps } hash={ event.transaction_hash } isLoading={ isLoading } fontWeight={ 500 } truncation="constant_long" noCopy/>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('common.age') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TimeWithTooltip
          timestamp={ event.timestamp }
          isLoading={ isLoading }
          color="text.secondary"
          display="inline-block"
        />
      </ListItemMobileGrid.Value>

      { event.from_address && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>From</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <AddressEntity address={ event.from_address } isLoading={ isLoading } truncation="constant"/>
          </ListItemMobileGrid.Value>
        </>
      ) }

      { event.action && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('common.method') }</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <Badge colorPalette="gray" loading={ isLoading }>{ event.action }</Badge>
          </ListItemMobileGrid.Value>
        </>
      ) }
    </ListItemMobileGrid.Container>
  );
};

export default React.memo(NameDomainHistoryListItem);
