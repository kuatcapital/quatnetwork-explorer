// Modified by Quat Capital, 2026-10-26: account interface localization. GPL-3.0.
import { Box, chakra, Flex } from '@chakra-ui/react';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useSignMessage, useAccount, useSwitchChain } from 'wagmi';

import type {
  AddressVerificationFormSecondStepFields,
  AddressCheckStatusSuccess,
  AddressVerificationFormFirstStepFields,
  RootFields,
  AddressVerificationResponseError,
  AddressValidationResponseSuccess,
} from '../types';
import type { VerifiedAddress } from 'types/api/account';

import config from 'configs/app';
import useApiFetch from 'lib/api/useApiFetch';
import shortenString from 'lib/shortenString';
import useWallet from 'lib/web3/useWallet';
import { Alert } from 'toolkit/chakra/alert';
import { Button } from 'toolkit/chakra/button';
import { Link } from 'toolkit/chakra/link';
import { Radio, RadioGroup } from 'toolkit/chakra/radio';
import { FormFieldText } from 'toolkit/components/forms/fields/FormFieldText';
import { SIGNATURE_REGEXP } from 'toolkit/components/forms/validators/signature';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import AdminSupportText from 'ui/shared/texts/AdminSupportText';

type Fields = RootFields & AddressVerificationFormSecondStepFields;

type SignMethod = 'wallet' | 'manual';

interface Props extends AddressVerificationFormFirstStepFields, AddressCheckStatusSuccess {
  onContinue: (newItem: VerifiedAddress, signMethod: SignMethod) => void;
  noWeb3Provider?: boolean;
}

