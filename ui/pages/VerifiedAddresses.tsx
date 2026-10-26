// Modified by Quat Capital, 2026-10-26: account interface localization. GPL-3.0.
import { List, chakra, Box } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import type { VerifiedAddress, TokenInfoApplication, TokenInfoApplications, VerifiedAddressResponse } from 'types/api/account';

import config from 'configs/app';
import useApiQuery, { getResourceKey } from 'lib/api/useApiQuery';
import { PAGE_TYPE_DICT } from 'lib/mixpanel/getPageType';
import getQueryParamString from 'lib/router/getQueryParamString';
import { TOKEN_INFO_APPLICATION, VERIFIED_ADDRESS } from 'stubs/account';
import { Button } from 'toolkit/chakra/button';
import { Link } from 'toolkit/chakra/link';
import { BackToButton } from 'toolkit/components/buttons/BackToButton';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import AddressVerificationModal from 'ui/addressVerification/AddressVerificationModal';
import AccountPageDescription from 'ui/shared/AccountPageDescription';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import AdminSupportText from 'ui/shared/texts/AdminSupportText';
import useProfileQuery from 'ui/snippets/auth/useProfileQuery';
import useRedirectForInvalidAuthToken from 'ui/snippets/auth/useRedirectForInvalidAuthToken';
import TokenInfoForm from 'ui/tokenInfo/TokenInfoForm';
import VerifiedAddressesEmailAlert from 'ui/verifiedAddresses/VerifiedAddressesEmailAlert';
import VerifiedAddressesListItem from 'ui/verifiedAddresses/VerifiedAddressesListItem';
import VerifiedAddressesTable from 'ui/verifiedAddresses/VerifiedAddressesTable';

