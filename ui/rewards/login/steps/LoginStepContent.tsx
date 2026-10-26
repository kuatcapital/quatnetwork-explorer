// Modified by Quat Capital, 2026-10-26: marketplace, rewards or token info localization. GPL-3.0.
import { Text, Box, Flex, Separator } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import type { ChangeEvent } from 'react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useRewardsContext } from 'lib/contexts/rewards';
import * as cookies from 'lib/cookies';
import useWallet from 'lib/web3/useWallet';
import { Alert } from 'toolkit/chakra/alert';
import { Button } from 'toolkit/chakra/button';
import { Field } from 'toolkit/chakra/field';
import { Image } from 'toolkit/chakra/image';
import { Input } from 'toolkit/chakra/input';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Switch } from 'toolkit/chakra/switch';
import useProfileQuery from 'ui/snippets/auth/useProfileQuery';

type Props = {
  goNext: (isReferral: boolean, reward: string | undefined) => void;
  closeModal: () => void;
  openAuthModal: (isAuth: boolean, trySharedLogin?: boolean) => void;
};

const LoginStepContent = ({ goNext, closeModal, openAuthModal }: Props) => {
  const { t: tEco } = useTranslation();
  const router = useRouter();
  const { connect, isConnected, address } = useWallet({ source: 'Merits' });
  const savedRefCode = cookies.get(cookies.NAMES.REWARDS_REFERRAL_CODE);
  const [ isRefCodeUsed, setIsRefCodeUsed ] = React.useState(Boolean(savedRefCode));
  const [ isLoading, setIsLoading ] = React.useState(false);
  const [ refCode, setRefCode ] = React.useState(savedRefCode || '');
  const [ refCodeError, setRefCodeError ] = React.useState(false);
  const { login, checkUserQuery, rewardsConfigQuery } = useRewardsContext();
  const profileQuery = useProfileQuery();

  const isAddressMismatch = React.useMemo(() =>
    Boolean(address) &&
    Boolean(profileQuery.data?.address_hash) &&
    profileQuery.data?.address_hash !== address,
  [ address, profileQuery.data ]);

  const isLoggedIntoAccountWithWallet = React.useMemo(() =>
    !profileQuery.isLoading && profileQuery.data?.address_hash,
  [ profileQuery ]);

  const isSignUp = React.useMemo(() =>
    isConnected && !isAddressMismatch && !checkUserQuery.isFetching && !checkUserQuery.data?.exists,
  [ isConnected, isAddressMismatch, checkUserQuery ]);

  const canTrySharedLogin = rewardsConfigQuery.data?.auth?.shared_siwe_login && checkUserQuery.data?.exists !== false && !isLoggedIntoAccountWithWallet;

  const handleRefCodeChange = React.useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setRefCode(event.target.value);
  }, []);

  const loginToRewardsProgram = React.useCallback(async() => {
    try {
      setRefCodeError(false);
      setIsLoading(true);
      const { isNewUser, reward, invalidRefCodeError } = await login(isSignUp && isRefCodeUsed ? refCode : '');
      if (invalidRefCodeError) {
        setRefCodeError(true);
      } else {
        if (isNewUser) {
          goNext(isRefCodeUsed, reward);
        } else {
          closeModal();
          router.push({ pathname: '/account/merits' }, undefined, { shallow: true });
        }
      }
    } catch (error) {}
    setIsLoading(false);
  }, [ login, goNext, router, closeModal, refCode, isRefCodeUsed, isSignUp ]);

  React.useEffect(() => {
    const isInvalid = isSignUp && isRefCodeUsed && refCode.length > 0 && refCode.length !== 6 && refCode.length !== 12;
    setRefCodeError(isInvalid);
  }, [ refCode, isRefCodeUsed, isSignUp ]);

  const handleButtonClick = React.useCallback(() => {
    if (canTrySharedLogin) {
      return openAuthModal(Boolean(profileQuery.data?.email), true);
    }

    if (!isConnected) {
      return connect();
    }

    if (isLoggedIntoAccountWithWallet) {
      return loginToRewardsProgram();
    }

    return openAuthModal(Boolean(profileQuery.data?.email));
  }, [ loginToRewardsProgram, openAuthModal, profileQuery, connect, isConnected, isLoggedIntoAccountWithWallet, canTrySharedLogin ]);

  const handleToggleChange = React.useCallback(() => {
    setIsRefCodeUsed((prev) => !prev);
  }, []);

  const buttonText = React.useMemo(() => {
    if (canTrySharedLogin) {
      return tEco('accountUI.continue_wallet');
    }

    if (!isConnected) {
      return tEco('accountUI.connect_wallet');
    }
    if (isLoggedIntoAccountWithWallet) {
      return isSignUp ? tEco('marketplaceUI.get_started') : tEco('rewardsUI.continue');
    }
    return profileQuery.data?.email ? tEco('rewardsUI.add_wallet_account') : tEco('rewardsUI.login_account');
  }, [ canTrySharedLogin, isConnected, isLoggedIntoAccountWithWallet, profileQuery.data?.email, isSignUp, tEco ]);

  return (
    <>
      <Image
        src="/static/merits/merits_program.png"
        alt={ tEco('rewardsUI.merits_program') }
        mb={ 3 }
        fallback={ <Skeleton loading w="full" h="120px"/> }
      />
      <Box mb={ 6 }>
        { tEco('rewardsUI.merits_description') }<Link external href="https://docs.blockscout.com/using-blockscout/merits" ml={ 1 } fontWeight="500">
          { tEco('rewardsUI.about_merits') }</Link>
      </Box>
      { isSignUp && isLoggedIntoAccountWithWallet && (
        <Box mb={ 6 }>
          <Separator mb={ 6 }/>
          <Flex w="full" alignItems="center" justifyContent="space-between">
            { tEco('rewardsUI.have_referral_code') }<Switch
              size="md"
              checked={ isRefCodeUsed }
              onCheckedChange={ handleToggleChange }
              aria-label={ tEco('rewardsUI.referral_code_switch') }
            />
          </Flex>
          { isRefCodeUsed && (
            <Field
              label={ tEco('rewardsUI.code') }
              floating
              id="referral-code"
              size="lg"
              mt={ 3 }
              invalid={ refCodeError }
              helperText={ tEco('rewardsUI.code_format') }
              errorText={ refCodeError ? tEco('rewardsUI.incorrect_code') : undefined }
            >
              <Input
                value={ refCode }
                onChange={ handleRefCodeChange }
              />
            </Field>
          ) }
        </Box>
      ) }
      { isAddressMismatch && (
        <Alert status="warning" mb={ 4 }>
          { tEco('rewardsUI.wallet_mismatch') }
        </Alert>
      ) }
      <Button
        variant="solid"
        w="full"
        whiteSpace="normal"
        mb={ 4 }
        onClick={ handleButtonClick }
        loading={ isLoading || profileQuery.isLoading || checkUserQuery.isFetching }
        loadingText={ isLoading ? tEco('rewardsUI.sign_wallet_message') : undefined }
        disabled={ isAddressMismatch || refCodeError }
      >
        { buttonText }
      </Button>
      <Text textStyle="sm" color="text.secondary" textAlign="center">
        { tEco('rewardsUI.same_wallet') }</Text>
    </>
  );
};

export default LoginStepContent;
