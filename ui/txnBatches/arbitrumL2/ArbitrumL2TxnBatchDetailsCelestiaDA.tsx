// Modified by Quat Capital, 2026-10-27: localized L2 and interop interface. GPL-3.0.
// Modified by Quat Capital, 2026-10-26: T18 reviewed literal localization. GPL-3.0.
import { Flex } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { ArbitrumL2TxnBatchDACelestia } from 'types/api/arbitrumL2';

import config from 'configs/app';
import CeleniumLink from 'ui/shared/batch/CeleniumLink';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';

const feature = config.features.rollup;

interface Props {
  data: ArbitrumL2TxnBatchDACelestia;
}

const ArbitrumL2TxnBatchDetailsCelestiaDA = ({ data }: Props) => {
  const { t: tQuat } = useTranslation();

  return (
    <>
      <DetailedInfo.ItemLabel
        hint={ tQuat('l2Ui.celestia_block_hint') }
      >{ tQuat('l2Ui.height') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue wordBreak="break-all" whiteSpace="break-spaces">
        { data.height }
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint={ tQuat('l2Ui.da_proof_hint') }
      >{ tQuat('blobUI.commitment') }</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue flexWrap="nowrap">
        <Flex overflow="hidden" minW="0">
          <HashStringShortenDynamic hash={ data.transaction_commitment }/>
        </Flex>
        <CopyToClipboard text={ data.transaction_commitment } mr={ 3 }/>
        { feature.isEnabled && feature.DA.celestia.namespace && (
          <CeleniumLink
            commitment={ data.transaction_commitment }
            namespace={ feature.DA.celestia.namespace }
            height={ data.height }
          />
        ) }
      </DetailedInfo.ItemValue>
    </>
  );
};

export default ArbitrumL2TxnBatchDetailsCelestiaDA;
