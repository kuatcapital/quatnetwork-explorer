// Modified by Quat Capital, 2026-10-25: localized Optimistic deposits empty state (T18, GPL-3.0).
import { Text } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { SocketMessage } from 'lib/socket/types';

import useApiQuery from 'lib/api/useApiQuery';
import useGradualIncrement from 'lib/hooks/useGradualIncrement';
import useIsMobile from 'lib/hooks/useIsMobile';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import { L2_DEPOSIT_ITEM } from 'stubs/L2';

import LatestTxsFallback from '../fallbacks/LatestTxsFallback';
import LatestDeposits from './LatestDeposits';

const LatestOptimisticDeposits = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const itemsCount = isMobile ? 2 : 5;
  const { data, isPlaceholderData, isError } = useApiQuery('general:homepage_optimistic_deposits', {
    queryOptions: {
      placeholderData: Array(itemsCount).fill(L2_DEPOSIT_ITEM),
    },
  });

  const [ num, setNum ] = useGradualIncrement(0);
  const [ showSocketErrorAlert, setShowSocketErrorAlert ] = React.useState(false);

  const handleSocketClose = React.useCallback(() => {
    setShowSocketErrorAlert(true);
  }, []);

  const handleSocketError = React.useCallback(() => {
    setShowSocketErrorAlert(true);
  }, []);

  const handleNewDepositMessage: SocketMessage.NewOptimisticDeposits['handler'] = React.useCallback((payload) => {
    setNum(payload.deposits);
  }, [ setNum ]);

  const channel = useSocketChannel({
    topic: 'optimism:new_deposits',
    onSocketClose: handleSocketClose,
    onSocketError: handleSocketError,
    isDisabled: false,
  });

  useSocketMessage({
    channel,
    event: 'new_optimism_deposits',
    handler: handleNewDepositMessage,
  });

  if (isError) {
    return <LatestTxsFallback/>;
  }

  if (data) {
    return (
      <LatestDeposits
        items={ data.slice(0, itemsCount).map((item) => (
          { l1BlockNumber: item.l1_block_number, l1TxHash: item.l1_transaction_hash, l2TxHash: item.l2_transaction_hash, timestamp: item.l1_block_timestamp }
        )) }
        isLoading={ isPlaceholderData }
        socketItemsNum={ num }
        showSocketErrorAlert={ showSocketErrorAlert }
      />
    );
  }

  return <Text>{ t('home.no_deposits') }</Text>;
};

export default LatestOptimisticDeposits;
