// Modified by Quat Capital, 2026-10-26: account interface localization. GPL-3.0.
import { Box, chakra, Flex } from '@chakra-ui/react';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Alert } from 'toolkit/chakra/alert';
import { Button } from 'toolkit/chakra/button';

interface Props {
  onShowListClick: () => void;
  onAddTokenInfoClick: () => void;
  isToken?: boolean;
  address: string;
}

const AddressVerificationStepSuccess = ({ onAddTokenInfoClick, onShowListClick, isToken, address }: Props) => {
  const { t: tAcct } = useTranslation();
  return (
    <Box>
      <Alert status="success" descriptionProps={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }} mb={ 3 } display="inline-block">
        <Trans i18nKey="accountUI.ownership_verified" components={{ address: <chakra.span fontWeight={ 700 }>{ address }</chakra.span> }}/>
      </Alert>
      <p>{ tAcct('accountUI.ownership_next') }</p>
      <Flex alignItems="center" mt={ 8 } columnGap={ 5 } flexWrap="wrap" rowGap={ 5 }>
        <Button variant={ isToken ? 'outline' : 'solid' } onClick={ onShowListClick }>
          { tAcct('accountUI.view_verified_addresses') }</Button>
        { isToken && (
          <Button onClick={ onAddTokenInfoClick }>
            { tAcct('accountUI.add_token_information') }</Button>
        ) }
      </Flex>
    </Box>
  );
};

export default React.memo(AddressVerificationStepSuccess);
