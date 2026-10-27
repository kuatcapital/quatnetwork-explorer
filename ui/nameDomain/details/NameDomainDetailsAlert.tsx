// Modified by Quat Capital, 2026-10-27: runtime multichain localization. GPL-3.0.
import { useTranslation , Trans } from 'react-i18next';
import React from 'react';

import type * as bens from '@blockscout/bens-types';

import { Alert } from 'toolkit/chakra/alert';
import { Link } from 'toolkit/chakra/link';

interface Props {
  data: bens.DetailedDomain | undefined;
}

const NameDomainDetailsAlert = ({ data }: Props) => {
  const { t: tQuat } = useTranslation();

  if (!data?.stored_offchain && !data?.resolved_with_wildcard) {
    return null;
  }

  return (
    <Alert status="info" display="inline-block" whiteSpace="pre-wrap" mb={ 6 }>
      <Trans
        t={ tQuat }
        i18nKey="multiUi.offchain_domain"
        components={{ protocols: <>
          { data.stored_offchain && <Link external href="https://eips.ethereum.org/EIPS/eip-3668">EIP-3668: CCIP Read</Link> }
          { data.stored_offchain && data.resolved_with_wildcard && <span> & </span> }
          { data.resolved_with_wildcard && <Link external href="https://eips.ethereum.org/EIPS/eip-2544">EIP-2544: Wildcard Resolution</Link> }
        </> }}
      />
    </Alert>
  );
};

export default React.memo(NameDomainDetailsAlert);
