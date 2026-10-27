// Modified by Quat Capital, 2026-10-27: localized CSV date labels with stable form field names. GPL-3.0.
import React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { FormFields } from './types';

import dayjs from 'lib/date/dayjs';
import { NUMBER_LOCALES } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { FormFieldText } from 'toolkit/components/forms/fields/FormFieldText';

interface Props {
  formApi: UseFormReturn<FormFields>;
  name: 'from' | 'to';
}

const CsvExportFormField = ({ formApi, name }: Props) => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const { formState, getValues, trigger } = formApi;

  const validate = React.useCallback((newValue: string) => {
    if (name === 'from') {
      const toValue = getValues('to');
      if (toValue && dayjs(newValue) > dayjs(toValue)) {
        return 'Incorrect date';
      }
      if (formState.errors.to) {
        trigger('to');
      }
    } else {
      const fromValue = getValues('from');
      if (fromValue && dayjs(fromValue) > dayjs(newValue)) {
        return 'Incorrect date';
      }
      if (formState.errors.from) {
        trigger('from');
      }
    }
  }, [ formState.errors.from, formState.errors.to, getValues, name, trigger ]);

  return (
    <FormFieldText<FormFields, typeof name>
      name={ name }
      inputProps={{ type: 'datetime-local', max: dayjs().format('YYYY-MM-DDTHH:mm'), lang: NUMBER_LOCALES[locale] }}
      placeholder={ name === 'from' ? t('common.from') : t('common.to') }
      required
      rules={{ validate }}
      maxW={{ base: 'auto', lg: '220px' }}
    />
  );
};

export default React.memo(CsvExportFormField);
