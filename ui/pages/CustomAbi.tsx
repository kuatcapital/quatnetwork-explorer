// Modified by Quat Capital, 2026-10-26: account interface localization. GPL-3.0.
import { Box } from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { CustomAbi } from 'types/api/account';

import useApiQuery from 'lib/api/useApiQuery';
import { CUSTOM_ABI } from 'stubs/account';
import { Button } from 'toolkit/chakra/button';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import CustomAbiModal from 'ui/customAbi/CustomAbiModal/CustomAbiModal';
import CustomAbiListItem from 'ui/customAbi/CustomAbiTable/CustomAbiListItem';
import CustomAbiTable from 'ui/customAbi/CustomAbiTable/CustomAbiTable';
import DeleteCustomAbiModal from 'ui/customAbi/DeleteCustomAbiModal';
import AccountPageDescription from 'ui/shared/AccountPageDescription';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import PageTitle from 'ui/shared/Page/PageTitle';
import useRedirectForInvalidAuthToken from 'ui/snippets/auth/useRedirectForInvalidAuthToken';

const CustomAbiPage: React.FC = () => {
  const { t: tAcct } = useTranslation();
  const customAbiModalProps = useDisclosure();
  const deleteModalProps = useDisclosure();
  useRedirectForInvalidAuthToken();

  const [ customAbiModalData, setCustomAbiModalData ] = useState<CustomAbi>();
  const [ deleteModalData, setDeleteModalData ] = useState<CustomAbi>();

  const { data, isPlaceholderData, isError } = useApiQuery('general:custom_abi', {
    queryOptions: {
      placeholderData: Array(3).fill(CUSTOM_ABI),
    },
  });

  const onEditClick = useCallback((data: CustomAbi) => {
    setCustomAbiModalData(data);
    customAbiModalProps.onOpen();
  }, [ customAbiModalProps ]);

  const onCustomAbiModalOpenChange = useCallback(({ open }: { open: boolean }) => {
    !open && setCustomAbiModalData(undefined);
    customAbiModalProps.onOpenChange({ open });
  }, [ customAbiModalProps ]);

  const onDeleteClick = useCallback((data: CustomAbi) => {
    setDeleteModalData(data);
    deleteModalProps.onOpen();
  }, [ deleteModalProps ]);

  const onDeleteModalOpenChange = useCallback(({ open }: { open: boolean }) => {
    !open && setDeleteModalData(undefined);
    deleteModalProps.onOpenChange({ open });
  }, [ deleteModalProps ]);

  const description = (
    <AccountPageDescription>
      { tAcct('accountUI.custom_abi_description') }</AccountPageDescription>
  );

  const content = (() => {
    if (isError) {
      return <DataFetchAlert/>;
    }

    const list = (
      <>
        <Box display={{ base: 'block', lg: 'none' }}>
          { data?.map((item, index) => (
            <CustomAbiListItem
              key={ item.id + (isPlaceholderData ? String(index) : '') }
              item={ item }
              isLoading={ isPlaceholderData }
              onDeleteClick={ onDeleteClick }
              onEditClick={ onEditClick }
            />
          )) }
        </Box>
        <Box display={{ base: 'none', lg: 'block' }}>
          <CustomAbiTable
            data={ data }
            isLoading={ isPlaceholderData }
            onDeleteClick={ onDeleteClick }
            onEditClick={ onEditClick }
          />
        </Box>
      </>
    );

    return (
      <>
        { description }
        { Boolean(data?.length) && list }
        <Skeleton mt={ 8 } loading={ isPlaceholderData } display="inline-block">
          <Button
            onClick={ customAbiModalProps.onOpen }
          >
            { tAcct('accountUI.add_custom_abi') }</Button>
        </Skeleton>
        <CustomAbiModal open={ customAbiModalProps.open } onOpenChange={ onCustomAbiModalOpenChange } data={ customAbiModalData }/>
        { deleteModalData && <DeleteCustomAbiModal open={ deleteModalProps.open } onOpenChange={ onDeleteModalOpenChange } data={ deleteModalData }/> }
      </>
    );
  })();

  return (
    <>
      <PageTitle title={ tAcct('accountUI.custom_abi') }/>
      { content }
    </>
  );
};

export default CustomAbiPage;
