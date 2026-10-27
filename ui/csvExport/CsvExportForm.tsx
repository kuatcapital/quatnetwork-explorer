// Modified by Quat Capital, 2026-10-27: localized CSV download controls and errors. GPL-3.0.
import { chakra, Flex } from '@chakra-ui/react';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm, FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { FormFields } from './types';
import type { CsvExportParams } from 'types/client/address';

import config from 'configs/app';
import buildUrl from 'lib/api/buildUrl';
import isNeedProxy from 'lib/api/isNeedProxy';
import type { ResourceName } from 'lib/api/resources';
import { useMultichainContext } from 'lib/contexts/multichain';
import dayjs from 'lib/date/dayjs';
import { Alert } from 'toolkit/chakra/alert';
import { Button } from 'toolkit/chakra/button';
import { toaster } from 'toolkit/chakra/toaster';
import { downloadBlob } from 'toolkit/utils/file';
import ReCaptcha from 'ui/shared/reCaptcha/ReCaptcha';
import useReCaptcha from 'ui/shared/reCaptcha/useReCaptcha';

import CsvExportFormField from './CsvExportFormField';
import { getCsvExportErrorText } from './localization';

interface Props {
  hash: string;
  resource: ResourceName;
  filterType?: CsvExportParams['filterType'] | null;
  filterValue?: CsvExportParams['filterValue'] | null;
  fileNameTemplate: string;
  exportType: CsvExportParams['type'] | undefined;
}

const CsvExportForm = ({ hash, resource, filterType, filterValue, fileNameTemplate, exportType }: Props) => {
  const { t } = useTranslation();
  const formApi = useForm<FormFields>({
    mode: 'onBlur',
    defaultValues: {
      from: dayjs().subtract(1, 'day').format('YYYY-MM-DDTHH:mm'),
      to: dayjs().format('YYYY-MM-DDTHH:mm'),
    },
  });
  const { handleSubmit, formState } = formApi;
  const recaptcha = useReCaptcha();
  const multichainContext = useMultichainContext();

  const chainConfig = multichainContext?.chain.app_config || config;

  const apiFetchFactory = React.useCallback((data: FormFields) => {
    return async(recaptchaToken?: string) => {
      const url = buildUrl(resource, { hash } as never, {
        from_period: exportType !== 'holders' ? dayjs(data.from).toISOString() : null,
        to_period: exportType !== 'holders' ? dayjs(data.to).toISOString() : null,
        filter_type: filterType,
        filter_value: filterValue,
      }, undefined, multichainContext?.chain);

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
    };
  }, [ resource, hash, exportType, filterType, filterValue, multichainContext?.chain ]);

  const onFormSubmit: SubmitHandler<FormFields> = React.useCallback(async(data) => {
    try {
      const response = await recaptcha.fetchProtectedResource<Response>(apiFetchFactory(data));
      const chainText = multichainContext?.chain ? `${ multichainContext.chain.name.replace(' ', '-') }_` : '';

      const blob = await response.blob();
      const fileName = exportType === 'holders' ?
        `${ chainText }${ fileNameTemplate }_${ hash }.csv` :
        // eslint-disable-next-line max-len
        `${ chainText }${ fileNameTemplate }_${ hash }_${ data.from }_${ data.to }${ filterType && filterValue ? '_with_filter_type_' + filterType + '_value_' + filterValue : '' }.csv`;
      downloadBlob(blob, fileName);

    } catch (error) {
      toaster.error({
        title: t('common.error'),
        description: getCsvExportErrorText(error, t),
      });
    }

  }, [ recaptcha, apiFetchFactory, multichainContext?.chain, exportType, fileNameTemplate, hash, filterType, filterValue, t ]);

  if (!chainConfig.services.reCaptchaV2.siteKey) {
    return (
      <Alert status="error">
        { t('csvExportUi.captcha_unconfigured') }
      </Alert>
    );
  }

  return (
    <FormProvider { ...formApi }>
      <chakra.form
        noValidate
        onSubmit={ handleSubmit(onFormSubmit) }
      >
        <Flex columnGap={ 5 } rowGap={ 3 } flexDir={{ base: 'column', lg: 'row' }} alignItems={{ base: 'flex-start', lg: 'center' }} flexWrap="wrap">
          { exportType !== 'holders' && <CsvExportFormField name="from" formApi={ formApi }/> }
          { exportType !== 'holders' && <CsvExportFormField name="to" formApi={ formApi }/> }
        </Flex>
        <ReCaptcha { ...recaptcha }/>
        <Button
          variant="solid"
          type="submit"
          mt={ 8 }
          loading={ formState.isSubmitting }
          loadingText={ t('common.download') }
          disabled={ Boolean(formState.errors.from || formState.errors.to || recaptcha.isInitError) }
        >
          { t('common.download') }
        </Button>
      </chakra.form>
    </FormProvider>
  );
};

export default React.memo(CsvExportForm);
