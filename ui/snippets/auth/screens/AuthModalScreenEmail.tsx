// Modified by Quat Capital, 2026-10-26: account interface localization. GPL-3.0.
import { chakra, Text } from '@chakra-ui/react';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { EmailFormFields, Screen } from '../types';

import useApiFetch from 'lib/api/useApiFetch';
import getErrorMessage from 'lib/errors/getErrorMessage';
import getErrorObjPayload from 'lib/errors/getErrorObjPayload';
import * as mixpanel from 'lib/mixpanel';
import { Button } from 'toolkit/chakra/button';
import { toaster } from 'toolkit/chakra/toaster';
import { FormFieldEmail } from 'toolkit/components/forms/fields/FormFieldEmail';
import ReCaptcha from 'ui/shared/reCaptcha/ReCaptcha';
import useReCaptcha from 'ui/shared/reCaptcha/useReCaptcha';

interface Props {
  onSubmit: (screen: Screen) => void;
  isAuth?: boolean;
  mixpanelConfig?: {
    account_link_info: {
      source: mixpanel.EventPayload<mixpanel.EventTypes.ACCOUNT_LINK_INFO>['Source'];
    };
  };
}

const AuthModalScreenEmail = ({ onSubmit, isAuth, mixpanelConfig }: Props) => {
  const { t: tAcct } = useTranslation();

  const apiFetch = useApiFetch();
  const recaptcha = useReCaptcha();

  const formApi = useForm<EmailFormFields>({
    mode: 'onBlur',
    defaultValues: {
      email: '',
    },
  });

  const sendCodeFetchFactory = React.useCallback((email: string) => (recaptchaToken?: string) => {
    return apiFetch('general:auth_send_otp', {
      fetchParams: {
        method: 'POST',
        body: { email, recaptcha_response: recaptchaToken },
        headers: {
          ...(recaptchaToken && { 'recaptcha-v2-response': recaptchaToken }),
        },
      },
    });
  }, [ apiFetch ]);

  const onFormSubmit: SubmitHandler<EmailFormFields> = React.useCallback(async(formData) => {
    try {
      await recaptcha.fetchProtectedResource(sendCodeFetchFactory(formData.email));

      if (isAuth) {
        mixpanelConfig?.account_link_info.source !== 'Profile' && mixpanel.logEvent(mixpanel.EventTypes.ACCOUNT_LINK_INFO, {
          Source: mixpanelConfig?.account_link_info.source ?? 'Profile dropdown',
          Status: 'OTP sent',
          Type: 'Email',
        });
      } else {
        mixpanel.logEvent(mixpanel.EventTypes.LOGIN, {
          Action: 'OTP sent',
          Source: 'Email',
        });
      }
      onSubmit({ type: 'otp_code', email: formData.email, isAuth });
    } catch (error) {
      toaster.error({
        title: tAcct('accountUI.error'),
        description: getErrorObjPayload<{ message: string }>(error)?.message || getErrorMessage(error) || tAcct('accountUI.unexpected_error'),
      });
    }
  }, [ recaptcha, sendCodeFetchFactory, isAuth, onSubmit, mixpanelConfig?.account_link_info.source, tAcct ]);

  return (
    <FormProvider { ...formApi }>
      <chakra.form
        noValidate
        onSubmit={ formApi.handleSubmit(onFormSubmit) }
      >
        <Text>{ tAcct('accountUI.account_email_description') }</Text>
        <FormFieldEmail<EmailFormFields>
          name="email"
          required
          placeholder={ tAcct('accountUI.email') }
          bgColor="dialog.bg"
          mt={ 6 }
        />
        <ReCaptcha { ...recaptcha }/>
        <Button
          mt={ 6 }
          type="submit"
          disabled={ formApi.formState.isSubmitting || recaptcha.isInitError }
          loading={ formApi.formState.isSubmitting }
          loadingText={ tAcct('accountUI.send_code') }
        >
          { tAcct('accountUI.send_code') }</Button>
      </chakra.form>
    </FormProvider>
  );
};

export default React.memo(AuthModalScreenEmail);
