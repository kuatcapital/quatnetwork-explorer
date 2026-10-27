// Modified by Quat Capital, 2026-10-27: T18 reviewed literal localization. GPL-3.0.
import { Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { useMultichainContext } from 'lib/contexts/multichain';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import ChainIcon from 'ui/shared/externalChains/ChainIcon';
import PageTitle from 'ui/shared/Page/PageTitle';
import Sol2UmlDiagram from 'ui/sol2uml/Sol2UmlDiagram';

const Sol2Uml = () => {
  const { t: tQuat } = useTranslation();

  const router = useRouter();
  const multichainContext = useMultichainContext();

  const addressHash = router.query.address?.toString() || '';

  return (
    <>
      <PageTitle title={ tQuat('suppUi.uml_title') }/>
      <Flex mb={ 10 } flexWrap="wrap" columnGap={ 1 }>
        <Trans
          t={ tQuat }
          i18nKey={ multichainContext?.chain ? 'suppUi.uml_chain_contract' : 'suppUi.uml_contract' }
          values={{ chainName: multichainContext?.chain?.app_config.chain.name }}
          components={{
            address: <AddressEntity address={{ hash: addressHash, is_contract: true }} noCopy/>,
            chain: <Flex display="inline-flex" alignItems="center"/>,
            icon: multichainContext?.chain ? <ChainIcon data={ multichainContext.chain } ml={ 1 } mr={ 2 }/> : <span/>,
          }}
        />
      </Flex>
      <Sol2UmlDiagram addressHash={ addressHash }/>
    </>
  );
};

export default Sol2Uml;
