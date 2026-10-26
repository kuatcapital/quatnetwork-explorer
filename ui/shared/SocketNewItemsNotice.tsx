// Modified by Quat Capital, 2026-10-26: complete localized socket messages and quantity forms. GPL-3.0.
import { chakra } from '@chakra-ui/react';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import config from 'configs/app';
import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { Alert } from 'toolkit/chakra/alert';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';

const flashblocksFeature = config.features.flashblocks;

interface InjectedProps {
  content: React.ReactNode;
}

interface Props {
  type?: 'transaction' | 'token_transfer' | 'deposit' | 'block' | 'flashblock' | 'cross_chain_transaction';
  children?: (props: InjectedProps) => React.JSX.Element;
  className?: string;
  url?: string;
  showErrorAlert?: boolean;
  num?: number;
  isLoading?: boolean;
  onLinkClick?: () => void;
}

const MESSAGE_KEYS = {
  transaction: { scan: 'sharedUi.scan_transactions', arrived: 'sharedUi.arrived_transactions' },
  token_transfer: { scan: 'sharedUi.scan_transfers', arrived: 'sharedUi.arrived_transfers' },
  deposit: { scan: 'sharedUi.scan_deposits', arrived: 'sharedUi.arrived_deposits' },
  block: { scan: 'sharedUi.scan_blocks', arrived: 'sharedUi.arrived_blocks' },
  flashblock: { scan: 'sharedUi.scan_flashblocks', arrived: 'sharedUi.arrived_flashblocks' },
  cross_chain_transaction: { scan: 'sharedUi.scan_cross_transactions', arrived: 'sharedUi.arrived_cross_transactions' },
} as const;

const SocketNewItemsNotice = chakra(({ children, className, url, num, showErrorAlert, type = 'transaction', isLoading, onLinkClick }: Props) => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const handleLinkClick = React.useCallback(() => {
    onLinkClick ? onLinkClick() : window.location.reload();
  }, [ onLinkClick ]);

  const alertContent = (() => {
    if (showErrorAlert) {
      return t('sharedUi.updates_delayed');
    }

    const keys = MESSAGE_KEYS[type];
    const name = flashblocksFeature.isEnabled ? flashblocksFeature.name : t('sharedUi.flashblock');

    if (!num) {
      return t(keys.scan, { name });
    }

    if (type === 'cross_chain_transaction') {
      return (
        <Link href={ url } onClick={ !url ? handleLinkClick : undefined }>{ t('sharedUi.more_cross_transactions') }</Link>
      );
    }

    return (
      <Trans
        t={ t }
        i18nKey={ keys.arrived }
        count={ num }
        values={{ value: formatNumber(num, locale), name }}
        components={{ records: <Link href={ url } onClick={ !url ? handleLinkClick : undefined }/> }}
      />
    );
  })();

  const content = !isLoading ? (
    <Alert
      className={ className }
      status={ showErrorAlert || !num ? 'warning_table' : 'info' }
      px={ 4 }
      py="6px"
      textStyle="sm"
    >
      { alertContent }
    </Alert>
  ) : <Skeleton className={ className } h="36px" loading/>;

  return children ? children({ content }) : content;
});

export default SocketNewItemsNotice;

export const Desktop = ({ ...props }: Props) => {
  return (
    <SocketNewItemsNotice
      borderRadius={ props.isLoading ? 'sm' : 0 }
      h={ props.isLoading ? 5 : 'auto' }
      maxW={ props.isLoading ? '215px' : undefined }
      w="100%"
      mx={ props.isLoading ? 4 : 0 }
      my={ props.isLoading ? '6px' : 0 }
      { ...props }
    >
      { ({ content }) => <TableRow><TableCell colSpan={ 100 } p={ 0 } _first={{ p: 0 }} _last={{ p: 0 }}>{ content }</TableCell></TableRow> }
    </SocketNewItemsNotice>
  );
};

export const Mobile = ({ ...props }: Props) => {
  return (
    <SocketNewItemsNotice
      borderBottomRadius={ 0 }
      { ...props }
    />
  );
};
