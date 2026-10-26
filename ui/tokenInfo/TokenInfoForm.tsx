// Modified by Quat Capital, 2026-10-26: marketplace, rewards or token info localization. GPL-3.0.
import { Grid, GridItem, Text } from '@chakra-ui/react';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { Fields } from './types';
import type { TokenInfoApplication } from 'types/api/account';

import config from 'configs/app';
import type { ResourceError } from 'lib/api/resources';
import useApiFetch from 'lib/api/useApiFetch';
import useApiQuery from 'lib/api/useApiQuery';
import * as mixpanel from 'lib/mixpanel/index';
import { Button } from 'toolkit/chakra/button';
import { toaster } from 'toolkit/chakra/toaster';
import { FormFieldAddress } from 'toolkit/components/forms/fields/FormFieldAddress';
import { FormFieldEmail } from 'toolkit/components/forms/fields/FormFieldEmail';
import { FormFieldText } from 'toolkit/components/forms/fields/FormFieldText';
import { FormFieldUrl } from 'toolkit/components/forms/fields/FormFieldUrl';
import { noWhitespaceValidator } from 'toolkit/components/forms/validators/text';
import { ContentLoader } from 'toolkit/components/loaders/ContentLoader';
import { useUpdateEffect } from 'toolkit/hooks/useUpdateEffect';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

import TokenInfoFieldIconUrl from './fields/TokenInfoFieldIconUrl';
import TokenInfoFieldProjectSector from './fields/TokenInfoFieldProjectSector';
import TokenInfoFieldSocialLink from './fields/TokenInfoFieldSocialLink';
import TokenInfoFieldSupport from './fields/TokenInfoFieldSupport';
import TokenInfoFormSectionHeader from './TokenInfoFormSectionHeader';
import TokenInfoFormStatusText from './TokenInfoFormStatusText';
import { getFormDefaultValues, prepareRequestBody } from './utils';

interface Props {
  address: string;
  tokenName: string;
  application?: TokenInfoApplication;
  onSubmit: (application: TokenInfoApplication) => void;
}

