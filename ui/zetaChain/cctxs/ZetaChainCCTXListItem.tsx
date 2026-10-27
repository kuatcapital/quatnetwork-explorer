// Modified by Quat Capital, 2026-10-27: T18 reviewed literal localization. GPL-3.0.
import { Grid, VStack, Text } from '@chakra-ui/react';
import React from 'react';

import type { CctxListItem } from '@blockscout/zetachain-cctx-types';

import dayjs from 'lib/date/dayjs';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { SECOND } from 'toolkit/utils/consts';
import AddressEntityZetaChain from 'ui/shared/entities/address/AddressEntityZetaChain';
import TxEntityZetaChainCC from 'ui/shared/entities/tx/TxEntityZetaChainCC';
import TextSeparator from 'ui/shared/TextSeparator';
import Time from 'ui/shared/time/Time';
import ZetaChainCCTXReducedStatus from 'ui/shared/zetaChain/ZetaChainCCTXReducedStatus';
import ZetaChainCCTXValue from 'ui/shared/zetaChain/ZetaChainCCTXValue';
import { useTranslation } from 'react-i18next';


type Props = {
  tx: CctxListItem;
  isLoading?: boolean;
  animation?: string;
};

const LatestZetaChainCCTXItem = ({ tx, isLoading, animation }: Props) => {
  const { t: tQuat } = useTranslation();

  return (
    <VStack
      width="100%"
      borderBottom="1px solid"
      borderColor="border.divider"
      py={ 3 }
      fontSize="sm"
      alignItems="start"
      gap={ 2 }
      animation={ animation }
    >
      <ZetaChainCCTXReducedStatus status={ tx.status_reduced } isLoading={ isLoading } type="full"/>
      <TxEntityZetaChainCC hash={ tx.index } isLoading={ isLoading } truncation="constant_long" fontWeight={ 600 }/>
      <Skeleton loading={ isLoading } display="flex" color="text.secondary" gap={ 2 } justifyContent="start">
        { dayjs(Number(tx.last_update_timestamp) * SECOND).fromNow() }
        <TextSeparator mx={ 0 }/>
        <Time timestamp={ Number(tx.last_update_timestamp) * SECOND } format="lll_s"/>
      </Skeleton>
      <Grid gridTemplateColumns="100px 1fr" gap={ 2 }>
        <Text>{ tQuat('transactions.sender') }</Text>
        <AddressEntityZetaChain
          address={{ hash: tx.sender_address }}
          chainId={ tx.source_chain_id.toString() }
          isLoading={ isLoading }
          truncation="constant"
        />
        <Text>{ tQuat('multiUi.receiver') }</Text>
        <AddressEntityZetaChain
          address={{ hash: tx.receiver_address }}
          chainId={ tx.target_chain_id.toString() }
          isLoading={ isLoading }
          truncation="constant"
        />
        <Text>Asset</Text>
        <ZetaChainCCTXValue
          coinType={ tx.coin_type }
          tokenSymbol={ tx.token_symbol }
          amount={ tx.amount }
          decimals={ tx.decimals }
          isLoading={ isLoading }
        />
      </Grid>
    </VStack>
  );
};

export default React.memo(LatestZetaChainCCTXItem);
