// Modified by Quat Capital, 2026-10-27: complete runtime multichain localization. GPL-3.0.
import { useTranslation } from 'react-i18next';

import type { ZetaChainCCTXFilterParams } from 'types/client/zetaChain';

import ZetaChainAddressFilter from './ZetaChainAddressFilter';

const FILTER_PARAM_SENDER = 'sender_address';
const FILTER_PARAM_SENDER_CHAIN = 'source_chain_id';

type Props = {
  value?: Array<string>;
  chainValue?: Array<string>;
  handleFilterChange: (field: keyof ZetaChainCCTXFilterParams, value?: Array<string> | Array<string>) => void;
  columnName: string;
  isLoading?: boolean;
  onClose?: () => void;
};

const ZetaChainSenderFilter = (props: Props) => {
  const { t: tQuat } = useTranslation();

  return (
    <ZetaChainAddressFilter
      { ...props }
      filterParam={ FILTER_PARAM_SENDER }
      chainFilterParam={ FILTER_PARAM_SENDER_CHAIN }
      title={ tQuat('transactions.sender') }
      placeholder={ tQuat('multiUi.sender_address') }
    />
  );
};

export default ZetaChainSenderFilter;