const TokenInfoForm = ({ address, tokenName, application, onSubmit }: Props) => {
  const { t: tEco } = useTranslation();

  const containerRef = React.useRef<HTMLFormElement>(null);
  const openEventSent = React.useRef<boolean>(false);

  const apiFetch = useApiFetch();

  const configQuery = useApiQuery('admin:token_info_applications_config', {
    pathParams: { chainId: config.chain.id },
  });

  const formApi = useForm<Fields>({
    mode: 'onBlur',
    defaultValues: getFormDefaultValues(address, tokenName, application),
  });
  const { handleSubmit, formState } = formApi;

  React.useEffect(() => {
    if (!application?.id && !openEventSent.current) {
      mixpanel.logEvent(mixpanel.EventTypes.VERIFY_TOKEN, { Action: 'Form opened' });
      openEventSent.current = true;
    }
  }, [ application?.id ]);

  const onFormSubmit: SubmitHandler<Fields> = React.useCallback(async(data) => {
    try {
      const submission = prepareRequestBody(data);
      const isNewApplication = !application?.id || [ 'REJECTED', 'APPROVED' ].includes(application.status);

      const result = await apiFetch<'admin:token_info_applications', TokenInfoApplication, { message: string }>('admin:token_info_applications', {
        pathParams: { chainId: config.chain.id, id: !isNewApplication ? application.id : undefined },
        fetchParams: {
          method: isNewApplication ? 'POST' : 'PUT',
          body: { submission },
        },
      });

      if ('id' in result) {
        onSubmit(result);

        if (!application?.id) {
          mixpanel.logEvent(mixpanel.EventTypes.VERIFY_TOKEN, { Action: 'Submit' });
        }

      } else {
        throw result;
      }
    } catch (error) {
      toaster.error({
        title: tEco('accountUI.error'),
        description: (error as ResourceError<{ message: string }>)?.payload?.message || tEco('marketplaceUI.retry_error'),
      });
    }
  }, [ apiFetch, application?.id, application?.status, onSubmit, tEco ]);

  useUpdateEffect(() => {
    if (formState.submitCount > 0 && !formState.isValid) {
      containerRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [ formState.isValid, formState.submitCount ]);

  const nonWhitespaceFieldRules = React.useMemo(() => {
    return {
      validate: {
        no_whitespace: noWhitespaceValidator,
      },
    };
  }, []);

  if (configQuery.isError) {
    return <DataFetchAlert/>;
  }

  if (configQuery.isPending) {
    return <ContentLoader/>;
  }

  const fieldProps = {
    readOnly: application?.status === 'IN_PROCESS',
  };

  return (
    <FormProvider { ...formApi }>
      <form noValidate onSubmit={ handleSubmit(onFormSubmit) } autoComplete="off" ref={ containerRef }>
        <TokenInfoFormStatusText application={ application }/>
        <Grid mt={ 8 } gridTemplateColumns={{ base: '1fr', lg: '1fr 1fr' }} columnGap={ 5 } rowGap={ 5 }>

          <FormFieldText<Fields> name="token_name" required placeholder={ tEco('tokenInfoUI.token_name') } { ...fieldProps } readOnly/>
          <FormFieldAddress<Fields> name="address" required placeholder={ tEco('tokenInfoUI.contract_address') } { ...fieldProps } readOnly/>
          <FormFieldText<Fields> name="requester_name" required placeholder={ tEco('tokenInfoUI.requester_name') } { ...fieldProps }/>
          <FormFieldEmail<Fields> name="requester_email" required placeholder={ tEco('tokenInfoUI.requester_email') } { ...fieldProps }/>

          <TokenInfoFormSectionHeader>{ tEco('tokenInfoUI.project_info') }</TokenInfoFormSectionHeader>
          <FormFieldText<Fields> name="project_name" placeholder={ tEco('accountUI.project_name') } { ...fieldProps } rules={ nonWhitespaceFieldRules }/>
          <TokenInfoFieldProjectSector { ...fieldProps } config={ configQuery.data.projectSectors }/>
          <FormFieldEmail<Fields> name="project_email" required placeholder={ tEco('tokenInfoUI.official_email') } { ...fieldProps }/>
          <FormFieldUrl<Fields> name="project_website" required placeholder={ tEco('tokenInfoUI.official_website') } { ...fieldProps }/>
          <FormFieldUrl<Fields> name="docs" placeholder={ tEco('tokenInfoUI.docs') } { ...fieldProps }/>
          <TokenInfoFieldSupport { ...fieldProps }/>
          <GridItem colSpan={{ base: 1, lg: 2 }}>
            <TokenInfoFieldIconUrl { ...fieldProps }/>
          </GridItem>
          <GridItem colSpan={{ base: 1, lg: 2 }}>
            <FormFieldText<Fields>
              name="project_description"
              required
              placeholder={ tEco('tokenInfoUI.description') }
              maxH="160px"
              rules={{ maxLength: 300, ...nonWhitespaceFieldRules }}
              asComponent="Textarea"
              { ...fieldProps }
            />
            <Text color="text.secondary" fontSize="sm" mt={ 1 }>
              { tEco('tokenInfoUI.description_hint') }</Text>
          </GridItem>

          <TokenInfoFormSectionHeader>{ tEco('marketplaceUI.links') }</TokenInfoFormSectionHeader>
          <TokenInfoFieldSocialLink { ...fieldProps } name="github"/>
          <TokenInfoFieldSocialLink { ...fieldProps } name="twitter"/>
          <TokenInfoFieldSocialLink { ...fieldProps } name="telegram"/>
          <TokenInfoFieldSocialLink { ...fieldProps } name="opensea"/>
          <TokenInfoFieldSocialLink { ...fieldProps } name="linkedin"/>
          <TokenInfoFieldSocialLink { ...fieldProps } name="facebook"/>
          <TokenInfoFieldSocialLink { ...fieldProps } name="discord"/>
          <TokenInfoFieldSocialLink { ...fieldProps } name="medium"/>
          <TokenInfoFieldSocialLink { ...fieldProps } name="slack"/>
          <TokenInfoFieldSocialLink { ...fieldProps } name="reddit"/>

          <TokenInfoFormSectionHeader>{ tEco('tokenInfoUI.price_data') }</TokenInfoFormSectionHeader>
          <FormFieldUrl<Fields> name="ticker_coin_market_cap" placeholder={ tEco('tokenInfoUI.coinmarketcap_url') } { ...fieldProps }/>
          <FormFieldUrl<Fields> name="ticker_coin_gecko" placeholder={ tEco('tokenInfoUI.coingecko_url') } { ...fieldProps }/>
          <GridItem colSpan={{ base: 1, lg: 2 }}>
            <FormFieldUrl<Fields> name="ticker_defi_llama" placeholder={ tEco('tokenInfoUI.defillama_url') } { ...fieldProps }/>
          </GridItem>

          <GridItem colSpan={{ base: 1, lg: 2 }}>
            <FormFieldText<Fields>
              name="comment"
              placeholder={ tEco('tokenInfoUI.comment') }
              maxH="160px"
              rules={{ maxLength: 300 }}
              asComponent="Textarea"
              { ...fieldProps }
            />
          </GridItem>
        </Grid>
        <Button
          type="submit"
          mt={ 8 }
          loading={ formState.isSubmitting }
          loadingText={ tEco('accountUI.send_request') }
          disabled={ application?.status === 'IN_PROCESS' }
        >
          { tEco('accountUI.send_request') }</Button>
      </form>
    </FormProvider>
  );
};

export default React.memo(TokenInfoForm);
