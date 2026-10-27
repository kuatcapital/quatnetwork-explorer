// Modified by Quat Capital, 2026-10-27: runtime developer-page labels; auth/analytics payloads preserved. GPL-3.0.
import { VStack, Code, Flex, Box } from '@chakra-ui/react';
import mixpanel from 'mixpanel-browser';
import type { ChangeEvent } from 'react';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import config from 'configs/app';
import * as cookies from 'lib/cookies';
import { formatNumber } from 'lib/format/localeNumbers';
import useFeatureValue from 'lib/growthbook/useFeatureValue';
import useGradualIncrement from 'lib/hooks/useGradualIncrement';
import { useLocale } from 'lib/i18n/provider';
import { useRollbar } from 'lib/rollbar';
import { Alert } from 'toolkit/chakra/alert';
import { Button } from 'toolkit/chakra/button';
import { Textarea } from 'toolkit/chakra/textarea';
import { toaster } from 'toolkit/chakra/toaster';
import PageTitle from 'ui/shared/Page/PageTitle';

const Login = () => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const rollbar = useRollbar();
  const [ num, setNum ] = useGradualIncrement(0);
  const testFeature = useFeatureValue('test_value', 'fallback');

  const [ isFormVisible, setFormVisibility ] = React.useState(false);
  const [ token, setToken ] = React.useState('');

  React.useEffect(() => {
    const token = cookies.get(cookies.NAMES.API_TOKEN);
    setFormVisibility(Boolean(!token && config.features.account.isEnabled));
    // throw new Error('Render error');
  }, []);

  const checkRollbar = React.useCallback(() => {
    rollbar?.error('Test error', { payload: 'foo' });
  }, [ rollbar ]);

  const checkMixpanel = React.useCallback(() => {
    mixpanel.track('Test event', { my_prop: 'foo bar' });
  }, []);

  const handleTokenChange = React.useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
    setToken(event.target.value);
  }, []);

  const handleSetTokenClick = React.useCallback(() => {
    cookies.set(cookies.NAMES.API_TOKEN, token);
    setToken('');
    toaster.create({
      title: t('developerUi.cookie_success'),
      description: t('developerUi.cookie_set'),
      type: 'success',
      onStatusChange: (details) => {
        if (details.status === 'unmounted') {
          setFormVisibility(false);
        }
      },
    });
  }, [ token, t ]);

  const handleNumIncrement = React.useCallback(() => {
    for (let index = 0; index < 5; index++) {
      setNum(5);
    }
  }, [ setNum ]);

  return (
    <VStack gap={ 4 } alignItems="flex-start" maxW="1000px">
      <PageTitle title={ t('developerUi.login_title') }/>
      { isFormVisible && (
        <>
          <Alert
            status="warning"
            title={ t('developerUi.temporary_auth') }
            inline={ false }
          >
            <Trans t={ t } i18nKey="developerUi.auth_hint" components={{ cookie: <Code ml={ 1 }>{ cookies.NAMES.API_TOKEN }</Code> }}/>
          </Alert>
          <Textarea value={ token } onChange={ handleTokenChange } placeholder={ t('developerUi.api_token') }/>
          <Button onClick={ handleSetTokenClick }>{ t('developerUi.set_cookie') }</Button>
        </>
      ) }
      <Flex columnGap={ 2 }>
        <Button colorScheme="red" onClick={ checkRollbar }>{ t('developerUi.check_rollbar') }</Button>
        <Button colorScheme="teal" onClick={ checkMixpanel }>{ t('developerUi.check_mixpanel') }</Button>
      </Flex>
      <Flex columnGap={ 2 } alignItems="center">
        <Box w="50px" textAlign="center">{ formatNumber(num, locale) }</Box>
        <Button onClick={ handleNumIncrement } size="sm">{ t('developerUi.add') }</Button>
      </Flex>
      <Box>{ t('developerUi.test_value') } <b>{ testFeature.isLoading ? t('developerUi.loading') : JSON.stringify(testFeature.value) }</b></Box>
    </VStack>
  );

};

export default Login;