const VerifiedAddresses = () => {
  const { t: tAcct } = useTranslation();
  useRedirectForInvalidAuthToken();

  const router = useRouter();
  const addressHash = getQueryParamString(router.query.address);

  const [ selectedAddress, setSelectedAddress ] = React.useState<string | undefined>(addressHash);

  React.useEffect(() => {
    addressHash && router.replace({ pathname: '/account/verified-addresses' });
  // componentDidMount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ ]);

  const modalProps = useDisclosure();
  const queryClient = useQueryClient();

  const profileQuery = useProfileQuery();

  const addressesQuery = useApiQuery('contractInfo:verified_addresses', {
    pathParams: { chainId: config.chain.id },
    queryOptions: {
      placeholderData: { verifiedAddresses: Array(3).fill(VERIFIED_ADDRESS) },
      enabled: Boolean(profileQuery.data?.email),
    },
  });
  const applicationsQuery = useApiQuery('admin:token_info_applications', {
    pathParams: { chainId: config.chain.id, id: undefined },
    queryOptions: {
      placeholderData: { submissions: Array(3).fill(TOKEN_INFO_APPLICATION) },
      enabled: Boolean(profileQuery.data?.email),
      select: (data) => {
        return {
          ...data,
          submissions: data.submissions.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
        };
      },
    },
  });

  const isLoading = addressesQuery.isPlaceholderData || applicationsQuery.isPlaceholderData;
  const userWithoutEmail = profileQuery.data && !profileQuery.data.email;

  const handleGoBack = React.useCallback(() => {
    setSelectedAddress(undefined);
  }, []);

  const handleItemAdd = React.useCallback((address: string) => {
    setSelectedAddress(address);
  }, []);
  const handleItemEdit = React.useCallback((address: string) => {
    setSelectedAddress(address);
  }, []);

  const handleAddressSubmit = React.useCallback((newItem: VerifiedAddress) => {
    queryClient.setQueryData(
      getResourceKey('contractInfo:verified_addresses', { pathParams: { chainId: config.chain.id } }),
      (prevData: VerifiedAddressResponse | undefined) => {
        if (!prevData) {
          return { verifiedAddresses: [ newItem ] };
        }

        return {
          verifiedAddresses: [ newItem, ...prevData.verifiedAddresses ],
        };
      });
  }, [ queryClient ]);

  const handleApplicationSubmit = React.useCallback((newItem: TokenInfoApplication) => {
    setSelectedAddress(undefined);
    queryClient.setQueryData(
      getResourceKey('admin:token_info_applications', { pathParams: { chainId: config.chain.id, id: undefined } }),
      (prevData: TokenInfoApplications | undefined) => {
        if (!prevData) {
          return { submissions: [ newItem ] };
        }

        const isExisting = prevData.submissions.some((item) => item.id.toLowerCase() === newItem.id.toLowerCase());
        const submissions = isExisting ?
          prevData.submissions.map((item) => item.id.toLowerCase() === newItem.id.toLowerCase() ? newItem : item) :
          [ newItem, ...prevData.submissions ];
        return { submissions };
      });
  }, [ queryClient ]);

  const addButton = (() => {
    if (userWithoutEmail) {
      return (
        <Button disabled mt={ 8 }>
          { tAcct('accountUI.add_address') }</Button>
      );
    }

    return (
      <Button onClick={ modalProps.onOpen } loadingSkeleton={ isLoading } mt={ 8 }>
        { tAcct('accountUI.add_address') }</Button>
    );
  })();

  if (selectedAddress) {
    const addressInfo = addressesQuery.data?.verifiedAddresses.find(({ contractAddress }) => contractAddress.toLowerCase() === selectedAddress.toLowerCase());
    const tokenName = addressInfo ? `${ addressInfo.metadata.tokenName } (${ addressInfo.metadata.tokenSymbol })` : '';
    const beforeTitle = <BackToButton onClick={ handleGoBack } hint={ tAcct('accountUI.back_verified_addresses') } mr={ 3 }/>;

    return (
      <>
        <PageTitle title={ tAcct('accountUI.token_info_form') } beforeTitle={ beforeTitle }/>
        <TokenInfoForm
          address={ selectedAddress }
          tokenName={ tokenName }
          application={ applicationsQuery.data?.submissions.find(({ tokenAddress }) => tokenAddress.toLowerCase() === selectedAddress.toLowerCase()) }
          onSubmit={ handleApplicationSubmit }
        />
      </>
    );
  }

  const content = (() => {
    if (userWithoutEmail) {
      return null;
    }

    if (addressesQuery.data?.verifiedAddresses) {
      return (
        <>
          <Box hideFrom="lg" key="content-mobile">
            { addressesQuery.data.verifiedAddresses.map((item, index) => (
              <VerifiedAddressesListItem
                key={ item.contractAddress + (isLoading ? index : '') }
                item={ item }
                application={
                  applicationsQuery.data?.submissions
                    ?.find(({ tokenAddress }) => tokenAddress.toLowerCase() === item.contractAddress.toLowerCase())
                }
                onAdd={ handleItemAdd }
                onEdit={ handleItemEdit }
                isLoading={ isLoading }
              />
            )) }
          </Box>
          <Box hideBelow="lg" key="content-desktop">
            <VerifiedAddressesTable
              data={ addressesQuery.data.verifiedAddresses }
              applications={ applicationsQuery.data?.submissions }
              onItemEdit={ handleItemEdit }
              onItemAdd={ handleItemAdd }
              isLoading={ isLoading }
            />
          </Box>
        </>
      );
    }

    return null;
  })();

  return (
    <>
      <PageTitle title={ tAcct('accountUI.my_verified_addresses') }/>
      { userWithoutEmail && <VerifiedAddressesEmailAlert/> }
      <AccountPageDescription allowCut={ false }>
        <span>
          { tAcct('accountUI.ownership_description') }</span>
        <chakra.p fontWeight={ 600 } mt={ 5 }>
          { tAcct('accountUI.before_starting') }</chakra.p>
        <List.Root pl={ 5 } as="ol">
          <List.Item>{ tAcct('accountUI.source_deployed', { chain: config.chain.name }) }</List.Item>
          <List.Item>
            <Trans
              i18nKey="accountUI.source_verified"
              components={{ tool: <Link href="https://docs.blockscout.com/devs/verification" external noIcon/> }}
            />
          </List.Item>
        </List.Root>
        <chakra.div mt={ 5 }>
          { tAcct('accountUI.ownership_get_started') }</chakra.div>
        <AdminSupportText mt={ 5 }/>
      </AccountPageDescription>
      <DataListDisplay
        isError={ profileQuery.isError || addressesQuery.isError || applicationsQuery.isError }
        itemsNum={ addressesQuery.data?.verifiedAddresses.length }
        emptyText=""
      >
        { content }
      </DataListDisplay>
      { addButton }
      <AddressVerificationModal
        pageType={ PAGE_TYPE_DICT['/account/verified-addresses'] }
        open={ modalProps.open }
        onOpenChange={ modalProps.onOpenChange }
        onSubmit={ handleAddressSubmit }
        onAddTokenInfoClick={ handleItemAdd }
        onShowListClick={ modalProps.onClose }
      />
    </>
  );
};

export default React.memo(VerifiedAddresses);
