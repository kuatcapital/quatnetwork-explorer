// Modified by Quat Capital, 2026-10-27: T18 reviewed literal localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { Pool } from 'types/api/pools';

import { NUMBER_LOCALES } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import getPoolLinks from 'lib/pools/getPoolLinks';
import { Image } from 'toolkit/chakra/image';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import PoolEntity from 'ui/shared/entities/pool/PoolEntity';
import HashStringShorten from 'ui/shared/HashStringShorten';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';

type Props = {
  item: Pool;
  isLoading?: boolean;
};

const PoolsListItem = ({ item, isLoading }: Props) => {
  const { locale } = useLocale();
  const { t: tQuat } = useTranslation();

  const externalLinks = getPoolLinks(item);
  return (
    <ListItemMobileGrid.Container gridTemplateColumns="100px auto">

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('suppUi.pool') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <PoolEntity pool={ item } fontWeight={ 700 } isLoading={ isLoading }/>
      </ListItemMobileGrid.Value>

      { item.is_contract && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('suppUi.contract') }</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <AddressEntity address={{ hash: item.pool_id }} noIcon link={{ variant: 'secondary' }} isLoading={ isLoading } truncation="constant_long"/>
          </ListItemMobileGrid.Value>
        </>
      ) }

      { !item.is_contract && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('suppUi.pool_id') }</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <HashStringShorten hash={ item.pool_id } type="long"/>
            <CopyToClipboard text={ item.pool_id }/>
          </ListItemMobileGrid.Value>
        </>
      ) }

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('suppUi.liquidity') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton loading={ isLoading }>
          ${ Number(item.liquidity).toLocaleString(NUMBER_LOCALES[locale], { maximumFractionDigits: 2, notation: 'compact' }) }
        </Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ tQuat('suppUi.view_in') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton loading={ isLoading }>
          { externalLinks.map((link) => (
            <Link external href={ link.url } key={ link.url } display="inline-flex">
              <Image src={ link.image } alt={ link.title } boxSize={ 5 } mr={ 2 }/>
              { link.title }
            </Link>
          )) }
        </Skeleton>
      </ListItemMobileGrid.Value>
    </ListItemMobileGrid.Container>
  );
};

export default PoolsListItem;
