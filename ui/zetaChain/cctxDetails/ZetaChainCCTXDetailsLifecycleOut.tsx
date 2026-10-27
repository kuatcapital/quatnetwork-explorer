// Modified by Quat Capital, 2026-10-27: T18 reviewed literal localization. GPL-3.0.
import { Flex, Grid, Text } from '@chakra-ui/react';
import { BigNumber } from 'bignumber.js';
import React from 'react';

import { type OutboundParams, type CrossChainTx, CctxStatus } from '@blockscout/zetachain-cctx-types';

import config from 'configs/app';
import { Skeleton } from 'toolkit/chakra/skeleton';
import AddressEntityZetaChain from 'ui/shared/entities/address/AddressEntityZetaChain';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TxEntityZetaChainCC from 'ui/shared/entities/tx/TxEntityZetaChainCC';
import TxEntityZetaChainExternal from 'ui/shared/entities/tx/TxEntityZetaChainExternal';
import IconSvg from 'ui/shared/IconSvg';
import StatusTag from 'ui/shared/statusTag/StatusTag';
import ZetaChainCCTXValue from 'ui/shared/zetaChain/ZetaChainCCTXValue';
import useZetaChainConfig from 'ui/zetaChain/useZetaChainConfig';
import { useTranslation } from 'react-i18next';


type Props = {
  outboundParam: OutboundParams;
  tx: CrossChainTx;
  isLoading: boolean;
  isLast: boolean;
  hasTxAfter: boolean;
};

