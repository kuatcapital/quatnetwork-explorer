// Modified by Quat Capital, 2026-10-26: T18 reviewed literal localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { AdvancedFilterParams } from 'types/api/advancedFilter';

import config from 'configs/app';
import buildUrl from 'lib/api/buildUrl';
import isNeedProxy from 'lib/api/isNeedProxy';
import { useMultichainContext } from 'lib/contexts/multichain';
import dayjs from 'lib/date/dayjs';
import { Button } from 'toolkit/chakra/button';
import { toaster } from 'toolkit/chakra/toaster';
import { Tooltip } from 'toolkit/chakra/tooltip';
import { downloadBlob } from 'toolkit/utils/file';
import ReCaptcha from 'ui/shared/reCaptcha/ReCaptcha';
import useReCaptcha from 'ui/shared/reCaptcha/useReCaptcha';

type Props = {
  filters: AdvancedFilterParams;
};

const ExportCSV = ({ filters }: Props) => {
  const { t: tQuat } = useTranslation();

  const multichainContext = useMultichainContext();
  const recaptcha = useReCaptcha();

  const [ isLoading, setIsLoading ] = React.useState(false);

  const apiFetchFactory = React.useCallback(async(recaptchaToken?: string) => {
    const url = buildUrl('general:advanced_filter_csv', undefined, filters, undefined, multichainContext?.chain);

    const response = await fetch(url, {
      headers: {
        'content-type': 'application/octet-stream',
        ...(recaptchaToken && { 'recaptcha-v2-response': recaptchaToken }),
        ...(isNeedProxy() && multichainContext?.chain ? { 'x-endpoint': multichainContext.chain.app_config.apis.general?.endpoint } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(response.statusText, {
        cause: {
          status: response.status,
        },
      });
    }

    return response;
  }, [ filters, multichainContext?.chain ]);

  const handleExportCSV = React.useCallback(async() => {
    try {
      setIsLoading(true);

      const response = await recaptcha.fetchProtectedResource(apiFetchFactory);

      const blob = await response.blob();

      const chainText = multichainContext?.chain ? `${ multichainContext.chain.name.replace(' ', '-') }_` : '';
      const fileName = `${ chainText }export-filtered-txs-${ dayjs().format('YYYY-MM-DD-HH-mm-ss') }.csv`;
      downloadBlob(blob, fileName);

    } catch (error) {
      toaster.error({
        title: tQuat('common.error'),
        description: (error as Error)?.message || tQuat('advancedFilterUi.later_error'),
      });
    } finally {
      setIsLoading(false);
    }
  }, [ apiFetchFactory, recaptcha, multichainContext?.chain, tQuat ]);

  const chainConfig = multichainContext?.chain.app_config || config;

  if (!chainConfig.services.reCaptchaV2.siteKey) {
    return null;
  }

  return (
    <>
      <Tooltip
        content={ tQuat('advancedFilterUi.recaptcha_error') }
        disabled={ !recaptcha.isInitError }
      >
        <Button
          onClick={ handleExportCSV }
          variant="outline"
          loading={ isLoading }
          size="sm"
          mr={ 3 }
          disabled={ recaptcha.isInitError }
        >{ tQuat('advancedFilterUi.export_csv') }</Button>
      </Tooltip>
      <ReCaptcha { ...recaptcha } hideWarning/>
    </>
  );
};

export default ExportCSV;
