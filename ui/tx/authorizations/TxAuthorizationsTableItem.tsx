// Modified by Quat Capital, 2026-10-25: runtime transaction interface localization. GPL-3.0.
import { Flex } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { TxAuthorization } from 'types/api/transaction';

import config from 'configs/app';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableRow, TableCell } from 'toolkit/chakra/table';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TxAuthorizationStatus from 'ui/shared/statusTag/TxAuthorizationStatus';

interface Props extends TxAuthorization {
  isLoading?: boolean;
}

const TxAuthorizationsItem = ({ address_hash: addressHash, authority, chain_id: chainId, nonce, isLoading, status }: Props) => {
  const { t: tTx } = useTranslation();
  return (
    <TableRow alignItems="top">
      <TableCell>
        <Flex>
          <AddressEntity address={{ hash: addressHash }} isLoading={ isLoading } noIcon/>
        </Flex>
      </TableCell>
      <TableCell verticalAlign="middle">
        <Flex>
          <AddressEntity address={{ hash: authority }} isLoading={ isLoading } noIcon/>
        </Flex>
      </TableCell>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading } display="inline-block">
          { chainId === Number(config.chain.id) ? tTx('transactions.this_chain') : tTx('transactions.any_chain') }
        </Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading } display="inline-block">
          { nonce }
        </Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle">
        <TxAuthorizationStatus status={ status } loading={ isLoading }/>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(TxAuthorizationsItem);