const ZetaChainCCTXDetailsLifecycleOut = ({ outboundParam, tx, isLoading, isLast, hasTxAfter }: Props) => {
  const { t: tQuat } = useTranslation();

  const { data: chainsConfig } = useZetaChainConfig();
  const chainToId = outboundParam.receiver_chain_id?.toString() || '';
  const chainTo = chainsConfig?.find((chain) => chain.id.toString() === chainToId);

  const gasDecimals = config.chain.currency.decimals;

  if (tx.cctx_status?.status === CctxStatus.PENDING_INBOUND) {
    return null;
  }

  let content: React.ReactNode = null;
  let text: string = '';
  let color: string = '';

  const transactionOrCCTX = (() => {
    if (!outboundParam.hash) {
      return null;
    }
    const isCCTX = tx.related_cctxs.some((cctx) => cctx.index === outboundParam.hash);
    if (isCCTX) {
      return (
        <>
          <Text color="text.secondary" fontWeight="medium">CCTX</Text>
          <TxEntityZetaChainCC
            hash={ outboundParam.hash }
            isLoading={ isLoading }
            noIcon
          />
        </>
      );
    }
    return (
      <>
        <Text color="text.secondary" fontWeight="medium">{ tQuat('common.transaction') }</Text>
        { chainToId !== config.chain.id ? (
          <TxEntityZetaChainExternal chainId={ chainToId } hash={ outboundParam.hash } noIcon/>
        ) : (
          <TxEntity hash={ outboundParam.hash } noIcon/>
        ) }
      </>
    );
  })();

  if (tx.cctx_status?.status === CctxStatus.OUTBOUND_MINED) {
    content = (
      <>
        { transactionOrCCTX }
        <Text color="text.secondary" fontWeight="medium">{ tQuat('common.status') }</Text>
        <StatusTag type="ok" text="Success"/>
        <Text color="text.secondary" fontWeight="medium">{ tQuat('multiUi.receiver') }</Text>
        <AddressEntityZetaChain
          address={{ hash: outboundParam.receiver }}
          chainId={ outboundParam.receiver_chain_id?.toString() }
          isLoading={ isLoading }
          truncation="constant"
        />
        <Text color="text.secondary" fontWeight="medium">{ tQuat('multiUi.transferred') }</Text>
        <ZetaChainCCTXValue
          coinType={ outboundParam.coin_type }
          tokenSymbol={ tx.token_symbol }
          amount={ outboundParam.amount }
          decimals={ tx.decimals ?? null }
          isLoading={ isLoading }
        />
        <Text color="text.secondary" fontWeight="medium">{ tQuat('common.gas_used') }</Text>
        <Text overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
          { BigNumber(outboundParam.gas_used || 0).div(10 ** gasDecimals).toFormat() }
        </Text>
      </>
    );
    text = `Sent tx to ${ chainTo?.name || 'Unknown chain' }`;
    color = 'text.success';
  } else if (tx.cctx_status?.status === CctxStatus.PENDING_REVERT) {
    if (!isLast) {
      content = (
        <>
          { transactionOrCCTX }
          <Text color="text.secondary" fontWeight="medium">{ tQuat('common.status') }</Text>
          <StatusTag type="error" text="Failed"/>
        </>
      );
      text = `Destination tx failed`;
      color = 'text.error';
    } else {
      content = (
        <>
          <Text color="text.secondary" fontWeight="medium">{ tQuat('multiUi.reverting') }</Text>
          <AddressEntityZetaChain
            address={{ hash: outboundParam.receiver }}
            chainId={ outboundParam.receiver_chain_id?.toString() }
            isLoading={ isLoading }
            truncation="constant"
          />
        </>
      );
      text = `Waiting for revert to ${ chainTo?.name || 'Unknown chain' }`;
      color = 'text.secondary';
    }
  } else if (tx.cctx_status?.status === CctxStatus.PENDING_OUTBOUND) {
    content = (
      <>
        <Text color="text.secondary" fontWeight="medium">{ tQuat('multiUi.destination') }</Text>
        <AddressEntityZetaChain
          address={{ hash: outboundParam.receiver }}
          chainId={ outboundParam.receiver_chain_id?.toString() }
          isLoading={ isLoading }
          truncation="constant"
        />
        <Text color="text.secondary" fontWeight="medium">Nonce</Text>
        <Text>{ outboundParam.tss_nonce }</Text>
      </>
    );
    text = `Waiting for outbound tx to ${ chainTo?.name || 'Unknown chain' }`;
    color = 'text.secondary';
  } else if (tx.cctx_status?.status === CctxStatus.REVERTED) {
    if (!isLast) {
      content = (
        <>
          { transactionOrCCTX }
          <Text color="text.secondary" fontWeight="medium">{ tQuat('common.status') }</Text>
          <StatusTag type="error" text="Failed"/>
        </>
      );
      text = `Destination tx failed`;
      color = 'text.error';
    } else {
      content = (
        <>
          <Text color="text.secondary" fontWeight="medium">{ tQuat('multiUi.origin') }</Text>
          <AddressEntityZetaChain
            address={{ hash: outboundParam.receiver }}
            chainId={ outboundParam.receiver_chain_id?.toString() }
            isLoading={ isLoading }
            truncation="constant"
          />
          { transactionOrCCTX }
          <Text color="text.secondary" fontWeight="medium">{ tQuat('common.status') }</Text>
          <StatusTag type="ok" text="Success"/>
          <Text color="text.secondary" fontWeight="medium">{ tQuat('multiUi.transferred') }</Text>
          <ZetaChainCCTXValue
            coinType={ outboundParam.coin_type }
            tokenSymbol={ tx.token_symbol }
            amount={ outboundParam.amount }
            decimals={ tx.decimals ?? null }
            isLoading={ isLoading }
          />
          <Text color="text.secondary" fontWeight="medium">{ tQuat('common.gas_used') }</Text>
          <Text overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
            { BigNumber(outboundParam.gas_used || 0).div(10 ** gasDecimals).toFormat() }&nbsp;
          </Text>
        </>
      );
      text = `Reverted to ${ chainTo?.name || 'Unknown chain' }`;
      color = 'text.success';
    }
  } else if (tx.cctx_status?.status === CctxStatus.ABORTED) {
    if (!isLast) {
      content = (
        <>
          <Text color="text.secondary" fontWeight="medium">{ tQuat('multiUi.receiver') }</Text>
          <AddressEntityZetaChain
            address={{ hash: outboundParam.receiver }}
            chainId={ outboundParam.receiver_chain_id?.toString() }
            isLoading={ isLoading }
            truncation="constant"
          />
        </>
      );
      text = `Destination tx failed`;
      color = 'text.error';
    } else {
      content = (
        <>
          <Text color="text.secondary" fontWeight="medium">{ tQuat('transactions.sender') }</Text>
          <AddressEntityZetaChain
            address={{ hash: outboundParam.receiver }}
            chainId={ outboundParam.receiver_chain_id?.toString() }
            isLoading={ isLoading }
            truncation="constant"
          />
        </>
      );
      const isFailed = tx.cctx_status?.is_abort_refunded === false;
      text = isFailed ? `Abort failed` : `Abort executed`;
      color = isFailed ? 'text.error' : 'text.success';
    }
  }

  return (
    <>
      { /* we need this block here to cover the vertical line (if it's the last block in lifecycle) */ }
      <Flex
        h="100%"
        w="100%"
        bg={ (isLast && !hasTxAfter) ? 'bg.primary' : 'transparent' }
        zIndex={ 1 }
      >
        <IconSvg name="verification-steps/finalized" boxSize={ 5 } bg="bg.primary" zIndex={ 1 } color={ color }/>
      </Flex>
      <Skeleton loading={ isLoading } w="100%" overflow="hidden">
        <Flex color={ color } maxH="20px" alignItems="center" mb={ 2.5 }>
          { text }
        </Flex>
        <Grid
          templateColumns="100px 1fr"
          gap={ 3 }
          bg={{ _light: 'blackAlpha.100', _dark: 'whiteAlpha.100' }}
          py={ 3 }
          px={ 4 }
          borderBottomRadius="md"
          fontSize="sm"
        >
          { content }
        </Grid>
      </Skeleton>
    </>
  );
};

export default ZetaChainCCTXDetailsLifecycleOut;