const AddressVerificationStepSignature = ({ address, signingMessage, contractCreator, contractOwner, onContinue, noWeb3Provider }: Props) => {
  const { t: tAcct } = useTranslation();
  const [ signMethod, setSignMethod ] = React.useState<SignMethod>(noWeb3Provider ? 'manual' : 'wallet');

  const { isConnected } = useAccount();
  const { openModal: openWeb3Modal } = useWallet({ source: 'Smart contracts' });

  const formApi = useForm<Fields>({
    mode: 'onBlur',
    defaultValues: {
      message: signingMessage,
    },
  });
  const { handleSubmit, formState, setValue, getValues, setError, clearErrors, watch } = formApi;

  const apiFetch = useApiFetch();

  const signature = watch('signature');
  React.useEffect(() => {
    clearErrors('root');
  }, [ clearErrors, signature ]);

  const onFormSubmit: SubmitHandler<Fields> = React.useCallback(async(data) => {
    try {
      const body = {
        contractAddress: address,
        message: data.message,
        signature: data.signature,
      };

      const response = await apiFetch<'contractInfo:address_verification', AddressValidationResponseSuccess, AddressVerificationResponseError>(
        'contractInfo:address_verification',
        {
          fetchParams: { method: 'POST', body },
          pathParams: { chainId: config.chain.id, type: ':verify' },
        },
      );

      if (response.status !== 'SUCCESS') {
        const type = typeof response.status === 'number' ? 'UNKNOWN_STATUS' : response.status;
        return setError('root', { type, message: response.status === 'INVALID_SIGNER_ERROR' ? response.invalidSigner.signer : undefined });
      }

      onContinue(response.result.verifiedAddress, signMethod);
    } catch (error) {
      setError('root', { type: 'UNKNOWN_STATUS' });
    }
  }, [ address, apiFetch, onContinue, setError, signMethod ]);

  const onSubmit = handleSubmit(onFormSubmit);

  const { signMessage, isPending: isSigning } = useSignMessage();
  const { switchChainAsync } = useSwitchChain();

  const handleSignMethodChange = React.useCallback(({ value }: { value: string | null }) => {
    if (!value) {
      return;
    }

    setSignMethod(value as SignMethod);
    clearErrors('root');
  }, [ clearErrors ]);

  const handleOpenWeb3Modal = React.useCallback(() => {
    clearErrors('root');
    openWeb3Modal();
  }, [ clearErrors, openWeb3Modal ]);

  const handleWeb3SignClick = React.useCallback(async() => {
    clearErrors('root');

    if (!isConnected) {
      return setError('root', { type: 'manual', message: tAcct('accountUI.connect_web3_first') });
    }

    await switchChainAsync({ chainId: Number(config.chain.id) });
    const message = getValues('message');
    signMessage({ message }, {
      onSuccess: (data) => {
        setValue('signature', data);
        onSubmit();
      },
      onError: (error) => {
        return setError('root', { type: 'SIGNING_FAIL', message: (error as Error)?.message || tAcct('accountUI.oops_error') });
      },
    });
  }, [ clearErrors, isConnected, getValues, signMessage, setError, setValue, onSubmit, switchChainAsync, tAcct ]);

  const handleManualSignClick = React.useCallback(() => {
    clearErrors('root');
    onSubmit();
  }, [ clearErrors, onSubmit ]);

  const button = (() => {
    if (signMethod === 'manual') {
      return (
        <Button
          onClick={ handleManualSignClick }
          loading={ formState.isSubmitting }
          loadingText={ tAcct('accountUI.verifying') }
        >
          { tAcct('accountUI.verify') }</Button>
      );
    }

    return (
      <Button
        onClick={ isConnected ? handleWeb3SignClick : handleOpenWeb3Modal }
        loading={ formState.isSubmitting || isSigning }
        loadingText={ isSigning ? tAcct('accountUI.signing') : tAcct('accountUI.verifying') }
      >
        { isConnected ? tAcct('accountUI.sign_verify') : tAcct('accountUI.connect_wallet') }
      </Button>
    );
  })();

  const contactUsLink = <Link href="mailto:help@blockscout.com" rel="noopener noreferrer"/>;

  const rootError = (() => {
    switch (formState.errors.root?.type) {
      case 'INVALID_SIGNATURE_ERROR': {
        return <span>{ tAcct('accountUI.signature_unprocessed') }</span>;
      }
      case 'VALIDITY_EXPIRED_ERROR': {
        return <span>{ tAcct('accountUI.verification_expired') }</span>;
      }
      case 'SIGNING_FAIL': {
        return <span>{ formState.errors.root.message }</span>;
      }
      case 'INVALID_SIGNER_ERROR': {
        const signer = shortenString(formState.errors.root.message || '');
        const expectedSigners = [ contractCreator, contractOwner ].filter(Boolean).map(s => shortenString(s)).join(', ');
        return (
          <Box>
            <Trans
              i18nKey="accountUI.ownership_wrong_signer"
              components={{ address: <span>{ signer }</span>, creator: <span>{ expectedSigners }</span> }}
            />
          </Box>
        );
      }
      case 'UNKNOWN_STATUS': {
        return (
          <Box>
            <Trans i18nKey="accountUI.ownership_support" components={{ contact: contactUsLink }}/>
          </Box>
        );
      }
      case undefined: {
        return null;
      }
    }
  })();

  return (
    <FormProvider { ...formApi }>
      <form noValidate onSubmit={ onSubmit }>
        { rootError && <Alert status="warning" mb={ 6 }>{ rootError }</Alert> }
        <Box mb={ 8 }>
          <Trans
            i18nKey="accountUI.ownership_signature_instructions"
            components={{
              instructions: (
                <Link href="https://docs.blockscout.com/using-blockscout/my-account/verified-addresses/copy-and-sign-message" external noIcon/>
              ),
              contact: contactUsLink,
            }}
          />
        </Box>
        { (contractOwner || contractCreator) && (
          <Flex flexDir="column" rowGap={ 4 } mb={ 4 }>
            { contractCreator && (
              <Box>
                <chakra.span fontWeight={ 600 }>{ tAcct('accountUI.contract_creator') }</chakra.span>
                <chakra.span>{ contractCreator }</chakra.span>
              </Box>
            ) }
            { contractOwner && (
              <Box>
                <chakra.span fontWeight={ 600 }>{ tAcct('accountUI.contract_owner') }</chakra.span>
                <chakra.span>{ contractOwner }</chakra.span>
              </Box>
            ) }
          </Flex>
        ) }
        <Flex rowGap={ 5 } flexDir="column">
          <Flex flexDir="column">
            <CopyToClipboard text={ signingMessage } ml="auto"/>
            <FormFieldText<Fields>
              name="message"
              placeholder={ tAcct('accountUI.message_to_sign') }
              required
              asComponent="Textarea"
              readOnly
              inputProps={{
                h: { base: '175px', lg: '100px' },
                minH: 'auto',
              }}
            />
          </Flex>
          { !noWeb3Provider && (
            <RadioGroup
              onValueChange={ handleSignMethodChange }
              value={ signMethod }
              display="flex"
              flexDir="column"
              rowGap={ 4 }
            >
              <Radio value="wallet">{ tAcct('accountUI.sign_via_web3') }</Radio>
              <Radio value="manual">{ tAcct('accountUI.sign_manually') }</Radio>
            </RadioGroup>
          ) }
          { signMethod === 'manual' && (
            <FormFieldText<Fields>
              name="signature"
              placeholder={ tAcct('accountUI.signature_hash') }
              required
              rules={{ pattern: SIGNATURE_REGEXP }}
              bgColor="dialog.bg"
            />
          ) }
        </Flex>
        <Flex alignItems={{ base: 'flex-start', lg: 'center' }} mt={ 8 } columnGap={ 5 } rowGap={ 2 } flexDir={{ base: 'column', lg: 'row' }}>
          { button }
          <AdminSupportText/>
        </Flex>
      </form>
    </FormProvider>
  );
};

export default React.memo(AddressVerificationStepSignature);
