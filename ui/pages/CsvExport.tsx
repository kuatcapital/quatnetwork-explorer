// Modified by Quat Capital, 2026-10-27: complete runtime CSV export descriptions and locale formatting. GPL-3.0.
import { Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { AddressFromToFilterValues } from 'types/api/address';
import type { CsvExportParams } from 'types/client/address';

import type { ResourceName } from 'lib/api/resources';
import useApiQuery from 'lib/api/useApiQuery';
import { useMultichainContext } from 'lib/contexts/multichain';
import throwOnAbsentParamError from 'lib/errors/throwOnAbsentParamError';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import { formatNumber } from 'lib/format/localeNumbers';
import useIsMobile from 'lib/hooks/useIsMobile';
import { useLocale } from 'lib/i18n/provider';
import { ContentLoader } from 'toolkit/components/loaders/ContentLoader';
import CsvExportForm from 'ui/csvExport/CsvExportForm';
import { getCsvExportDescriptionKey } from 'ui/csvExport/localization';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import ChainIcon from 'ui/shared/externalChains/ChainIcon';
import PageTitle from 'ui/shared/Page/PageTitle';

interface ExportTypeEntity {
  resource: ResourceName;
  fileNameTemplate: string;
  filterType?: CsvExportParams['filterType'];
  filterValues?: Readonly<Array<CsvExportParams['filterValue']>>;
}

const EXPORT_TYPES: Record<CsvExportParams['type'], ExportTypeEntity> = {
  transactions: {
    resource: 'general:address_csv_export_txs',
    fileNameTemplate: 'transactions',
    filterType: 'address',
    filterValues: AddressFromToFilterValues,
  },
  'internal-transactions': {
    resource: 'general:address_csv_export_internal_txs',
    fileNameTemplate: 'internal_transactions',
    filterType: 'address',
    filterValues: AddressFromToFilterValues,
  },
  'token-transfers': {
    resource: 'general:address_csv_export_token_transfers',
    fileNameTemplate: 'token_transfers',
    filterType: 'address',
    filterValues: AddressFromToFilterValues,
  },
  logs: {
    resource: 'general:address_csv_export_logs',
    fileNameTemplate: 'logs',
    filterType: 'topic',
  },
  holders: {
    resource: 'general:token_csv_export_holders',
    fileNameTemplate: 'holders',
  },
  'epoch-rewards': {
    resource: 'general:address_csv_export_celo_election_rewards',
    fileNameTemplate: 'epoch_rewards',
  },
};

const isCorrectExportType = (type: string): type is CsvExportParams['type'] => Object.keys(EXPORT_TYPES).includes(type);

const CsvExport = () => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const router = useRouter();
  const isMobile = useIsMobile();
  const multichainContext = useMultichainContext();

  const addressHash = router.query.address?.toString() || '';
  const exportTypeParam = router.query.type?.toString() || '';
  const exportType = isCorrectExportType(exportTypeParam) ? EXPORT_TYPES[exportTypeParam] : null;
  const filterTypeFromQuery = router.query.filterType?.toString() || null;
  const filterValueFromQuery = router.query.filterValue?.toString();

  const addressQuery = useApiQuery('general:address', {
    pathParams: { hash: addressHash },
    queryOptions: {
      enabled: Boolean(addressHash),
    },
  });

  const tokenQuery = useApiQuery('general:token', {
    pathParams: { hash: addressHash },
    queryOptions: {
      enabled: Boolean(addressHash) && exportTypeParam === 'holders',
    },
  });

  const configQuery = useApiQuery('general:config_csv_export', {
    queryOptions: {
      enabled: Boolean(addressHash),
    },
  });

  const isLoading = addressQuery.isPending || configQuery.isPending || (exportTypeParam === 'holders' && tokenQuery.isPending);

  throwOnAbsentParamError(addressHash);
  throwOnAbsentParamError(exportType);

  if (!exportType || !isCorrectExportType(exportTypeParam)) {
    return null;
  }

  const filterType = filterTypeFromQuery === exportType.filterType ? filterTypeFromQuery : null;
  const filterValue = (() => {
    if (!filterType || !filterValueFromQuery) {
      return null;
    }

    if (exportType.filterValues && !exportType.filterValues?.includes(filterValueFromQuery)) {
      return null;
    }

    return filterValueFromQuery;
  })();

  const content = (() => {
    throwOnResourceLoadError(addressQuery);

    if (isLoading) {
      return <ContentLoader/>;
    }

    return (
      <CsvExportForm
        hash={ addressHash }
        resource={ exportType.resource }
        exportType={ isCorrectExportType(exportTypeParam) ? exportTypeParam : undefined }
        filterType={ filterType }
        filterValue={ filterValue }
        fileNameTemplate={ exportType.fileNameTemplate }
      />
    );
  })();

  const description = (() => {
    if (isLoading) {
      return null;
    }

    const chainInfo = multichainContext?.chain ? (
      <Flex display="inline-flex" alignItems="center" columnGap={ 2 }>
        <Trans
          t={ t }
          i18nKey="csvExportUi.on_chain"
          values={{ chain: multichainContext.chain.app_config.chain.name }}
          components={{ icon: <ChainIcon data={ multichainContext.chain }/> }}
        />
      </Flex>
    ) : null;

    const limit = formatNumber(configQuery.data?.limit || 10_000, locale, { maximumFractionDigits: 3, notation: 'compact' });

    if (exportTypeParam === 'holders' && tokenQuery.data) {
      return (
        <Flex mb={ 10 } whiteSpace="pre-wrap" flexWrap="wrap">
          <Trans
            t={ t }
            i18nKey="csvExportUi.holders_description"
            components={{
              entity: <TokenEntity
                token={ tokenQuery.data }
                truncation={ isMobile ? 'constant' : 'dynamic' }
                w="fit-content"
                maxW={{ base: '100%', lg: '400px' }}
                noCopy
                noSymbol
              />,
              chain: <span>{ chainInfo }</span>,
            }}
          />
          <span>{ t('csvExportUi.holders_limit', { limit }) }</span>
        </Flex>
      );
    }

    if (!addressQuery.data) {
      return null;
    }

    const filterDisplayValue = (() => {
      if (filterType !== 'address') return filterValue;
      return filterValue === 'from' ? t('common.from') : t('common.to');
    })();
    const filterText = (() => {
      if (!filterType || !filterValue) return '';
      return filterType === 'address' ?
        t('csvExportUi.address_filter', { value: filterDisplayValue }) :
        t('csvExportUi.topic_filter', { value: filterDisplayValue });
    })();

    return (
      <Flex mb={ 10 } whiteSpace="pre-wrap" flexWrap="wrap">
        <Trans
          t={ t }
          i18nKey={ getCsvExportDescriptionKey(exportTypeParam) }
          components={{
            entity: <AddressEntity
              address={ addressQuery.data }
              truncation={ isMobile ? 'constant' : 'dynamic' }
              noCopy
            />,
            filter: <span>{ filterText }</span>,
            chain: <span>{ chainInfo }</span>,
          }}
        />
        <span>{ t('csvExportUi.records_limit', { limit }) }</span>
      </Flex>
    );
  })();

  return (
    <>
      <PageTitle title={ t('csvExportUi.title') }/>
      { description }
      { content }
    </>
  );
};

export default CsvExport;
